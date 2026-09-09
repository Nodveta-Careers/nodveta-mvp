/**
 * RPC Trouble Banner
 * Persistent banner for users experiencing RPC issues
 */

import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'antd';
import { WarningOutlined, ThunderboltFilled } from '@ant-design/icons';

const RPCTroubleBanner = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has been experiencing RPC issues
    const rpcErrorCount = localStorage.getItem('rpc_error_count') || 0;
    const lastRPCError = localStorage.getItem('last_rpc_error');
    const bannerDismissed = localStorage.getItem('rpc_banner_dismissed');
    
    // Show banner if user has had recent RPC errors and hasn't dismissed it
    if (parseInt(rpcErrorCount) > 0 && !bannerDismissed && 
        lastRPCError && (Date.now() - parseInt(lastRPCError)) < 3600000) { // 1 hour
      setVisible(true);
    }

    // Listen for RPC errors to show banner
    const handleStorageChange = (e) => {
      if (e.key === 'rpc_error_count' && parseInt(e.newValue) > 0) {
        setVisible(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('rpc_banner_dismissed', Date.now().toString());
  };

  const handleNuclearFix = () => {
    window.open('/nuclear-fix', '_blank');
  };

  if (!visible || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Alert
        type="warning"
        showIcon
        icon={<WarningOutlined />}
        message="RPC Connection Issues Detected"
        description={
          <div className="flex items-center justify-between">
            <span>
              Having trouble with MetaMask connections? Try our emergency fixes.
            </span>
            <div className="flex space-x-2 ml-4">
              <Button 
                size="small" 
                onClick={() => window.open('/fix-rpc', '_blank')}
              >
                Standard Fix
              </Button>
              <Button 
                size="small" 
                danger 
                icon={<ThunderboltFilled />}
                onClick={handleNuclearFix}
              >
                Nuclear Fix
              </Button>
            </div>
          </div>
        }
        closable
        onClose={handleDismiss}
        className="rounded-none border-0 border-b"
        style={{
          background: 'linear-gradient(90deg, #fff3cd 0%, #ffeaa7 100%)',
          borderBottom: '2px solid #ffc107'
        }}
      />
    </div>
  );
};

export default RPCTroubleBanner;