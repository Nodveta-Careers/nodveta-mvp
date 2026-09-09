/**
 * RPC Status Component
 * Displays blockchain connection status and helps with troubleshooting
 */

import React, { useState, useEffect } from 'react';
import { Alert, Button, Card, Typography, Space } from 'antd';
import { WifiOutlined, ReloadOutlined, WarningOutlined } from '@ant-design/icons';
import { getReliableProvider } from '../../utils/rpcProvider';

const { Text, Link } = Typography;

const RPCStatus = ({ chainId = 56, compact = false }) => {
  const [status, setStatus] = useState('checking');
  const [currentEndpoint, setCurrentEndpoint] = useState('');
  const [blockNumber, setBlockNumber] = useState(null);
  const [error, setError] = useState(null);

  const checkRPCStatus = async () => {
    try {
      setStatus('checking');
      setError(null);
      
      const reliableProvider = getReliableProvider(chainId);
      const provider = await reliableProvider.getProvider();
      
      // Get current endpoint (simplified)
      setCurrentEndpoint(provider.connection?.url || 'BSC Network');
      
      // Test connection
      const network = await reliableProvider.getNetwork();
      const latestBlock = await reliableProvider.getBlockNumber();
      
      setBlockNumber(latestBlock);
      setStatus('connected');
    } catch (err) {
      console.error('RPC Status check failed:', err);
      setError(err.message);
      setStatus('error');
    }
  };

  useEffect(() => {
    checkRPCStatus();
  }, [chainId]);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'success';
      case 'checking': return 'info';
      case 'error': return 'error';
      default: return 'warning';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'checking': return 'Checking...';
      case 'error': return 'Connection Error';
      default: return 'Unknown';
    }
  };

  const getRPCTroubleshootingTips = () => (
    <div className="mt-4 space-y-2 text-sm">
      <Text strong>RPC Connection Issues? Try these solutions:</Text>
      <div className="ml-4 space-y-1">
        <div>• Refresh the page and try again</div>
        <div>• Check MetaMask network settings</div>
        <div>• Switch to BSC Mainnet in MetaMask</div>
        <div>• Clear browser cache and cookies</div>
        <div>• Try a different internet connection</div>
      </div>
      
      <div className="mt-3">
        <Text strong>MetaMask BSC Network Settings:</Text>
        <div className="ml-4 mt-1 text-xs bg-gray-100 p-2 rounded">
          <div>Network Name: Smart Chain</div>
          <div>RPC URL: https://bsc-dataseed1.defibit.io/</div>
          <div>Chain ID: 56</div>
          <div>Symbol: BNB</div>
          <div>Block Explorer: https://bscscan.com</div>
        </div>
      </div>
    </div>
  );

  if (compact) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <WifiOutlined 
          style={{ 
            color: status === 'connected' ? '#52c41a' : 
                   status === 'error' ? '#ff4d4f' : '#1890ff' 
          }} 
        />
        <Text type={status === 'error' ? 'danger' : 'secondary'}>
          {getStatusText()}
          {blockNumber && ` (Block ${blockNumber})`}
        </Text>
        {status === 'error' && (
          <Button 
            size="small" 
            type="link" 
            icon={<ReloadOutlined />}
            onClick={checkRPCStatus}
          >
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card size="small" className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <WifiOutlined 
            className="text-lg"
            style={{ 
              color: status === 'connected' ? '#52c41a' : 
                     status === 'error' ? '#ff4d4f' : '#1890ff' 
            }} 
          />
          <div>
            <div className="font-medium">Blockchain Connection</div>
            <div className="text-sm text-gray-500">
              {getStatusText()}
              {currentEndpoint && ` via ${currentEndpoint}`}
              {blockNumber && ` • Block ${blockNumber}`}
            </div>
          </div>
        </div>
        
        <Button 
          size="small" 
          icon={<ReloadOutlined />}
          loading={status === 'checking'}
          onClick={checkRPCStatus}
        >
          Check
        </Button>
      </div>

      {status === 'error' && (
        <Alert
          className="mt-3"
          type="error"
          showIcon
          message="Blockchain Connection Failed"
          description={
            <div>
              <div className="mb-2">
                Error: {error || 'Unable to connect to BSC network'}
              </div>
              {getRPCTroubleshootingTips()}
            </div>
          }
        />
      )}
      
      {status === 'connected' && (
        <Alert
          className="mt-3"
          type="success"
          showIcon
          message="Successfully Connected to BSC Mainnet"
          description={`Latest block: ${blockNumber} • All blockchain features are operational`}
        />
      )}
    </Card>
  );
};

export default RPCStatus;