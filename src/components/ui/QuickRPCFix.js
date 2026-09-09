/**
 * Quick RPC Fix Button
 * Small button to fix RPC issues instantly
 */

import React, { useState } from 'react';
import { Button, message, Tooltip } from 'antd';
import { WifiOutlined, SettingOutlined } from '@ant-design/icons';
import { fixMetaMaskRPC } from '../../utils/metamaskHelper';

const QuickRPCFix = ({ size = 'small', type = 'default' }) => {
  const [fixing, setFixing] = useState(false);

  const handleQuickFix = async () => {
    setFixing(true);
    
    try {
      const result = await fixMetaMaskRPC();
      
      if (result.success) {
        message.success('RPC endpoint fixed! Page will reload...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        message.error(`Failed to fix RPC: ${result.error}`);
      }
    } catch (error) {
      message.error('Error fixing RPC endpoint');
      console.error('Quick RPC fix error:', error);
    } finally {
      setFixing(false);
    }
  };

  return (
    <Tooltip title="Fix BSC RPC connection issues" placement="bottom">
      <Button
        size={size}
        type={type}
        icon={fixing ? <SettingOutlined spin /> : <WifiOutlined />}
        loading={fixing}
        onClick={handleQuickFix}
        className="quick-rpc-fix"
      >
        {size !== 'small' && (fixing ? 'Fixing RPC...' : 'Fix RPC')}
      </Button>
    </Tooltip>
  );
};

export default QuickRPCFix;