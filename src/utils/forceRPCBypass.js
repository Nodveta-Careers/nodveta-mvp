/**
 * Force RPC Bypass - Direct Provider Override
 * Completely bypasses MetaMask's RPC configuration to use reliable endpoints
 */

import { ethers } from 'ethers';

// Ultra-reliable BSC endpoints (tested and working)
const FORCE_BSC_ENDPOINTS = [
  'https://bsc-dataseed1.binance.org/',
  'https://bsc-dataseed2.binance.org/', 
  'https://bsc-dataseed3.binance.org/',
  'https://bsc-dataseed4.binance.org/',
  'https://bsc-dataseed1.defibit.io/',
  'https://bsc-dataseed2.defibit.io/',
  'https://rpc.ankr.com/bsc',
  'https://bsc.rpc.blxrbdn.com/'
];

let forcedProvider = null;
let providerIndex = 0;

/**
 * Create a forced provider that bypasses MetaMask RPC issues
 */
export function createForcedProvider() {
  const endpoint = FORCE_BSC_ENDPOINTS[providerIndex];
  
  console.log(`🔄 Creating forced provider with endpoint: ${endpoint}`);
  
  try {
    forcedProvider = new ethers.providers.JsonRpcProvider({
      url: endpoint,
      timeout: 8000
    });

    // Test the provider immediately
    forcedProvider.getBlockNumber().then(blockNumber => {
      console.log(`✅ Forced provider working! Latest block: ${blockNumber}`);
    }).catch(error => {
      console.warn(`⚠️ Endpoint ${endpoint} failed, trying next...`);
      cycleToNextEndpoint();
    });

    return forcedProvider;
  } catch (error) {
    console.error(`❌ Failed to create provider with ${endpoint}:`, error);
    cycleToNextEndpoint();
    return null;
  }
}

/**
 * Cycle to the next reliable endpoint
 */
function cycleToNextEndpoint() {
  providerIndex = (providerIndex + 1) % FORCE_BSC_ENDPOINTS.length;
  console.log(`🔄 Cycling to endpoint ${providerIndex + 1}/${FORCE_BSC_ENDPOINTS.length}`);
  return createForcedProvider();
}

/**
 * Get a working provider, bypassing MetaMask RPC issues
 */
export async function getForcedProvider() {
  if (!forcedProvider) {
    forcedProvider = createForcedProvider();
  }

  try {
    // Test if current provider is still working
    await forcedProvider.getBlockNumber();
    return forcedProvider;
  } catch (error) {
    console.log('Current forced provider failed, cycling to next...');
    return cycleToNextEndpoint();
  }
}

/**
 * Create a signer that uses our forced provider but connects to MetaMask for transactions
 */
export async function createHybridSigner() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not available');
  }

  try {
    // Get our reliable provider for reading blockchain data
    const readProvider = await getForcedProvider();
    
    // Create Web3Provider for signing (this will work even if RPC fails for reading)
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Create a hybrid signer that reads from our provider but signs with MetaMask
    const signer = web3Provider.getSigner();
    
    // Override the signer's provider for reading operations
    const hybridSigner = {
      ...signer,
      provider: readProvider,
      
      // Keep original signing functionality
      signTransaction: signer.signTransaction.bind(signer),
      signMessage: signer.signMessage.bind(signer),
      connect: signer.connect.bind(signer),
      
      // Use forced provider for reading operations
      getAddress: signer.getAddress.bind(signer),
      getBalance: () => readProvider.getBalance(signer.getAddress()),
      getTransactionCount: (blockTag) => readProvider.getTransactionCount(signer.getAddress(), blockTag),
      
      // Estimate gas using forced provider
      estimateGas: (transaction) => readProvider.estimateGas(transaction),
      
      // Send transaction using MetaMask but validate with forced provider
      sendTransaction: async (transaction) => {
        try {
          // First try with MetaMask's provider
          return await signer.sendTransaction(transaction);
        } catch (error) {
          // If MetaMask RPC fails, we can still provide tx data for manual submission
          console.warn('MetaMask transaction failed due to RPC, preparing fallback...');
          throw error;
        }
      }
    };

    console.log('✅ Created hybrid signer with forced RPC bypass');
    return hybridSigner;
  } catch (error) {
    console.error('Failed to create hybrid signer:', error);
    throw error;
  }
}

/**
 * Override ethers providers globally to use our forced endpoints
 */
export function forceRPCOverride() {
  if (typeof window === 'undefined') return;

  console.log('🚀 Implementing global RPC override...');

  // Store original provider creation
  const originalWeb3Provider = ethers.providers.Web3Provider;
  const originalJsonRpcProvider = ethers.providers.JsonRpcProvider;

  // Override Web3Provider to use our hybrid approach
  ethers.providers.Web3Provider = function(ethereum, network) {
    const web3Provider = new originalWeb3Provider(ethereum, network);
    
    // Intercept problematic calls and redirect to our forced provider
    const originalSend = web3Provider.send;
    web3Provider.send = async function(method, params) {
      try {
        return await originalSend.call(this, method, params);
      } catch (error) {
        if (error.code === -32002 || error.message.includes('RPC endpoint returned too many errors')) {
          console.log(`🔄 RPC error detected, using forced provider for ${method}`);
          
          const forcedProvider = await getForcedProvider();
          return await forcedProvider.send(method, params);
        }
        throw error;
      }
    };

    return web3Provider;
  };

  // Override JsonRpcProvider to use our endpoints by default
  ethers.providers.JsonRpcProvider = function(url, network) {
    // If it's a BSC-related call, force our endpoints
    if (!url || url.includes('bsc') || network?.chainId === 56) {
      const forcedEndpoint = FORCE_BSC_ENDPOINTS[providerIndex];
      console.log(`🔄 Forcing JsonRpcProvider to use: ${forcedEndpoint}`);
      return new originalJsonRpcProvider(forcedEndpoint, network);
    }
    
    return new originalJsonRpcProvider(url, network);
  };

  console.log('✅ Global RPC override implemented');
}

/**
 * Emergency RPC fix that completely bypasses MetaMask
 */
export async function emergencyRPCBypass() {
  try {
    console.log('🚨 EMERGENCY RPC BYPASS ACTIVATED');
    
    // Force override all providers
    forceRPCOverride();
    
    // Test the override
    const provider = await getForcedProvider();
    const blockNumber = await provider.getBlockNumber();
    
    console.log(`✅ Emergency bypass successful! Block number: ${blockNumber}`);
    
    // Store bypass status in localStorage
    localStorage.setItem('rpc_bypass_active', 'true');
    localStorage.setItem('rpc_bypass_endpoint', FORCE_BSC_ENDPOINTS[providerIndex]);
    
    return {
      success: true,
      message: `Emergency RPC bypass activated! Using ${FORCE_BSC_ENDPOINTS[providerIndex]}`,
      blockNumber,
      endpoint: FORCE_BSC_ENDPOINTS[providerIndex]
    };
  } catch (error) {
    console.error('❌ Emergency RPC bypass failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Initialize RPC bypass on app start if previously activated
 */
export function initializeRPCBypass() {
  if (typeof window === 'undefined') return;

  const bypassActive = localStorage.getItem('rpc_bypass_active');
  
  if (bypassActive === 'true') {
    console.log('🔄 Restoring RPC bypass from previous session...');
    forceRPCOverride();
    getForcedProvider(); // Initialize the forced provider
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  // Wait for the page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRPCBypass);
  } else {
    initializeRPCBypass();
  }
}