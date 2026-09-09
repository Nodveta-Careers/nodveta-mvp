/**
 * NodeMeta Health Check API Endpoint
 * Comprehensive application health monitoring
 */

import mongoose from 'mongoose';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../../helpers/ContractAddress';

const healthCheck = async (req, res) => {
  const startTime = Date.now();
  
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    services: {},
    details: {}
  };

  try {
    // Check MongoDB connection
    try {
      if (mongoose.connection.readyState === 1) {
        healthStatus.services.mongodb = 'connected';
        healthStatus.details.mongodb = {
          status: 'healthy',
          readyState: mongoose.connection.readyState,
          host: mongoose.connection.host,
          name: mongoose.connection.name
        };
      } else {
        healthStatus.services.mongodb = 'disconnected';
        healthStatus.details.mongodb = {
          status: 'unhealthy',
          readyState: mongoose.connection.readyState,
          error: 'Database not connected'
        };
        healthStatus.status = 'unhealthy';
      }
    } catch (mongoError) {
      healthStatus.services.mongodb = 'error';
      healthStatus.details.mongodb = {
        status: 'error',
        error: mongoError.message
      };
      healthStatus.status = 'unhealthy';
    }

    // Check blockchain connectivity (BSC)
    try {
      const rpcUrl = process.env.NEXT_PUBLIC_BSC_RPC_URL || 'https://bsc-dataseed.binance.org/';
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      
      const blockNumber = await provider.getBlockNumber();
      const network = await provider.getNetwork();
      
      healthStatus.services.blockchain = 'connected';
      healthStatus.details.blockchain = {
        status: 'healthy',
        network: network.name,
        chainId: network.chainId,
        blockNumber: blockNumber,
        rpcUrl: rpcUrl.replace(/\/\/.*@/, '//***@') // Hide credentials
      };
    } catch (blockchainError) {
      healthStatus.services.blockchain = 'error';
      healthStatus.details.blockchain = {
        status: 'error',
        error: blockchainError.message
      };
      // Don't mark overall status as unhealthy for blockchain issues
    }

    // Check NTE token contract
    try {
      const rpcUrl = process.env.NEXT_PUBLIC_BSC_RPC_URL || 'https://bsc-dataseed.binance.org/';
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const nteAddress = CONTRACT_ADDRESS.NTE_TOKEN;
      
      const code = await provider.getCode(nteAddress);
      if (code && code !== '0x') {
        healthStatus.services.nteContract = 'deployed';
        healthStatus.details.nteContract = {
          status: 'healthy',
          address: nteAddress,
          hasCode: true
        };
      } else {
        healthStatus.services.nteContract = 'not_deployed';
        healthStatus.details.nteContract = {
          status: 'warning',
          address: nteAddress,
          hasCode: false
        };
      }
    } catch (contractError) {
      healthStatus.services.nteContract = 'error';
      healthStatus.details.nteContract = {
        status: 'error',
        error: contractError.message
      };
    }

    // System resource checks
    const memoryUsage = process.memoryUsage();
    healthStatus.details.system = {
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
      },
      cpu: {
        platform: process.platform,
        architecture: process.arch,
        nodeVersion: process.version
      },
      uptime: `${Math.floor(process.uptime())}s`
    };

    // Application-specific checks
    healthStatus.details.application = {
      nodeEnv: process.env.NODE_ENV,
      nextjsVersion: require('next/package.json').version,
      features: {
        moralisStub: process.env.NEXT_PUBLIC_MORALIS_USE_STUB !== 'false',
        stakingEnabled: true,
        nftMarketplace: true,
        tradingBot: process.env.NEXT_PUBLIC_ENABLE_TRADING_BOT !== 'false',
        crossChainBridge: process.env.NEXT_PUBLIC_ENABLE_CROSS_CHAIN_BRIDGE !== 'false',
        smartCommerce: process.env.NEXT_PUBLIC_ENABLE_SMART_COMMERCE !== 'false'
      }
    };

    // Response time
    healthStatus.responseTime = `${Date.now() - startTime}ms`;

    // Set appropriate HTTP status
    const httpStatus = healthStatus.status === 'healthy' ? 200 : 503;
    
    res.status(httpStatus).json(healthStatus);

  } catch (error) {
    console.error('Health check failed:', error);
    
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
      responseTime: `${Date.now() - startTime}ms`
    });
  }
};

export default healthCheck;