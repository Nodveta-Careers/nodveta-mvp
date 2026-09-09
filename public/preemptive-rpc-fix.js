/**
 * Preemptive RPC Fix - Critical Script
 * MUST load before any other scripts to prevent RPC errors
 */

(function() {
  'use strict';
  
  console.log('🚨 CRITICAL: Preemptive RPC fix loading...');
  
  // Ultra-reliable BSC endpoints
  const ENDPOINTS = [
    'https://bsc-dataseed1.binance.org/',
    'https://bsc-dataseed2.binance.org/',
    'https://rpc.ankr.com/bsc',
    'https://bsc.rpc.blxrbdn.com/'
  ];
  
  let workingEndpoint = null;
  let isActive = false;
  
  // Test endpoint immediately
  async function testEndpoint(endpoint) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_chainId',
          params: [],
          id: 1
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const data = await response.json();
      
      return data.result === '0x38'; // BSC chain ID
    } catch {
      return false;
    }
  }
  
  // Find working endpoint
  async function findWorkingEndpoint() {
    for (const endpoint of ENDPOINTS) {
      if (await testEndpoint(endpoint)) {
        console.log(`✅ Working endpoint found: ${endpoint}`);
        workingEndpoint = endpoint;
        return endpoint;
      }
    }
    
    // Fallback
    workingEndpoint = ENDPOINTS[0];
    return workingEndpoint;
  }
  
  // Bypass function for RPC calls
  async function bypassRPC(method, params = []) {
    if (!workingEndpoint) {
      await findWorkingEndpoint();
    }
    
    const response = await fetch(workingEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: Date.now()
      })
    });
    
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.result;
  }
  
  // Override MetaMask immediately
  function overrideMetaMask() {
    if (typeof window === 'undefined' || !window.ethereum) {
      return;
    }
    
    const original = window.ethereum.request;
    
    window.ethereum.request = async function(args) {
      try {
        // Try MetaMask with 1 second timeout
        const timeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 1000);
        });
        
        const result = await Promise.race([
          original.call(this, args),
          timeout
        ]);
        
        return result;
      } catch (error) {
        // Use bypass for RPC errors
        if (error.code === -32002 || 
            error.message.includes('RPC endpoint') ||
            error.message.includes('revert data') ||
            error.message.includes('Timeout')) {
          
          console.log(`🔄 Bypassing ${args.method} due to RPC error`);
          
          try {
            return await bypassRPC(args.method, args.params);
          } catch (bypassError) {
            console.error('Bypass failed:', bypassError);
            throw error;
          }
        }
        
        throw error;
      }
    };
    
    console.log('🛡️ MetaMask override active');
    isActive = true;
    localStorage.setItem('preemptive_fix_active', 'true');
  }
  
  // Check if we should activate
  function shouldActivate() {
    // Always activate if previously active
    if (localStorage.getItem('preemptive_fix_active') === 'true') {
      return true;
    }
    
    // Activate if there were recent RPC errors
    const errorCount = parseInt(localStorage.getItem('rpc_error_count') || '0');
    const lastError = parseInt(localStorage.getItem('last_rpc_error') || '0');
    const hourAgo = Date.now() - (60 * 60 * 1000);
    
    return errorCount > 0 && lastError > hourAgo;
  }
  
  // Initialize when DOM is ready
  function initialize() {
    if (shouldActivate()) {
      console.log('🚀 Activating preemptive RPC fix...');
      
      // Find working endpoint first
      findWorkingEndpoint().then(() => {
        // Wait for ethereum to be available
        const checkEthereum = setInterval(() => {
          if (window.ethereum) {
            clearInterval(checkEthereum);
            overrideMetaMask();
          }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => clearInterval(checkEthereum), 5000);
      });
    }
  }
  
  // Global emergency function
  window.EMERGENCY_RPC_FIX = async function() {
    console.log('🚨 EMERGENCY RPC FIX ACTIVATED');
    
    await findWorkingEndpoint();
    
    if (window.ethereum) {
      overrideMetaMask();
    }
    
    // Mark as active and reload
    localStorage.setItem('preemptive_fix_active', 'true');
    
    alert('🛡️ Emergency RPC fix activated! The page will reload with protection.');
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  
  // Initialize based on document state
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  console.log('📡 Preemptive RPC fix ready');
})();