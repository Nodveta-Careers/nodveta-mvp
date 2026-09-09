/**
 * Lightweight Moralis stub for local development and assessment.
 * Avoids calls to the deprecated Moralis Parse API (server v1).
 * Wallet features use @web3-react directly.
 */
export function getStubMoralis() {
  const listeners = {
    chainChanged: [],
    accountsChanged: [],
  };

  const toHexChainId = (chainId) => {
    if (typeof chainId === "string" && chainId.startsWith("0x")) {
      return chainId;
    }
    return `0x${Number(chainId).toString(16)}`;
  };

  const Moralis = {
    start: () => Promise.resolve(),
    onChainChanged: (fn) => {
      listeners.chainChanged.push(fn);
    },
    onAccountsChanged: (fn) => {
      listeners.accountsChanged.push(fn);
    },
    Plugins: {},
    Units: {
      Token: (amount) => ({
        toString: () => String(amount),
      }),
    },
    // Add Web3 API stubs
    Web3API: {
      account: {
        getTokenTransfers: () => Promise.resolve({ result: [] }),
        getNFTs: () => Promise.resolve({ result: [] }),
        getTransactions: () => Promise.resolve({ result: [] }),
        getNativeBalance: () => Promise.resolve({ balance: "0" }),
      },
      token: {
        getTokenPrice: () => Promise.resolve({ usdPrice: 0 }),
      },
      native: {
        runContractFunction: () => Promise.resolve({}),
      },
    },
    Web3: (() => {
      function Web3StubConstructor(provider) {
        // This is a stub constructor for Moralis.Web3
        const web3Instance = {
          currentProvider: provider || (typeof window !== "undefined" ? window.ethereum : null),
          switchNetwork: async (chainId) => {
            if (typeof window === "undefined" || !window.ethereum) {
              throw new Error("No wallet provider found");
            }
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: toHexChainId(chainId) }],
            });
          },
          // Add other Web3 stub methods as needed
          eth: {
            getAccounts: () => Promise.resolve([]),
            getBalance: () => Promise.resolve("0"),
          }
        };
        return web3Instance;
      }
      
      // Add static methods to the constructor
      Web3StubConstructor.onChainChanged = (fn) => {
        listeners.chainChanged.push(fn);
      };
      
      Web3StubConstructor.onAccountsChanged = (fn) => {
        listeners.accountsChanged.push(fn);
      };
      
      Web3StubConstructor.switchNetwork = async (chainId) => {
        if (typeof window === "undefined" || !window.ethereum) {
          throw new Error("No wallet provider found");
        }
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: toHexChainId(chainId) }],
        });
      };
      
      return Web3StubConstructor;
    })(),
    enableWeb3: () => Promise.resolve(),
    disableWeb3: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    authenticate: () => Promise.resolve({}),
    web3: {
      givenProvider:
        typeof window !== "undefined" ? window.ethereum : null,
    },
  };

  return Moralis;
}

export default getStubMoralis;
