/**
 * Nuclear RPC Fix - Complete MetaMask Bypass
 * Last resort fix that completely overrides MetaMask's RPC configuration
 */

import React, { useState } from 'react';
import { Button, Card, Alert, Steps, message, Typography, Divider } from 'antd';
import { ThunderboltFilled, WarningFilled, CheckCircleFilled, RocketOutlined } from '@ant-design/icons';
import { emergencyRPCBypass } from '../../utils/forceRPCBypass';

const { Title, Text } = Typography;
const { Step } = Steps;

const NuclearRPCFix = () => {
  const [fixing, setFixing] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);

  const handleNuclearFix = async () => {
    setFixing(true);
    setCurrentStep(1);

    try {
      message.loading('🚀 Activating nuclear RPC bypass...', 0);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentStep(2);
      message.destroy();
      message.loading('💥 Overriding MetaMask RPC configuration...', 0);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentStep(3);
      message.destroy();
      message.loading('🔧 Implementing direct blockchain connection...', 0);
      
      const bypassResult = await emergencyRPCBypass();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.destroy();
      
      if (bypassResult.success) {
        setFixed(true);
        setResult(bypassResult);
        setCurrentStep(4);
        
        message.success('🎉 Nuclear RPC fix successful!');
        
        // Auto-reload after a delay
        setTimeout(() => {
          message.info('🔄 Reloading with bypassed RPC configuration...');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }, 3000);
      } else {
        throw new Error(bypassResult.error);
      }
    } catch (error) {
      message.destroy();
      message.error(`Nuclear fix failed: ${error.message}`);
      setCurrentStep(0);
    } finally {
      setFixing(false);
    }
  };

  const steps = [
    {
      title: 'Ready to Launch',
      description: 'Nuclear RPC bypass ready',
      icon: <RocketOutlined className="text-purple-500" />
    },
    {
      title: 'Bypassing MetaMask',
      description: 'Overriding RPC configuration...',
      icon: <ThunderboltFilled className="text-orange-500" />
    },
    {
      title: 'Implementing Override',
      description: 'Forcing direct blockchain connection...',
      icon: <ThunderboltFilled className="text-red-500" />
    },
    {
      title: 'Testing Connection',
      description: 'Validating bypass success...',
      icon: <ThunderboltFilled className="text-blue-500" />
    },
    {
      title: 'BYPASSED!',
      description: 'MetaMask RPC completely bypassed',
      icon: <CheckCircleFilled className="text-green-500" />
    }
  ];

  return (
    <Card className="nuclear-rpc-fix max-w-lg mx-auto border-2 border-red-300">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">☢️</div>
        <Title level={2} className="text-red-600 mb-2">
          Nuclear RPC Fix
        </Title>
        <Text className="text-gray-600">
          Complete MetaMask RPC bypass - use only if standard fixes failed
        </Text>
      </div>

      <Alert
        type="warning"
        showIcon
        icon={<WarningFilled />}
        message="⚠️ NUCLEAR OPTION"
        description="This will completely override MetaMask's RPC configuration and force direct blockchain connections. Use only when all other fixes have failed."
        className="mb-6"
      />

      <Steps 
        current={currentStep} 
        direction="vertical" 
        size="small"
        className="mb-6"
      >
        {steps.map((step, index) => (
          <Step
            key={index}
            title={step.title}
            description={step.description}
            icon={step.icon}
            status={
              index < currentStep ? 'finish' :
              index === currentStep ? 'process' : 'wait'
            }
          />
        ))}
      </Steps>

      <div className="text-center mb-4">
        <Button
          type="primary"
          danger
          size="large"
          loading={fixing}
          disabled={fixed}
          onClick={handleNuclearFix}
          className="px-8 py-3 h-auto text-base font-bold"
          style={{
            background: 'linear-gradient(135deg, #ff1744 0%, #d50000 100%)',
            border: 'none',
            boxShadow: '0 4px 15px rgba(255, 23, 68, 0.4)'
          }}
        >
          {fixing ? '💥 BYPASSING...' : fixed ? '✅ BYPASSED!' : '☢️ NUCLEAR FIX'}
        </Button>
      </div>

      {fixed && result && (
        <>
          <Divider />
          <Alert
            type="success"
            showIcon
            message="🎉 Nuclear Bypass Successful!"
            description={
              <div>
                <div className="mb-2">{result.message}</div>
                <div className="text-xs">
                  <div>Current Block: #{result.blockNumber}</div>
                  <div>Endpoint: {result.endpoint}</div>
                </div>
              </div>
            }
            className="mb-4"
          />
        </>
      )}

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm">
        <Title level={5} className="text-red-800 mb-2 flex items-center">
          <ThunderboltFilled className="mr-2" />
          How Nuclear Fix Works
        </Title>
        <ul className="text-red-700 space-y-1 mb-0">
          <li>• <strong>Completely overrides</strong> MetaMask's RPC configuration</li>
          <li>• <strong>Forces direct connection</strong> to reliable BSC endpoints</li>
          <li>• <strong>Bypasses all rate limits</strong> and congestion issues</li>
          <li>• <strong>Maintains signing capability</strong> through MetaMask</li>
          <li>• <strong>Automatically persists</strong> across browser sessions</li>
        </ul>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        ⚠️ This is an emergency measure. Regular RPC endpoints should be restored once BSC network congestion improves.
      </div>
    </Card>
  );
};

export default NuclearRPCFix;