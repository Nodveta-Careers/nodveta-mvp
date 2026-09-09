/**
 * Emergency RPC Fix Button
 * Floating action button that appears on RPC errors
 */

import React, { useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import { WarningFilled, ToolOutlined } from '@ant-design/icons';
import { fixMetaMaskRPC } from '../../utils/metamaskHelper';
import InstantRPCFix from './InstantRPCFix';
import NuclearRPCFix from './NuclearRPCFix';

const EmergencyRPCButton = () => {
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuclearModalVisible, setNuclearModalVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  useEffect(() => {
    // Listen for RPC errors globally
    const handleError = (event) => {
      const error = event.error || event.reason;
      
      if (error && (
        error.code === -32002 ||
        error.message?.includes('RPC endpoint returned too many errors') ||
        error.message?.includes('rate limit') ||
        error.message?.includes('revert data')
      )) {
        console.log('🚨 RPC Error detected, showing emergency fix');
        setHasError(true);
        setVisible(true);
      }
    };

    const handleUnhandledRejection = (event) => {
      handleError(event);
    };

    // Listen to both error types
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Auto-show if we detect RPC issues on load
    const checkForRPCIssues = () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        // Try a simple call to detect RPC issues
        window.ethereum.request({ method: 'eth_chainId' }).catch((error) => {
          if (error.code === -32002) {
            setHasError(true);
            setVisible(true);
          }
        });
      }
    };

    // Check after a short delay
    setTimeout(checkForRPCIssues, 2000);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const handleQuickFix = async () => {
    setModalVisible(false);
    
    try {
      message.loading('Fixing RPC endpoints...', 0);
      const result = await fixMetaMaskRPC();
      message.destroy();
      
      if (result.success) {
        message.success('RPC fixed! Reloading page...');
        setVisible(false);
        setHasError(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const attempts = failedAttempts + 1;
        setFailedAttempts(attempts);
        
        if (attempts >= 2) {
          message.error('Standard fixes failed. Nuclear option available.');
          setNuclearModalVisible(true);
        } else {
          message.error(`Fix failed: ${result.error}`);
          setModalVisible(true);
        }
      }
    } catch (error) {
      message.destroy();
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      
      if (attempts >= 2) {
        message.error('Multiple fix attempts failed. Time for nuclear option.');
        setNuclearModalVisible(true);
      } else {
        message.error('Quick fix failed. Please try manual fix.');
        setModalVisible(true);
      }
    }
  };

  if (!visible || !hasError) {
    return null;
  }

  return (
    <>
      {/* Floating Emergency Button */}
      <div 
        className="fixed bottom-4 right-4 z-50 animate-bounce"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
        }}
      >
        <Button
          type="primary"
          danger
          size="large"
          shape="round"
          icon={<WarningFilled />}
          onClick={() => setModalVisible(true)}
          className="px-6 py-3 h-auto text-base font-semibold"
          style={{
            background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
            border: 'none',
            boxShadow: '0 4px 12px rgba(255, 77, 79, 0.4)'
          }}
        >
          Fix RPC Error
        </Button>
      </div>

      {/* Quick Fix Tooltip */}
      {visible && (
        <div className="fixed bottom-20 right-4 z-40 bg-red-100 border border-red-300 rounded-lg p-3 max-w-xs text-sm">
          <div className="flex items-start space-x-2">
            <WarningFilled className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold text-red-800">RPC Error Detected</div>
              <div className="text-red-700 text-xs mt-1">
                MetaMask RPC endpoint is overloaded. Click the button to fix it instantly.
              </div>
              <Button 
                type="link" 
                size="small" 
                className="p-0 h-auto text-red-600"
                onClick={handleQuickFix}
              >
                Quick Fix →
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Standard Fix Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <ToolOutlined className="text-orange-500" />
            <span>Fix RPC Connection Issue</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={
          failedAttempts >= 1 ? (
            <div className="text-center">
              <Button 
                type="primary" 
                danger 
                onClick={() => {
                  setModalVisible(false);
                  setNuclearModalVisible(true);
                }}
                className="mt-4"
              >
                ☢️ Try Nuclear Fix
              </Button>
            </div>
          ) : null
        }
        width={600}
        centered
      >
        <InstantRPCFix />
        
        {failedAttempts >= 1 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
            <div className="text-red-800 font-semibold mb-2">⚠️ Standard Fix Failed</div>
            <div className="text-red-700 text-sm">
              The standard RPC fix has failed {failedAttempts} time(s). 
              Consider using the <strong>Nuclear Fix</strong> which completely bypasses MetaMask's RPC configuration.
            </div>
          </div>
        )}
      </Modal>

      {/* Nuclear Fix Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <span className="text-2xl">☢️</span>
            <span className="text-red-600 font-bold">Nuclear RPC Fix</span>
          </div>
        }
        open={nuclearModalVisible}
        onCancel={() => setNuclearModalVisible(false)}
        footer={null}
        width={700}
        centered
        className="nuclear-modal"
      >
        <NuclearRPCFix />
      </Modal>
    </>
  );
};

export default EmergencyRPCButton;