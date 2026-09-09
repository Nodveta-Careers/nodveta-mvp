/**
 * Reliable RPC Provider with Failover
 * Handles RPC endpoint failures and provides automatic fallback
 */

import { ethers } from 'ethers';

// BSC RPC endpoints in order of priority
const BSC_RPC_ENDPOINTS = [
  'https://bsc-dataseed1.defibit.io/',
  'https://bsc-dataseed4.defibit.io/',  
  'https://bsc-dataseed2.ninicoin.io/',
  'https://bsc-dataseed1.binance.org/',
  'https://bsc-dataseed2.binance.org/',
  'https://bsc-dataseed3.binance.org/',
  'https://bsc.rpc.blxrbdn.com/',
  'https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3'
];

// Ethereum RPC endpoints
const ETHEREUM_RPC_ENDPOINTS = [
  'https://eth-mainnet.public.blastapi.io',
  'https://ethereum.publicnode.com',
  'https://rpc.ankr.com/eth',
  'https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7'
];

// Polygon RPC endpoints
const POLYGON_RPC_ENDPOINTS = [
  'https://polygon.llamarpc.com',
  'https://polygon-rpc.com/',
  'https://rpc.ankr.com/polygon',
  'https://polygon-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3'
];

class ReliableRPCProvider {
  constructor(chainId = 56) {
    this.chainId = chainId;
    this.currentEndpointIndex = 0;
    this.provider = null;
    this.endpoints = this.getEndpointsForChain(chainId);
    this.failureCount = new Map();
    this.lastFailureTime = new Map();
    
    this.initializeProvider();
  }

  getEndpointsForChain(chainId) {
    switch (chainId) {
      case 56:  // BSC Mainnet
        return BSC_RPC_ENDPOINTS;
      case 1:   // Ethereum Mainnet  
        return ETHEREUM_RPC_ENDPOINTS;
      case 137: // Polygon Mainnet
        return POLYGON_RPC_ENDPOINTS;
      default:
        return BSC_RPC_ENDPOINTS;
    }
  }

  initializeProvider() {
    const currentEndpoint = this.endpoints[this.currentEndpointIndex];
    
    console.log(`Initializing RPC provider with endpoint: ${currentEndpoint}`);
    
    this.provider = new ethers.providers.JsonRpcProvider({
      url: currentEndpoint,
      timeout: 10000, // 10 second timeout
    });

    // Add error handling
    this.provider.on('error', (error) => {
      console.warn(`RPC Provider error on ${currentEndpoint}:`, error);
      this.handleProviderError(error);
    });
  }

  async handleProviderError(error) {
    const currentEndpoint = this.endpoints[this.currentEndpointIndex];
    const now = Date.now();
    
    // Track failures
    const failures = this.failureCount.get(currentEndpoint) || 0;
    this.failureCount.set(currentEndpoint, failures + 1);
    this.lastFailureTime.set(currentEndpoint, now);

    // If current endpoint has failed too many times, switch to next
    if (failures >= 3) {
      console.warn(`RPC endpoint ${currentEndpoint} has failed ${failures} times, switching...`);
      await this.switchToNextEndpoint();
    }
  }

  async switchToNextEndpoint() {
    // Move to next endpoint
    this.currentEndpointIndex = (this.currentEndpointIndex + 1) % this.endpoints.length;
    
    // Reinitialize provider with new endpoint
    this.initializeProvider();
    
    // Test the new connection
    try {
      await this.provider.getNetwork();
      console.log(`Successfully switched to RPC endpoint: ${this.endpoints[this.currentEndpointIndex]}`);
    } catch (error) {
      console.error('New RPC endpoint also failed, trying next...', error);
      if (this.currentEndpointIndex < this.endpoints.length - 1) {
        await this.switchToNextEndpoint();
      } else {
        throw new Error('All RPC endpoints have failed');
      }
    }
  }

  async executeWithRetry(operation, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await operation(this.provider);
        
        // Reset failure count on success
        const currentEndpoint = this.endpoints[this.currentEndpointIndex];
        this.failureCount.set(currentEndpoint, 0);
        
        return result;
      } catch (error) {
        lastError = error;
        console.warn(`RPC operation failed (attempt ${attempt + 1}/${maxRetries}):`, error.message);
        
        // If it's an RPC error, try switching endpoint
        if (error.code === -32002 || error.code === -32603 || error.message.includes('rate limit')) {
          await this.handleProviderError(error);
          
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        } else {
          // For non-RPC errors, don't retry
          throw error;
        }
      }
    }
    
    throw lastError;
  }

  // Public methods
  async getProvider() {
    return this.provider;
  }

  async getBlockNumber() {
    return this.executeWithRetry(async (provider) => {
      return await provider.getBlockNumber();
    });
  }

  async getNetwork() {
    return this.executeWithRetry(async (provider) => {
      return await provider.getNetwork();
    });
  }

  async getBalance(address) {
    return this.executeWithRetry(async (provider) => {
      return await provider.getBalance(address);
    });
  }

  async call(transaction) {
    return this.executeWithRetry(async (provider) => {
      return await provider.call(transaction);
    });
  }

  async estimateGas(transaction) {
    return this.executeWithRetry(async (provider) => {
      return await provider.estimateGas(transaction);
    });
  }

  async getTransaction(transactionHash) {
    return this.executeWithRetry(async (provider) => {
      return await provider.getTransaction(transactionHash);
    });
  }

  async getTransactionReceipt(transactionHash) {
    return this.executeWithRetry(async (provider) => {
      return await provider.getTransactionReceipt(transactionHash);
    });
  }

  // Get contract instance with reliable provider
  getContract(address, abi, withSigner = false) {
    if (withSigner && typeof window !== 'undefined' && window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = web3Provider.getSigner();
      return new ethers.Contract(address, abi, signer);
    }
    
    return new ethers.Contract(address, abi, this.provider);
  }
}

// Create singleton instances for different chains
const bscProvider = new ReliableRPCProvider(56);
const ethProvider = new ReliableRPCProvider(1);
const polygonProvider = new ReliableRPCProvider(137);

export { ReliableRPCProvider };

export function getReliableProvider(chainId = 56) {
  switch (chainId) {
    case 56:
      return bscProvider;
    case 1: 
      return ethProvider;
    case 137:
      return polygonProvider;
    default:
      return bscProvider;
  }
}

export default bscProvider; // Default BSC provider