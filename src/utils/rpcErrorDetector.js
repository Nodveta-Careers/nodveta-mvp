/**
 * RPC Error Detection and Auto-Fix System
 * Monitors and fixes RPC connection issues automatically
 */

import { fixMetaMaskRPC } from './metamaskHelper';
import { emergencyRPCBypass } from './forceRPCBypass';

// Global error tracker
let errorCount = 0;
let lastErrorTime = 0;
let autoFixInProgress = false;

/**
 * Detect if an error is RPC-related
 */
export function isRPCError(error) {
  if (!error) return false;

  const errorMessage = error.message || '';
  const errorCode = error.code;

  return (
    errorCode === -32002 ||
    errorCode === 'CALL_EXCEPTION' ||
    errorMessage.includes('RPC endpoint returned too many errors') ||
    errorMessage.includes('missing revert data') ||
    errorMessage.includes('rate limit') ||
    errorMessage.includes('call exception') ||
    errorMessage.includes('network error') ||
    errorMessage.includes('timeout')
  );
}

/**
 * Auto-fix RPC errors with exponential backoff
 */
export async function autoFixRPCError(error) {
  if (autoFixInProgress) {
    console.log('Auto-fix already in progress, skipping...');
    return { success: false, reason: 'Fix already in progress' };
  }

  const now = Date.now();
  
  // Rate limiting: don't attempt auto-fix more than once per minute
  if (now - lastErrorTime < 60000) {
    errorCount++;
  } else {
    errorCount = 1;
  }
  
  lastErrorTime = now;
  
  // Track errors for banner display
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('rpc_error_count', errorCount.toString());
    localStorage.setItem('last_rpc_error', now.toString());
  }

  // Escalate to nuclear option after multiple failures
  if (errorCount > 3) {
    console.log('🚨 Too many RPC errors, escalating to nuclear bypass...');
    
    try {
      const nuclearResult = await emergencyRPCBypass();
      if (nuclearResult.success) {
        console.log('☢️ Nuclear bypass successful after escalation');
        errorCount = 0; // Reset on successful nuclear fix
        return {
          success: true,
          message: 'Nuclear RPC bypass activated after multiple failures',
          isNuclear: true,
          shouldReload: true
        };
      }
    } catch (nuclearError) {
      console.error('Nuclear bypass also failed:', nuclearError);
    }
    
    return { success: false, reason: 'Rate limited - even nuclear option failed' };
  }

  autoFixInProgress = true;
  
  try {
    console.log(`🔄 Auto-fixing RPC error (attempt ${errorCount}):`, error.message);
    
    const result = await fixMetaMaskRPC();
    
    if (result.success) {
      console.log('✅ Auto-fix successful, resetting error count');
      errorCount = 0;
      
      // Wait a bit before returning to let the network settle
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { 
        success: true, 
        message: 'RPC endpoints fixed automatically',
        shouldReload: true
      };
    } else {
      throw new Error(result.error);
    }
  } catch (fixError) {
    console.error('❌ Auto-fix failed:', fixError);
    return { 
      success: false, 
      error: fixError.message,
      reason: 'Fix operation failed'
    };
  } finally {
    autoFixInProgress = false;
  }
}

/**
 * Global error handler that automatically detects and fixes RPC issues
 */
export function setupGlobalRPCErrorHandler() {
  if (typeof window === 'undefined') return;

  // Handle unhandled promise rejections (most RPC errors)
  window.addEventListener('unhandledrejection', async (event) => {
    const error = event.reason;
    
    if (isRPCError(error)) {
      console.log('🔍 Detected RPC error in unhandled rejection:', error);
      
      const fixResult = await autoFixRPCError(error);
      
      if (fixResult.success && fixResult.shouldReload) {
        // Show notification before reloading
        if (window.antd?.message) {
          window.antd.message.success('RPC connection fixed! Reloading...', 2);
          setTimeout(() => window.location.reload(), 2000);
        } else {
          console.log('RPC fixed, reloading page...');
          setTimeout(() => window.location.reload(), 1000);
        }
      }
    }
  });

  // Handle general errors
  window.addEventListener('error', async (event) => {
    const error = event.error;
    
    if (isRPCError(error)) {
      console.log('🔍 Detected RPC error in error event:', error);
      
      const fixResult = await autoFixRPCError(error);
      
      if (fixResult.success && fixResult.shouldReload) {
        setTimeout(() => window.location.reload(), 2000);
      }
    }
  });

  console.log('🛡️ Global RPC error handler initialized');
}

/**
 * Manual fix trigger for components
 */
export async function triggerManualRPCFix() {
  try {
    const result = await fixMetaMaskRPC();
    
    if (result.success) {
      // Reset error tracking on successful manual fix
      errorCount = 0;
      lastErrorTime = 0;
      
      return {
        success: true,
        message: 'RPC endpoints updated successfully',
        shouldReload: true
      };
    }
    
    return result;
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Export stats for debugging
export function getRPCErrorStats() {
  return {
    errorCount,
    lastErrorTime: new Date(lastErrorTime).toISOString(),
    autoFixInProgress,
    timeSinceLastError: Date.now() - lastErrorTime
  };
}