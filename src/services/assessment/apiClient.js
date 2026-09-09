/**
 * NodeMeta Ecosystem API Client
 * 
 * Production-ready client for NodeMeta backend services
 * Supports NFT marketplace, staking, commerce, and trading APIs
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4003/api";

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 30000; // 30 seconds
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add timeout support
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      console.error(`NodeMeta API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const urlParams = new URLSearchParams(params).toString();
    const fullEndpoint = urlParams ? `${endpoint}?${urlParams}` : endpoint;
    
    return this.request(fullEndpoint, {
      method: 'GET',
    });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT', 
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // NodeMeta specific API methods
  async getNFTMintCount() {
    return this.get('/nft/total-mint-count');
  }

  async getSalesHistory(walletAddress) {
    return this.post('/history/sales', { account: walletAddress });
  }

  async getStakingRewards(walletAddress) {
    return this.post('/staking/rewards', { account: walletAddress });
  }

  async submitCommerceOrder(orderData) {
    return this.post('/commerce/order', orderData);
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Export legacy functions for compatibility
export async function apiGet(path, params) {
  return apiClient.get(path, params);
}

export async function apiPost(path, body) {
  return apiClient.post(path, body);
}

// Export the client instance
export default apiClient;
