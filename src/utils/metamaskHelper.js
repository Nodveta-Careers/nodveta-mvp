/**
 * MetaMask Helper Utilities
 * Handles RPC endpoint issues and network configuration
 */

// Reliable BSC RPC endpoints (updated with fastest ones)
const RELIABLE_BSC_RPCS = [
  'https://bsc-dataseed1.defibit.io/',
  'https://bsc-dataseed2.defibit.io/', 
  'https://bsc-dataseed3.defibit.io/',
  'https://bsc-dataseed4.defibit.io/',
  'https://bsc-dataseed2.ninicoin.io/',
  'https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3',
  'https://binance.llamarpc.com',
  'https://bsc.rpc.blxrbdn.com/',
  'https://rpc.ankr.com/bsc'
];

// BSC Network configuration
const BSC_NETWORK_CONFIG = {
  chainId: '0x38', // 56 in hex
  chainName: 'Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18
  },
  rpcUrls: RELIABLE_BSC_RPCS,
  blockExplorerUrls: ['https://bscscan.com/']
};

/**
 * Fix MetaMask RPC issues by forcing network reconfiguration with reliable endpoints
 */
export async function fixMetaMaskRPC() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    console.log('🔧 Fixing MetaMask RPC endpoints...');
    
    // Step 1: Force add/update BSC network with reliable RPC endpoints
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [BSC_NETWORK_CONFIG],
      });
      console.log('✅ BSC network updated with reliable RPC endpoints');
    } catch (addError) {
      // Network might already exist, try to switch instead
      console.log('Network exists, attempting to switch...');
    }
    
    // Step 2: Force switch to the updated BSC network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BSC_NETWORK_CONFIG.chainId }],
    });
    
    // Step 3: Verify the switch worked
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (currentChainId === BSC_NETWORK_CONFIG.chainId) {
      console.log('✅ Successfully switched to BSC with reliable RPC');
      return { 
        success: true, 
        message: 'RPC endpoints fixed! Using reliable BSC network.',
        chainId: currentChainId,
        rpcEndpoint: RELIABLE_BSC_RPCS[0]
      };
    } else {
      throw new Error(`Chain switch failed. Current: ${currentChainId}, Expected: ${BSC_NETWORK_CONFIG.chainId}`);
    }
    
  } catch (error) {
    console.error('❌ Failed to fix RPC endpoints:', error);
    return { 
      success: false, 
      error: error.message,
      troubleshooting: 'Please manually switch to BSC network in MetaMask settings'
    };
  }
}

/**
 * Update MetaMask's BSC RPC to use reliable endpoints
 */
export async function updateBSCRPC() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Add BSC network with reliable RPC endpoints
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [BSC_NETWORK_CONFIG],
    });

    return { 
      success: true, 
      message: 'BSC network updated with reliable RPC endpoints',
      rpcs: RELIABLE_BSC_RPCS 
    };
  } catch (error) {
    console.error('Failed to update BSC RPC:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if user is on BSC network
 */
export async function checkBSCNetwork() {
  if (typeof window === 'undefined' || !window.ethereum) {
    return { success: false, error: 'MetaMask not available' };
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const isOnBSC = chainId === BSC_NETWORK_CONFIG.chainId;
    
    return {
      success: true,
      isOnBSC,
      currentChainId: chainId,
      expectedChainId: BSC_NETWORK_CONFIG.chainId
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get RPC troubleshooting steps
 */
export function getRPCTroubleshootingSteps() {
  return [
    {
      step: 1,
      title: 'Switch to Reliable RPC',
      description: 'Click the "Fix RPC" button to use reliable BSC endpoints',
      action: 'fix_rpc'
    },
    {
      step: 2,
      title: 'Refresh Page', 
      description: 'Refresh the browser page after switching RPC',
      action: 'refresh'
    },
    {
      step: 3,
      title: 'Check Network',
      description: 'Ensure MetaMask is connected to BSC Mainnet (Chain ID: 56)',
      action: 'check_network'
    },
    {
      step: 4,
      title: 'Clear Cache',
      description: 'Clear browser cache if issues persist',
      action: 'clear_cache'
    }
  ];
}

/**
 * Handle RPC errors with user-friendly messages
 */
export function handleRPCError(error) {
  if (error.code === -32002) {
    return {
      type: 'rpc_error',
      title: 'RPC Endpoint Issue',
      message: 'The BSC network endpoint is overloaded. Switch to a reliable RPC endpoint.',
      canFix: true,
      severity: 'warning'
    };
  }

  if (error.code === 'CALL_EXCEPTION') {
    return {
      type: 'call_exception', 
      title: 'Contract Call Failed',
      message: 'Unable to connect to the blockchain. Please check your network connection.',
      canFix: true,
      severity: 'error'
    };
  }

  if (error.message?.includes('rate limit')) {
    return {
      type: 'rate_limit',
      title: 'Rate Limited',
      message: 'Too many requests. Please wait a moment and try again.',
      canFix: true,
      severity: 'warning'
    };
  }

  return {
    type: 'generic',
    title: 'Connection Error',
    message: error.message || 'An unknown error occurred',
    canFix: false,
    severity: 'error'
  };
}