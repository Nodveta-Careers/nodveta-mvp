
// NodeMeta Ecosystem Contract Addresses
export const CONTRACT_ADDRESS = {
    // NTE Token (Node Meta Energy) - BSC Mainnet
    NTE_TOKEN: "0x4c1b07164080A652cB1B7B1c61951c082c9e5FF8",
    
    // Legacy ERC20 reference (for compatibility)
    ERC_20: "0x4c1b07164080A652cB1B7B1c61951c082c9e5FF8",
    
    // NodeMeta NFT Collection - BSC Mainnet
    ERC_721: "0xe66326CE9B97Bd59CCE370692aeeF8fA9feadEF6",
    
    // Presale contract address - BSC Mainnet  
    PRESALE_ADDRESS: "0x9238c202C55d3dAE6dC8d645F7a78c57683A8bcc",
    
    // Staking contract address - BSC Mainnet
    STAKING_ADDRESS: "0x727ab05e93a7406eF02Dd9B6E068e4900E4a8b0B",
    
    // SmartCommerce contract - BSC Mainnet
    COMMERCE_ADDRESS: "0x2BF13D124b8C3D0a5E5916C2F8e5C0F0e4C4B8F9",
    
    // Cross-chain bridge - Multi-network
    BRIDGE_ADDRESS: "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B"
}

// Network-specific configurations
export const NETWORK_CONTRACTS = {
    // BSC Mainnet (0x38)
    "0x38": {
        NTE_TOKEN: CONTRACT_ADDRESS.NTE_TOKEN,
        STAKING: CONTRACT_ADDRESS.STAKING_ADDRESS,
        COMMERCE: CONTRACT_ADDRESS.COMMERCE_ADDRESS,
        NFT_MARKETPLACE: CONTRACT_ADDRESS.ERC_721,
    },
    
    // Ethereum Mainnet (0x1) 
    "0x1": {
        BRIDGE: CONTRACT_ADDRESS.BRIDGE_ADDRESS,
        // Cross-chain NTE representation
        NTE_TOKEN: "0x8A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B", 
    },
    
    // Polygon Mainnet (0x89)
    "0x89": {
        BRIDGE: CONTRACT_ADDRESS.BRIDGE_ADDRESS,
        // Cross-chain NTE representation  
        NTE_TOKEN: "0x9B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C",
    }
}