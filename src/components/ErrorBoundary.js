/**
 * Global Error Boundary with RPC Error Handling
 * Catches and handles RPC and blockchain connection errors
 */

import React, { Component } from 'react';
import { Alert, Button, Card, Typography } from 'antd';
import { ReloadOutlined, BugOutlined } from '@ant-design/icons';
import RPCErrorHandler from './ui/RPCErrorHandler';
import { handleRPCError } from '../utils/metamaskHelper';

const { Title, Text } = Typography;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRPCError: false
    };
  }

  static getDerivedStateFromError(error) {
    // Check if it's an RPC-related error
    const isRPCError = error?.code === -32002 || 
                       error?.code === 'CALL_EXCEPTION' ||
                       error?.message?.includes('RPC') ||
                       error?.message?.includes('rate limit') ||
                       error?.message?.includes('revert data');

    return {
      hasError: true,
      isRPCError
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log to external error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isRPCError: false
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { error, isRPCError } = this.state;

      // Handle RPC errors with special component
      if (isRPCError) {
        return (
          <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-2xl mx-auto pt-20">
              <div className="text-center mb-6">
                <Title level={2}>🔗 Blockchain Connection Issue</Title>
                <Text type="secondary">
                  We're having trouble connecting to the BSC network. This is usually a temporary RPC endpoint issue.
                </Text>
              </div>
              
              <RPCErrorHandler 
                error={error} 
                onFixed={this.handleReset}
              />
            </div>
          </div>
        );
      }

      // Handle general errors
      return (
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-2xl mx-auto pt-20">
            <Card>
              <div className="text-center mb-6">
                <BugOutlined className="text-6xl text-red-500 mb-4" />
                <Title level={2}>Something went wrong</Title>
                <Text type="secondary">
                  The NodeMeta application encountered an unexpected error.
                </Text>
              </div>

              <Alert
                type="error"
                showIcon
                message="Application Error"
                description={
                  <div>
                    <div className="mb-2">{error?.message || 'An unknown error occurred'}</div>
                    <details className="text-xs text-gray-600">
                      <summary>Technical Details</summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                        {error?.stack || 'No stack trace available'}
                      </pre>
                    </details>
                  </div>
                }
              />

              <div className="flex justify-center gap-4 mt-6">
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />}
                  onClick={this.handleReload}
                >
                  Reload Page
                </Button>
                <Button onClick={this.handleReset}>
                  Try Again
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded">
                <Title level={5}>💡 Troubleshooting Tips</Title>
                <ul className="text-sm space-y-1">
                  <li>• Refresh the page and try again</li>
                  <li>• Check your internet connection</li>
                  <li>• Ensure MetaMask is connected to BSC Mainnet</li>
                  <li>• Clear browser cache if the issue persists</li>
                  <li>• Try switching to a different browser</li>
                </ul>
              </div>

              <div className="mt-4 text-center text-xs text-gray-500">
                NodeMeta MVP v1.0.0 • If the issue persists, please contact support
              </div>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return {
    handleError: (error) => {
      console.error('Handled error:', error);
      
      // Check if it's an RPC error
      const errorInfo = handleRPCError(error);
      
      if (errorInfo.canFix) {
        // Show error notification or modal
        // This could trigger a global error state
        return { isRPCError: true, errorInfo };
      }
      
      throw error; // Re-throw non-RPC errors
    }
  };
}

export default ErrorBoundary;