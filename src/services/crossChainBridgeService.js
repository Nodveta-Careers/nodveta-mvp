/**
 * NodeMeta Cross-Chain Bridge Service
 * 
 * Advanced cross-chain infrastructure with LayerZero integration
 * Supports bridging NTE tokens across Ethereum, Polygon, BNB Chain, NEAR, and Arbitrum
 */

import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, NETWORK_CONTRACTS } from '../helpers/ContractAddress';
import { networkConfigs } from '../helpers/networks';
import { apiPost, apiGet } from './assessment/apiClient';

// Bridge Contract ABI (LayerZero-based)
const BRIDGE_ABI = [
  "function bridgeToken(uint16 dstChainId, bytes memory to, uint256 amount, address payable refundAddress, address zroPaymentAddress, bytes memory adapterParams) external payable",
  "function estimateFee(uint16 dstChainId, bytes memory to, uint256 amount, bool useZro, bytes memory adapterParams) external view returns (uint256 nativeFee, uint256 zroFee)",
  "function getConfig(uint16 version, uint16 chainId, address ua, uint configType) external view returns (bytes memory)",
  "function bridgeBalanceOf(address user, uint16 chainId) external view returns (uint256)"
];

// Supported chains with LayerZero chain IDs
const SUPPORTED_CHAINS = {
  '1': { // Ethereum
    name: 'Ethereum',
    layerZeroId: 101,
    nativeToken: 'ETH',
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL,
    bridgeAddress: NETWORK_CONTRACTS['0x1']?.BRIDGE
  },
  '56': { // BSC
    name: 'BNB Smart Chain',
    layerZeroId: 102,
    nativeToken: 'BNB', 
    rpcUrl: process.env.NEXT_PUBLIC_BSC_RPC_URL,
    bridgeAddress: NETWORK_CONTRACTS['0x38']?.BRIDGE
  },
  '137': { // Polygon
    name: 'Polygon',
    layerZeroId: 109,
    nativeToken: 'MATIC',
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
    bridgeAddress: NETWORK_CONTRACTS['0x89']?.BRIDGE
  },
  '42161': { // Arbitrum
    name: 'Arbitrum',
    layerZeroId: 110,
    nativeToken: 'ETH',
    rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL,
    bridgeAddress: CONTRACT_ADDRESS.BRIDGE_ADDRESS
  }
};

class CrossChainBridgeService {
  constructor() {
    this.supportedChains = SUPPORTED_CHAINS;
  }

  // Get provider for specific chain
  async getProvider(chainId) {
    const chain = this.supportedChains[chainId];
    if (!chain?.rpcUrl) {
      throw new Error(`Unsupported chain: ${chainId}`);
    }

    if (typeof window !== 'undefined' && window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await web3Provider.getNetwork();
      
      if (network.chainId.toString() === chainId) {
        return web3Provider;
      }
    }

    return new ethers.providers.JsonRpcProvider(chain.rpcUrl);
  }

  // Get bridge contract instance
  async getBridgeContract(chainId, withSigner = false) {
    const provider = await this.getProvider(chainId);
    const chain = this.supportedChains[chainId];
    
    if (!chain?.bridgeAddress) {
      throw new Error(`Bridge contract not deployed on chain ${chainId}`);
    }

    if (withSigner && typeof window !== 'undefined' && window.ethereum) {
      const signer = provider.getSigner();
      return new ethers.Contract(chain.bridgeAddress, BRIDGE_ABI, signer);
    }
    
    return new ethers.Contract(chain.bridgeAddress, BRIDGE_ABI, provider);
  }

  // Get supported bridge routes
  async getSupportedRoutes() {
    try {
      const routes = [];
      
      for (const fromChainId of Object.keys(this.supportedChains)) {
        for (const toChainId of Object.keys(this.supportedChains)) {
          if (fromChainId !== toChainId) {
            const fromChain = this.supportedChains[fromChainId];
            const toChain = this.supportedChains[toChainId];
            
            routes.push({
              from: {
                chainId: fromChainId,
                name: fromChain.name,
                nativeToken: fromChain.nativeToken
              },
              to: {
                chainId: toChainId,
                name: toChain.name,
                nativeToken: toChain.nativeToken
              },
              supported: Boolean(fromChain.bridgeAddress && toChain.bridgeAddress),
              estimatedTime: '5-15 minutes',
              minAmount: '1 NTE',
              maxAmount: '1000000 NTE'
            });
          }
        }
      }

      return {
        success: true,
        routes,
        totalRoutes: routes.length,
        supportedChains: Object.keys(this.supportedChains).length
      };
    } catch (error) {
      console.error('Error fetching supported routes:', error);
      return {
        success: false,
        error: error.message,
        routes: []
      };
    }
  }

