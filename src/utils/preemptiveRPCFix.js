/**
 * Preemptive RPC Fix - Immediate MetaMask Override
 * Activates BEFORE any MetaMask calls to prevent RPC errors entirely
 */

// Ultra-fast BSC endpoints (tested for immediate response)
const INSTANT_BSC_ENDPOINTS = [
  'https://bsc-dataseed1.binance.org/',
  'https://bsc-dataseed2.binance.org/',
  'https://rpc.ankr.com/bsc',
  'https://bsc.rpc.blxrbdn.com/',
  'https://bsc-dataseed1.defibit.io/',
];

let preemptiveActive = false;
let workingEndpoint = null;

/**
 * Immediately test and find a working BSC endpoint
 */
async function findWorkingEndpoint() {
  console.log('🔍 Testing BSC endpoints for immediate response...');
  
  for (const endpoint of INSTANT_BSC_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_chainId',
          params: [],
          id: 1
        }),
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      
      const data = await response.json();
      
      if (data.result === '0x38') { // BSC Chain ID
        console.log(`✅ Found working endpoint: ${endpoint}`);
        workingEndpoint = endpoint;
        return endpoint;
      }
    } catch (error) {
      console.log(`⚠️ Endpoint ${endpoint} failed:`, error.message);
    }
  }
  
  // Fallback to first endpoint if none respond
  workingEndpoint = INSTANT_BSC_ENDPOINTS[0];
  return workingEndpoint;
}

/**
 * Override MetaMask IMMEDIATELY before any calls
 */
function overrideMetaMaskImmediately() {
  if (typeof window === 'undefined' || !window.ethereum) {
    return;
  }

  console.log('🚀 PREEMPTIVE RPC OVERRIDE: Intercepting MetaMask immediately...');

  // Store original request method
  const originalRequest = window.ethereum.request;
  
  // Override MetaMask request method with immediate RPC bypass
  window.ethereum.request = async function(args) {
    try {
      // Try original MetaMask request first with short timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('MetaMask timeout')), 2000);
      });
      
      const requestPromise = originalRequest.call(this, args);
      
      const result = await Promise.race([requestPromise, timeoutPromise]);
      return result;
    } catch (error) {
      // If MetaMask fails or times out, use our working endpoint
      if (error.code === -32002 || 
          error.message.includes('RPC endpoint') || 
          error.message.includes('timeout') ||
          error.message.includes('revert data')) {
        
        console.log(`🔄 MetaMask RPC failed (${args.method}), using bypass endpoint...`);
        
        if (!workingEndpoint) {
          workingEndpoint = await findWorkingEndpoint();
        }
        
        // Make direct RPC call to our working endpoint
        try {
          const response = await fetch(workingEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: args.method,
              params: args.params || [],
              id: Date.now()
            }),
            signal: AbortSignal.timeout(5000)
          });
          
          const data = await response.json();
          
          if (data.error) {
            throw new Error(data.error.message);
          }
          
          console.log(`✅ Bypass successful for ${args.method}`);
          return data.result;
        } catch (bypassError) {
          console.error('Bypass also failed:', bypassError);
          throw error; // Throw original error
        }
      }
      
      throw error;
    }
  };

  // Also override ethereum.send for older dApps
  if (window.ethereum.send) {
    const originalSend = window.ethereum.send;
    window.ethereum.send = function(method, params) {
      try {
        return originalSend.call(this, method, params);
      } catch (error) {
        console.log('Send method failed, trying request...');
        return window.ethereum.request({ method, params });
      }
    };
  }

  console.log('✅ Preemptive MetaMask override installed');
  preemptiveActive = true;
  
  // Store activation status
  localStorage.setItem('preemptive_rpc_active', 'true');
  localStorage.setItem('preemptive_endpoint', workingEndpoint || INSTANT_BSC_ENDPOINTS[0]);
}

/**
 * Initialize preemptive fix immediately when script loads
 */
async function initPreemptiveFix() {
  if (typeof window === 'undefined') return;
  
  console.log('🚨 INITIALIZING PREEMPTIVE RPC FIX...');
  
  // Find working endpoint immediately
  await findWorkingEndpoint();
  
  // Override MetaMask before any app code runs
  overrideMetaMaskImmediately();
  
  console.log('🛡️ Preemptive RPC protection active');
}

/**
 * Emergency activation for immediate use
 */
window.activatePreemptiveRPCFix = async function() {
  console.log('🚨 EMERGENCY: Activating preemptive RPC fix...');
  
  await initPreemptiveFix();
  
  // Show success message
  if (window.antd?.message) {
    window.antd.message.success('🛡️ Preemptive RPC fix activated! Reloading...', 2);
  }
  
  // Reload page to apply fix from the start
  setTimeout(() => {
    window.location.reload();
  }, 2000);
  
  return {
    success: true,
    message: 'Preemptive RPC fix activated',
    endpoint: workingEndpoint,
    active: preemptiveActive
  };
};

// Auto-initialize if we're in a browser
if (typeof window !== 'undefined') {
  // Check if preemptive fix was previously activated
  const wasActive = localStorage.getItem('preemptive_rpc_active');
  
  if (wasActive === 'true') {
    console.log('🔄 Restoring preemptive RPC fix...');
    initPreemptiveFix();
  }
  
  // Also initialize if we detect RPC issues in localStorage
  const rpcErrorCount = parseInt(localStorage.getItem('rpc_error_count') || '0');
  if (rpcErrorCount > 0) {
    console.log('🚨 Previous RPC errors detected, activating preemptive fix...');
    initPreemptiveFix();
  }
}

export { 
  initPreemptiveFix, 
  overrideMetaMaskImmediately, 
  findWorkingEndpoint,
  preemptiveActive,
  workingEndpoint
};