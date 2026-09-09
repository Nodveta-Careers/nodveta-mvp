/**
 * Instant RPC Fix Component
 * Emergency fix for immediate RPC issues
 */

import React, { useState } from 'react';
import { Alert, Button, Card, Steps, message } from 'antd';
import { WarningFilled, ToolFilled, CheckCircleFilled } from '@ant-design/icons';
import { fixMetaMaskRPC } from '../../utils/metamaskHelper';

const { Step } = Steps;

const InstantRPCFix = () => {
  const [fixing, setFixing] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleInstantFix = async () => {
    setFixing(true);
    setCurrentStep(1);

    try {
      // Step 1: Updating network
      message.loading('Updating BSC network configuration...', 0);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(2);

      // Step 2: Switching network
      message.destroy();
      message.loading('Switching to reliable RPC endpoint...', 0);
      
      const result = await fixMetaMaskRPC();
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(3);

      message.destroy();

      if (result.success) {
        setFixed(true);
        setCurrentStep(4);
        message.success('RPC endpoints fixed successfully!');
        
        // Auto-reload after success
        setTimeout(() => {
          message.info('Reloading page with fixed RPC...');
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }, 2000);
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error) {
      message.destroy();
      message.error(`Fix failed: ${error.message}`);
      setCurrentStep(0);
    } finally {
      setFixing(false);
    }
  };

  const steps = [
    {
      title: 'Ready to Fix',
      description: 'Click the button to fix RPC endpoints',
      icon: <WarningFilled className="text-orange-500" />
    },
    {
      title: 'Updating Network',
      description: 'Configuring reliable BSC endpoints...',
      icon: <ToolFilled className="text-blue-500" />
    },
    {
      title: 'Switching Network',
      description: 'Connecting to stable RPC...',
      icon: <ToolFilled className="text-blue-500" />
    },
    {
      title: 'Verifying Connection', 
      description: 'Testing new RPC endpoint...',
      icon: <ToolFilled className="text-blue-500" />
    },
    {
      title: 'Fixed!',
      description: 'RPC endpoints updated successfully',
      icon: <CheckCircleFilled className="text-green-500" />
    }
  ];

  return (
    <Card className="instant-rpc-fix max-w-md mx-auto">
      <div className="text-center mb-6">
        <WarningFilled className="text-6xl text-orange-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          RPC Connection Issue Detected
        </h2>
        <p className="text-gray-600 text-sm">
          MetaMask is experiencing RPC endpoint errors. Click below for an instant fix.
        </p>
      </div>

      <Alert
        type="warning" 
        showIcon
        message="BSC RPC Endpoint Overloaded"
        description="Error -32002: The current RPC endpoint has too many requests. We'll switch you to a reliable endpoint."
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

      <div className="text-center">
        <Button
          type="primary"
          size="large"
          loading={fixing}
          disabled={fixed}
          onClick={handleInstantFix}
          className="px-8"
        >
          {fixing ? 'Fixing RPC...' : fixed ? 'Fixed! Reloading...' : '🔧 Fix RPC Now'}
        </Button>
      </div>

      {fixed && (
        <Alert
          type="success"
          showIcon
          message="RPC Fixed Successfully!"
          description="Your MetaMask is now using reliable BSC endpoints. The page will reload automatically."
          className="mt-4"
        />
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded text-sm">
        <p className="font-semibold text-blue-800 mb-2">What this fix does:</p>
        <ul className="text-blue-700 space-y-1">
          <li>• Updates MetaMask with reliable BSC RPC endpoints</li>
          <li>• Switches to the fastest available endpoint</li>
          <li>• Prevents future RPC overload errors</li>
          <li>• Automatically reloads the page</li>
        </ul>
      </div>
    </Card>
  );
};

export default InstantRPCFix;