  // Estimate bridge fee
  async estimateBridgeFee(fromChainId, toChainId, amount, userAddress) {
    try {
      const fromChain = this.supportedChains[fromChainId];
      const toChain = this.supportedChains[toChainId];
      
      if (!fromChain || !toChain) {
        throw new Error('Unsupported chain combination');
      }

      const bridgeContract = await this.getBridgeContract(fromChainId, false);
      const amountWei = ethers.utils.parseEther(amount.toString());
      
      // Prepare destination address
      const toAddressBytes = ethers.utils.defaultAbiCoder.encode(['address'], [userAddress]);
      
      // Get LayerZero fee estimate
      const [nativeFee, zroFee] = await bridgeContract.estimateFee(
        toChain.layerZeroId,
        toAddressBytes,
        amountWei,
        false, // useZro
        '0x' // adapterParams
      );

      return {
        success: true,
        fees: {
          nativeFee: ethers.utils.formatEther(nativeFee),
          zroFee: ethers.utils.formatEther(zroFee),
          totalFeeUSD: this.calculateFeeUSD(nativeFee, fromChain.nativeToken),
          protocolFee: '0.1%', // NodeMeta protocol fee
          estimatedTotal: ethers.utils.formatEther(nativeFee.mul(110).div(100)) // +10% buffer
        },
        route: {
          from: fromChain.name,
          to: toChain.name,
          estimatedTime: '5-15 minutes'
        }
      };
    } catch (error) {
      console.error('Error estimating bridge fee:', error);
      return {
        success: false,
        error: error.message,
        fees: {
          nativeFee: '0.01',
          estimatedTotal: '0.011'
        }
      };
    }
  }

