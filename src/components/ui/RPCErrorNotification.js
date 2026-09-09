/**
 * RPC Error Notification
 * Floating notification for RPC issues with quick fix
 */

import React, { useState, useEffect } from 'react';
import { notification, Button } from 'antd';
import { WifiOutlined, SettingOutlined } from '@ant-design/icons';
import { fixMetaMaskRPC, handleRPCError } from '../../utils/metamaskHelper';

let notificationKey = null;

// Global function to show RPC error notification
export const showRPCErrorNotification = (error) => {
  const errorInfo = handleRPCError(error);
  
  if (!errorInfo.canFix) return;

  const key = `rpc-error-${Date.now()}`;
  notificationKey = key;

  const handleQuickFix = async () => {
    notification.close(key);
    
    try {
      const loadingKey = 'rpc-fixing';
      notification.info({
        key: loadingKey,
        message: 'Fixing RPC Connection',
        description: 'Switching to reliable BSC endpoint...',
        icon: <SettingOutlined spin />,
        duration: 0
      });

      const result = await fixMetaMaskRPC();
      notification.close(loadingKey);
      
      if (result.success) {
        notification.success({
          message: 'RPC Fixed Successfully!',
          description: 'Page will reload in 2 seconds...',
          duration: 2
        });
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        notification.error({
          message: 'RPC Fix Failed',
          description: result.error,
          duration: 5
        });
      }
    } catch (err) {
      notification.error({
        message: 'Fix Failed',
        description: 'Please try manually switching RPC endpoints in MetaMask',
        duration: 5
      });
    }
  };

  notification.warning({
    key,
    message: errorInfo.title,
    description: (
      <div>
        <div className="mb-3">{errorInfo.message}</div>
        <Button 
          type="primary" 
          size="small"
          icon={<SettingOutlined />}
          onClick={handleQuickFix}
        >
          Fix RPC Now
        </Button>
      </div>
    ),
    icon: <WifiOutlined className="text-orange-500" />,
    duration: 0, // Don't auto-close
    placement: 'topRight',
    className: 'rpc-error-notification'
  });
};

// Component to handle RPC errors in React components
const RPCErrorNotification = ({ error, onClose }) => {
  useEffect(() => {
    if (error) {
      showRPCErrorNotification(error);
      
      // Close any existing notification when component unmounts
      return () => {
        if (notificationKey) {
          notification.close(notificationKey);
        }
      };
    }
  }, [error]);

  useEffect(() => {
    // Listen for global RPC errors
    const handleWindowError = (event) => {
      const error = event.error;
      if (error?.code === -32002 || error?.message?.includes('RPC')) {
        showRPCErrorNotification(error);
      }
    };

    window.addEventListener('error', handleWindowError);
    return () => window.removeEventListener('error', handleWindowError);
  }, []);

  return null; // This component doesn't render anything
};

export default RPCErrorNotification;