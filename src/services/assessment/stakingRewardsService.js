/**
 * NodeMeta Staking Rewards Service
 * 
 * Production staking service for NTE token on BSC
 * Handles balance fetching, validation, and pool display
 */

import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, NETWORK_CONTRACTS } from '../../helpers/ContractAddress';
import { getReliableProvider } from '../../utils/rpcProvider';

// NTE Token ABI for balance queries
const ERC20_ABI = [
  "function balanceOf(address owner) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)"
];

// Staking contract ABI
const STAKING_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function earned(address account) external view returns (uint256)",
  "function rewardRate() external view returns (uint256)",
  "function totalStaked() external view returns (uint256)"
];

export async function fetchWalletBalance(library, account) {
  try {
    if (!account) {
      return "0.0 BNB";
    }

    // Use reliable RPC provider for balance queries
    const reliableProvider = getReliableProvider(56); // BSC mainnet

    try {
      // Get BNB balance using reliable provider
      const bnbBalance = await reliableProvider.getBalance(account);
      const bnbFormatted = parseFloat(ethers.utils.formatEther(bnbBalance)).toFixed(4);

      // Get NTE balance
      const nteAddress = NETWORK_CONTRACTS["0x38"]?.NTE_TOKEN;
      if (nteAddress) {
        const provider = await reliableProvider.getProvider();
        const nteContract = new ethers.Contract(nteAddress, ERC20_ABI, provider);
        const nteBalance = await nteContract.balanceOf(account);
        const nteFormatted = parseFloat(ethers.utils.formatEther(nteBalance)).toFixed(2);
        
        return `${bnbFormatted} BNB | ${nteFormatted} NTE`;
      }
      
      return `${bnbFormatted} BNB`;
    } catch (rpcError) {
      console.warn('Reliable RPC provider failed, falling back to library provider:', rpcError);
      
      // Fallback to original library if available
      if (library) {
        const bnbBalance = await library.getBalance(account);
        const bnbFormatted = parseFloat(ethers.utils.formatEther(bnbBalance)).toFixed(4);
        return `${bnbFormatted} BNB`;
      }
      
      throw rpcError;
    }
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    
    // Return informative error message
    if (error.code === -32002) {
      return "RPC Error - Try again";
    }
    
    return "0.0 BNB";
  }
}

export async function fetchNTEBalance(library, account) {
  try {
    if (!library || !account) {
      return "0";
    }

    const nteAddress = NETWORK_CONTRACTS["0x38"]?.NTE_TOKEN;
    if (!nteAddress) {
      console.warn('NTE token address not configured for BSC');
      return "0";
    }

    const nteContract = new ethers.Contract(nteAddress, ERC20_ABI, library);
    const balance = await nteContract.balanceOf(account);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error fetching NTE balance:', error);
    return "0";
  }
}

export function validateStakeAmount(amount, maxBalance) {
  try {
    // Check if amount is provided
    if (!amount || amount.trim() === "") {
      return { valid: false, message: "Please enter a staking amount" };
    }

    const numAmount = parseFloat(amount);
    const numMaxBalance = parseFloat(maxBalance);

    // Check if amount is a valid number
    if (isNaN(numAmount) || numAmount <= 0) {
      return { valid: false, message: "Please enter a valid positive amount" };
    }

    // Check if amount exceeds balance
    if (numAmount > numMaxBalance) {
      return { 
        valid: false, 
        message: `Amount exceeds balance. Maximum: ${numMaxBalance.toFixed(4)} NTE` 
      };
    }

    // Check minimum stake amount (e.g., 0.01 NTE)
    if (numAmount < 0.01) {
      return { valid: false, message: "Minimum stake amount is 0.01 NTE" };
    }

    return { valid: true };
  } catch (error) {
    console.error('Error validating stake amount:', error);
    return { valid: false, message: "Invalid amount format" };
  }
}

export async function getStakingPoolDisplay(library, account) {
  try {
    const baseDisplay = {
      apr: "0.000%",
      walletBalance: "0.0 NTE",
      staked: "0.0 NTE", 
      earned: "0.0000 NTE",
    };

    if (!library || !account) {
      return baseDisplay;
    }

    // Get NTE balance
    const nteBalance = await fetchNTEBalance(library, account);
    
    // Get staking data if staking contract is available
    const stakingAddress = NETWORK_CONTRACTS["0x38"]?.STAKING;
    if (stakingAddress) {
      try {
        const stakingContract = new ethers.Contract(stakingAddress, STAKING_ABI, library);
        
        const [userStaked, userEarned, rewardRate, totalStaked] = await Promise.all([
          stakingContract.balanceOf(account).catch(() => ethers.BigNumber.from("0")),
          stakingContract.earned(account).catch(() => ethers.BigNumber.from("0")),
          stakingContract.rewardRate().catch(() => ethers.BigNumber.from("0")),
          stakingContract.totalStaked().catch(() => ethers.BigNumber.from("0"))
        ]);

        // Calculate APR
        let apr = "85.50"; // Default APR
        if (!totalStaked.isZero() && !rewardRate.isZero()) {
          const secondsPerYear = ethers.BigNumber.from("31536000");
          const annualRewards = rewardRate.mul(secondsPerYear);
          const aprBasisPoints = annualRewards.mul(10000).div(totalStaked);
          apr = parseFloat(ethers.utils.formatUnits(aprBasisPoints, 2)).toFixed(2);
        }

        return {
          apr: `${apr}%`,
          walletBalance: `${parseFloat(nteBalance).toFixed(4)} NTE`,
          staked: `${parseFloat(ethers.utils.formatEther(userStaked)).toFixed(4)} NTE`,
          earned: `${parseFloat(ethers.utils.formatEther(userEarned)).toFixed(6)} NTE`,
        };
      } catch (contractError) {
        console.warn('Staking contract not available, using fallback:', contractError);
      }
    }

    // Fallback display with wallet balance
    return {
      ...baseDisplay,
      apr: "85.50%", // NodeMeta default APR
      walletBalance: `${parseFloat(nteBalance).toFixed(4)} NTE`,
    };
    
  } catch (error) {
    console.error('Error getting staking pool display:', error);
    return {
      apr: "85.50%",
      walletBalance: "0.0 NTE",
      staked: "0.0 NTE",
      earned: "0.0000 NTE",
    };
  }
}

// Additional utility functions for NodeMeta ecosystem
export async function getStakingStats(library) {
  try {
    const stakingAddress = NETWORK_CONTRACTS["0x38"]?.STAKING;
    if (!stakingAddress || !library) {
      return {
        totalValueLocked: "0",
        totalStakers: "0", 
        rewardRate: "0"
      };
    }

    const stakingContract = new ethers.Contract(stakingAddress, STAKING_ABI, library);
    const totalStaked = await stakingContract.totalStaked();
    
    return {
      totalValueLocked: ethers.utils.formatEther(totalStaked),
      totalStakers: "0", // Would need additional contract method
      rewardRate: "85.50" // Default NodeMeta APR
    };
  } catch (error) {
    console.error('Error fetching staking stats:', error);
    return {
      totalValueLocked: "0",
      totalStakers: "0",
      rewardRate: "85.50"
    };
  }
}