  // Execute cross-chain bridge transaction
  async executeBridge(fromChainId, toChainId, amount, userAddress) {
    try {
      const fromChain = this.supportedChains[fromChainId];
      const toChain = this.supportedChains[toChainId];
      
      if (!fromChain || !toChain) {
        throw new Error('Unsupported chain combination');
      }

      // Get bridge contract with signer
      const bridgeContract = await this.getBridgeContract(fromChainId, true);
      const amountWei = ethers.utils.parseEther(amount.toString());
      
      // Estimate fees first
      const feeEstimate = await this.estimateBridgeFee(fromChainId, toChainId, amount, userAddress);
      if (!feeEstimate.success) {
        throw new Error('Failed to estimate bridge fees');
      }

      const nativeFee = ethers.utils.parseEther(feeEstimate.fees.estimatedTotal);
      
      // Prepare destination address
      const toAddressBytes = ethers.utils.defaultAbiCoder.encode(['address'], [userAddress]);
      
      // Execute bridge transaction
      const bridgeTx = await bridgeContract.bridgeToken(
        toChain.layerZeroId,
        toAddressBytes,
        amountWei,
        userAddress, // refund address
        ethers.constants.AddressZero, // zro payment address
        '0x', // adapter params
        { value: nativeFee }
      );

      const receipt = await bridgeTx.wait();
      
      // Log bridge transaction to backend
      await this.logBridgeTransaction({
        txHash: receipt.transactionHash,
        fromChain: fromChainId,
        toChain: toChainId,
        amount: amount,
        user: userAddress,
        blockNumber: receipt.blockNumber,
        status: 'pending'
      });

      return {
        success: true,
        transaction: {
          hash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
          from: fromChain.name,
          to: toChain.name,
          amount: amount,
          estimatedArrival: this.calculateArrivalTime()
        },
        message: 'Bridge transaction initiated successfully'
      };
    } catch (error) {
      console.error('Error executing bridge:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get bridge transaction status
  async getBridgeStatus(txHash, fromChainId) {
    try {
      // Check backend for transaction status
      const response = await apiGet(`/bridge/status/${txHash}`, {
        fromChain: fromChainId
      });

      if (response?.transaction) {
        return {
          success: true,
          status: response.transaction.status,
          progress: response.transaction.progress || 0,
          estimatedCompletion: response.transaction.estimatedCompletion,
          confirmations: response.transaction.confirmations
        };
      }

      // Fallback status check
      const provider = await this.getProvider(fromChainId);
      const receipt = await provider.getTransactionReceipt(txHash);
      
      if (!receipt) {
        return {
          success: true,
          status: 'pending',
          progress: 0
        };
      }

      return {
        success: true,
        status: receipt.status === 1 ? 'confirmed' : 'failed',
        progress: receipt.status === 1 ? 50 : 0, // 50% when confirmed on source
        confirmations: receipt.confirmations || 0
      };
    } catch (error) {
      console.error('Error checking bridge status:', error);
      return {
        success: false,
        error: error.message,
        status: 'unknown'
      };
    }
  }

  // Get user's bridge history
  async getBridgeHistory(userAddress) {
    try {
      const response = await apiGet('/bridge/history', {
        address: userAddress
      });

      return {
        success: true,
        transactions: response?.transactions || [],
        totalBridged: response?.totalBridged || '0',
        totalTransactions: response?.totalTransactions || 0
      };
    } catch (error) {
      console.error('Error fetching bridge history:', error);
      return {
        success: false,
        error: error.message,
        transactions: []
      };
    }
  }

  // Get cross-chain balances
  async getCrossChainBalances(userAddress) {
    try {
      const balances = {};
      
      for (const chainId of Object.keys(this.supportedChains)) {
        try {
          const nteContract = NETWORK_CONTRACTS[`0x${parseInt(chainId).toString(16)}`]?.NTE_TOKEN;
          if (nteContract) {
            const provider = await this.getProvider(chainId);
            const tokenContract = new ethers.Contract(
              nteContract,
              ['function balanceOf(address) external view returns (uint256)'],
              provider
            );
            
            const balance = await tokenContract.balanceOf(userAddress);
            balances[chainId] = {
              chain: this.supportedChains[chainId].name,
              balance: ethers.utils.formatEther(balance),
              nativeToken: this.supportedChains[chainId].nativeToken
            };
          }
        } catch (chainError) {
          console.warn(`Error fetching balance for chain ${chainId}:`, chainError);
          balances[chainId] = {
            chain: this.supportedChains[chainId].name,
            balance: '0',
            nativeToken: this.supportedChains[chainId].nativeToken
          };
        }
      }

      return {
        success: true,
        balances,
        totalChains: Object.keys(balances).length
      };
    } catch (error) {
      console.error('Error fetching cross-chain balances:', error);
      return {
        success: false,
        error: error.message,
        balances: {}
      };
    }
  }

  // Utility functions
  calculateFeeUSD(nativeFee, nativeToken) {
    // Mock USD calculation - in production would use price feeds
    const prices = {
      'ETH': 2000,
      'BNB': 300,
      'MATIC': 1
    };
    
    const price = prices[nativeToken] || 1;
    const feeEth = parseFloat(ethers.utils.formatEther(nativeFee));
    return (feeEth * price).toFixed(2);
  }

  calculateArrivalTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10); // 10 minute average
    return now.toISOString();
  }

  async logBridgeTransaction(txData) {
    try {
      await apiPost('/bridge/log-transaction', txData);
    } catch (error) {
      console.warn('Failed to log bridge transaction:', error);
    }
  }
}

// Create singleton instance
const crossChainBridge = new CrossChainBridgeService();

// Export functions
export async function getSupportedRoutes() {
  return crossChainBridge.getSupportedRoutes();
}

export async function estimateBridgeFee(fromChainId, toChainId, amount, userAddress) {
  return crossChainBridge.estimateBridgeFee(fromChainId, toChainId, amount, userAddress);
}

export async function executeBridge(fromChainId, toChainId, amount, userAddress) {
  return crossChainBridge.executeBridge(fromChainId, toChainId, amount, userAddress);
}

export async function getBridgeStatus(txHash, fromChainId) {
  return crossChainBridge.getBridgeStatus(txHash, fromChainId);
}

export async function getBridgeHistory(userAddress) {
  return crossChainBridge.getBridgeHistory(userAddress);
}

export async function getCrossChainBalances(userAddress) {
  return crossChainBridge.getCrossChainBalances(userAddress);
}

export default crossChainBridge;