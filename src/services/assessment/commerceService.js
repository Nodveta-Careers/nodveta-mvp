/**
 * Nodveta SmartCommerce Service
 * 
 * Infrastructure commerce engine connecting digital assets to real-world transactions
 * Supports reliable payments, merchant integration, and cross-chain commerce
 */

import { apiPost, apiGet } from "./apiClient";
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, NETWORK_CONTRACTS } from '../../helpers/ContractAddress';

class SmartCommerceService {
  constructor() {
    this.chainId = "0x38"; // BSC Mainnet
    this.commerceAddress = NETWORK_CONTRACTS[this.chainId]?.COMMERCE_ADDRESS;
    this.nteAddress = NETWORK_CONTRACTS[this.chainId]?.NTE_TOKEN;
  }

  async submitCommerceOrder(payload) {
    try {
      // Validate wallet connection
      if (!payload.account) {
        throw new Error('Wallet connection required for commerce transactions');
      }

      // Enhance payload for Nodveta ecosystem
      const enhancedPayload = {
        ...payload,
        orderId: ethers.utils.id(`order-${Date.now()}-${Math.random()}`),
        timestamp: new Date().toISOString(),
        paymentToken: 'NTE',
        chainId: this.chainId,
        platform: 'Nodveta SmartCommerce',
        fees: this.calculateFees(payload.price || payload.totalAmount || 0)
      };

      // Submit to backend
      const data = await apiPost("/buy/buy", enhancedPayload);
      
      return { 
        success: true, 
        data,
        orderId: enhancedPayload.orderId,
        message: 'Order submitted successfully to Nodveta SmartCommerce'
      };
    } catch (error) {
      console.error('SmartCommerce order error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to submit commerce order'
      };
    }
  }

  async getMerchantListings(category = 'all') {
    try {
      const merchants = await apiGet('/commerce/merchants', { category });
      return {
        success: true,
        merchants: merchants || [
          {
            id: 'merchant-1',
            name: 'Nodveta Electronics',
            category: 'Electronics',
            rating: 4.8,
            products: 156,
            verified: true
          },
          {
            id: 'merchant-2', 
            name: 'Crypto Gaming Store',
            category: 'Gaming',
            rating: 4.9,
            products: 89,
            verified: true
          },
          {
            id: 'merchant-3',
            name: 'Digital Assets Hub',
            category: 'Digital Services', 
            rating: 4.7,
            products: 234,
            verified: true
          }
        ]
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        merchants: []
      };
    }
  }

  calculateFees(amount) {
    const baseAmount = parseFloat(amount) || 0;
    return {
      platformFee: (baseAmount * 0.025).toFixed(4), // 2.5% Nodveta platform fee
      processingFee: (baseAmount * 0.01).toFixed(4), // 1% processing fee
      total: (baseAmount * 0.035).toFixed(4)
    };
  }

  async getOrderHistory(walletAddress) {
    try {
      const response = await apiPost('/history/sales', { account: walletAddress });
      return {
        success: true,
        orders: response?.orders || response?.data || []
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        orders: []
      };
    }
  }
}

const smartCommerceService = new SmartCommerceService();

// Main export function
export async function submitCommerceOrder(payload) {
  return smartCommerceService.submitCommerceOrder(payload);
}

// Legacy function for compatibility  
export function buildCommercePayload(walletAddress, productId, price) {
  return {
    account: walletAddress,
    productId,
    price,
    timestamp: new Date().toISOString(),
    platform: 'NodeMeta'
  };
}

// Additional exports
export async function getMerchantListings(category) {
  return smartCommerceService.getMerchantListings(category);
}

export async function getOrderHistory(walletAddress) {
  return smartCommerceService.getOrderHistory(walletAddress);
}

export default smartCommerceService;
