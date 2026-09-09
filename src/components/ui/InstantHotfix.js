/**
 * Instant Hotfix Component
 * Activates immediately when RPC errors are detected
 */

import React, { useEffect, useState } from 'react';
import { Button, message, Spin } from 'antd';
import { ThunderboltFilled } from '@ant-design/icons';

const InstantHotfix = () => {
  const [activating, setActivating] = useState(false);
  const [errorDetected, setErrorDetected] = useState(false);

  useEffect(() => {
    // Check if there were recent RPC errors
    const checkForErrors = () => {
      const errorCount = parseInt(localStorage.getItem('rpc_error_count') || '0');
      const lastError = parseInt(localStorage.getItem('last_rpc_error') || '0');
      const hourAgo = Date.now() - (60 * 60 * 1000);
      
      if (errorCount > 0 && lastError > hourAgo) {
        setErrorDetected(true);
      }
    };

    checkForErrors();

    // Listen for RPC errors in real-time
    const handleUnhandledRejection = (event) => {
      const error = event.reason;
      if (error && (
        error.code === -32002 ||
        error.message?.includes('RPC endpoint') ||
        error.message?.includes('revert data')
      )) {
        console.log('🚨 RPC error detected by InstantHotfix');
        setErrorDetected(true);
        
        // Track the error
        const errorCount = parseInt(localStorage.getItem('rpc_error_count') || '0') + 1;
        localStorage.setItem('rpc_error_count', errorCount.toString());
        localStorage.setItem('last_rpc_error', Date.now().toString());
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const activateInstantFix = async () => {
    setActivating(true);
    
    try {
      message.loading('🚀 Activating instant RPC hotfix...', 0);
      
      // Activate the preemptive fix immediately
      if (window.EMERGENCY_RPC_FIX) {
        await window.EMERGENCY_RPC_FIX();
      } else {
        // Manual activation if emergency function not available
        localStorage.setItem('preemptive_fix_active', 'true');
        localStorage.setItem('rpc_bypass_active', 'true');
        
        message.destroy();
        message.success('🛡️ Instant hotfix activated! Reloading...', 2);
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      message.destroy();
      message.error('Hotfix failed. Try the emergency button in top-right corner.');
      setActivating(false);
    }
  };

  if (!errorDetected && !activating) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-red-600 text-white p-4 rounded-lg shadow-2xl max-w-sm animate-bounce">
      <div className="flex items-center space-x-3">
        <ThunderboltFilled className="text-2xl text-yellow-300" />
        <div className="flex-1">
          <div className="font-bold text-sm">RPC Error Detected!</div>
          <div className="text-xs opacity-90 mb-2">
            MetaMask connection issues found. Click to fix instantly.
          </div>
          
          <Button
            type="primary"
            size="small"
            loading={activating}
            onClick={activateInstantFix}
            className="w-full"
            style={{
              background: '#ffd700',
              borderColor: '#ffd700',
              color: '#000',
              fontWeight: 'bold'
            }}
          >
            {activating ? 'Fixing...' : '⚡ INSTANT FIX'}
          </Button>
        </div>
      </div>
      
      <div className="text-xs opacity-75 mt-2">
        Or use the red "FIX RPC" button in the top-right corner
      </div>
    </div>
  );
};

export default InstantHotfix;