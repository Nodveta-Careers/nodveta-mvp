/**
 * RPC Test Page
 * Test page to verify RPC fixes are working
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Alert, Typography, Divider } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, LoadingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const RPCTestPage = () => {
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);
  const [preemptiveActive, setPreemptiveActive] = useState(false);

  useEffect(() => {
    // Check if preemptive fix is active
    const isActive = localStorage.getItem('preemptive_fix_active') === 'true';
    setPreemptiveActive(isActive);
  }, []);

  const runRPCTests = async () => {
    setTesting(true);
    const results = {};

    try {
      // Test 1: Check if MetaMask is available
      results.metamask = {
        test: 'MetaMask Available',
        result: typeof window.ethereum !== 'undefined',
        details: window.ethereum ? 'MetaMask detected' : 'MetaMask not found'
      };

      // Test 2: Try to get chain ID
      if (window.ethereum) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          results.chainId = {
            test: 'Chain ID Request',
            result: true,
            details: `Chain ID: ${chainId} (${chainId === '0x38' ? 'BSC Mainnet ✅' : 'Different network ⚠️'})`
          };
        } catch (error) {
          results.chainId = {
            test: 'Chain ID Request', 
            result: false,
            details: `Error: ${error.message}`
          };
        }
      }

      // Test 3: Try to get accounts
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          results.accounts = {
            test: 'Get Accounts',
            result: true,
            details: accounts.length > 0 ? `${accounts.length} account(s) connected` : 'No accounts connected'
          };
        } catch (error) {
          results.accounts = {
            test: 'Get Accounts',
            result: false, 
            details: `Error: ${error.message}`
          };
        }
      }

      // Test 4: Try to get latest block number
      if (window.ethereum) {
        try {
          const blockNumber = await window.ethereum.request({ 
            method: 'eth_getBlockByNumber', 
            params: ['latest', false] 
          });
          results.blockNumber = {
            test: 'Get Latest Block',
            result: true,
            details: `Block #${parseInt(blockNumber.number, 16)}`
          };
        } catch (error) {
          results.blockNumber = {
            test: 'Get Latest Block',
            result: false,
            details: `Error: ${error.message}`
          };
        }
      }

    } catch (error) {
      results.general = {
        test: 'General Test',
        result: false,
        details: `Unexpected error: ${error.message}`
      };
    }

    setTestResults(results);
    setTesting(false);
  };

  const activateEmergencyFix = async () => {
    if (window.EMERGENCY_RPC_FIX) {
      await window.EMERGENCY_RPC_FIX();
    } else {
      alert('Emergency fix function not available. Please refresh the page.');
      window.location.reload();
    }
  };

  const clearRPCSettings = () => {
    localStorage.removeItem('preemptive_fix_active');
    localStorage.removeItem('rpc_bypass_active');
    localStorage.removeItem('rpc_error_count');
    localStorage.removeItem('last_rpc_error');
    alert('RPC settings cleared. Page will reload.');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <Title level={2}>🔧 RPC Connection Test</Title>
          <Text type="secondary">
            Test your MetaMask RPC connection and verify fixes are working properly.
          </Text>

          <Divider />

          {/* Status Information */}
          <div className="mb-6 space-y-4">
            <Alert
              type={preemptiveActive ? "success" : "info"}
              showIcon
              message={`Preemptive RPC Fix: ${preemptiveActive ? "ACTIVE" : "INACTIVE"}`}
              description={
                preemptiveActive 
                  ? "The preemptive fix is active and should prevent RPC errors."
                  : "The preemptive fix is not active. Consider activating it if you experience RPC errors."
              }
            />

            <div className="bg-blue-50 p-4 rounded-lg">
              <Title level={5}>Current RPC Status:</Title>
              <ul className="text-sm space-y-1">
                <li>Bypass Active: {localStorage.getItem('rpc_bypass_active') || 'No'}</li>
                <li>Error Count: {localStorage.getItem('rpc_error_count') || '0'}</li>
                <li>Last Error: {localStorage.getItem('last_rpc_error') ? new Date(parseInt(localStorage.getItem('last_rpc_error'))).toLocaleString() : 'None'}</li>
              </ul>
            </div>
          </div>

          {/* Test Button */}
          <div className="mb-6 text-center">
            <Button
              type="primary"
              size="large"
              loading={testing}
              onClick={runRPCTests}
              className="mr-4"
            >
              {testing ? 'Testing...' : '🧪 Run RPC Tests'}
            </Button>

            <Button
              type="primary"
              danger
              size="large"
              onClick={activateEmergencyFix}
              className="mr-4"
            >
              🚨 Emergency Fix
            </Button>

            <Button
              size="large"
              onClick={clearRPCSettings}
            >
              🗑️ Clear Settings
            </Button>
          </div>

          {/* Test Results */}
          {Object.keys(testResults).length > 0 && (
            <div>
              <Title level={4}>Test Results:</Title>
              <div className="space-y-4">
                {Object.entries(testResults).map(([key, result]) => (
                  <Alert
                    key={key}
                    type={result.result ? "success" : "error"}
                    showIcon
                    icon={result.result ? <CheckCircleFilled /> : <CloseCircleFilled />}
                    message={result.test}
                    description={result.details}
                  />
                ))}
              </div>
            </div>
          )}

          <Divider />

          {/* Instructions */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <Title level={5}>💡 Troubleshooting Instructions:</Title>
            <ol className="text-sm space-y-2">
              <li><strong>If tests fail:</strong> Click "Emergency Fix" to activate RPC bypass</li>
              <li><strong>If still failing:</strong> Clear settings and try emergency fix again</li>
              <li><strong>Persistent issues:</strong> Use the red "FIX RPC" button in top-right corner</li>
              <li><strong>Nuclear option:</strong> Visit <code>/nuclear-fix</code> for complete bypass</li>
            </ol>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            RPC Test Page - NodeMeta MVP v1.0.0
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RPCTestPage;