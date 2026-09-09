/**
 * RPC Error Handler Component
 * Displays user-friendly RPC error messages with fix options
 */

import React, { useState } from 'react';
import { Alert, Button, Card, Typography, Space, Steps, Divider } from 'antd';
import { 
  WarningOutlined, 
  ReloadOutlined, 
  SettingOutlined,
  CheckCircleOutlined,
  WifiOutlined
} from '@ant-design/icons';
import { fixMetaMaskRPC, updateBSCRPC, handleRPCError, getRPCTroubleshootingSteps } from '../../utils/metamaskHelper';

const { Text, Link } = Typography;
const { Step } = Steps;

const RPCErrorHandler = ({ error, onFixed, compact = false }) => {
  const [fixing, setFixing] = useState(false);
  const [fixResult, setFixResult] = useState(null);

  if (!error) return null;

  const errorInfo = handleRPCError(error);

  const handleFixRPC = async () => {
    setFixing(true);
    setFixResult(null);

    try {
      const result = await fixMetaMaskRPC();
      setFixResult(result);
      
      if (result.success) {
        setTimeout(() => {
          if (onFixed) onFixed();
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      setFixResult({
        success: false,
        error: err.message
      });
    } finally {
      setFixing(false);
    }
  };

  const handleUpdateRPC = async () => {
    setFixing(true);
    try {
      const result = await updateBSCRPC();
      setFixResult(result);
    } catch (err) {
      setFixResult({
        success: false,
        error: err.message
      });
    } finally {
      setFixing(false);
    }
  };

  const troubleshootingSteps = getRPCTroubleshootingSteps();

  if (compact) {
    return (
      <Alert
        type={errorInfo.severity}
        showIcon
        message={errorInfo.title}
        description={errorInfo.message}
        action={
          errorInfo.canFix && (
            <Button 
              size="small" 
              type="primary"
              loading={fixing}
              onClick={handleFixRPC}
            >
              Fix RPC
            </Button>
          )
        }
      />
    );
  }

  return (
    <Card className="rpc-error-handler">
      <div className="mb-4">
        <Alert
          type={errorInfo.severity}
          showIcon
          icon={<WarningOutlined />}
          message={
            <div className="flex items-center justify-between">
              <span className="font-semibold">{errorInfo.title}</span>
              <WifiOutlined className="text-red-500" />
            </div>
          }
          description={
            <div className="mt-2">
              <Text>{errorInfo.message}</Text>
              {error.code && (
                <div className="mt-1 text-xs text-gray-500">
                  Error Code: {error.code}
                </div>
              )}
            </div>
          }
        />
      </div>

      {fixResult && (
        <Alert
          className="mb-4"
          type={fixResult.success ? 'success' : 'error'}
          showIcon
          message={fixResult.success ? 'Fix Applied' : 'Fix Failed'}
          description={
            fixResult.success ? (
              <div>
                <div>{fixResult.message}</div>
                <div className="mt-2 text-sm">
                  <CheckCircleOutlined className="text-green-500 mr-1" />
                  Page will reload in 2 seconds...
                </div>
              </div>
            ) : (
              fixResult.error
            )
          }
        />
      )}

      {errorInfo.canFix && (
        <div className="mb-4">
          <Typography.Title level={5}>🔧 Quick Fix</Typography.Title>
          <Space size="middle">
            <Button 
              type="primary"
              icon={<SettingOutlined />}
              loading={fixing}
              onClick={handleFixRPC}
              disabled={fixResult?.success}
            >
              {fixing ? 'Fixing...' : 'Fix RPC Endpoint'}
            </Button>
            
            <Button 
              icon={<ReloadOutlined />}
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </Space>
        </div>
      )}

      <Divider />

      <div>
        <Typography.Title level={5}>📋 Troubleshooting Steps</Typography.Title>
        <Steps 
          direction="vertical" 
          size="small"
          current={fixResult?.success ? 4 : 0}
        >
          {troubleshootingSteps.map((step) => (
            <Step
              key={step.step}
              title={step.title}
              description={step.description}
              status={
                fixResult?.success && step.step <= 2 ? 'finish' :
                fixing && step.step === 1 ? 'process' : 'wait'
              }
            />
          ))}
        </Steps>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded">
        <Typography.Title level={5}>💡 Technical Details</Typography.Title>
        <div className="space-y-1 text-sm">
          <div><strong>Issue:</strong> BSC RPC endpoint overloaded (-32002)</div>
          <div><strong>Solution:</strong> Switch to reliable RPC endpoints</div>
          <div><strong>Recommended RPC:</strong> https://bsc-dataseed1.defibit.io/</div>
          <div><strong>Chain ID:</strong> 56 (BSC Mainnet)</div>
        </div>
      </div>

      <div className="mt-4">
        <Text type="secondary" className="text-xs">
          This error occurs when MetaMask's default BSC RPC endpoint is overloaded. 
          Our system uses multiple reliable endpoints to prevent this issue.
        </Text>
      </div>
    </Card>
  );
};

export default RPCErrorHandler;