import { useWeb3React } from "@web3-react/core";
import { getEllipsisTxt } from "helpers/formatters";
import cn from "lib/cn";

const WalletStatusBar = ({ className = "" }) => {
  const { library, account, active, error } = useWeb3React();
  const connected = Boolean(library && account);

  return (
    <div className={cn("nm-wallet-bar animate-in fade-in duration-500", className)}>
      <span
        className={
          connected ? "nm-badge-success" : error ? "nm-badge-error" : "nm-badge-neutral"
        }
      >
        <span
          className={`w-2 h-2 rounded-full ${
            connected ? "bg-green-500" : error ? "bg-red-500" : "bg-gray-400"
          }`}
        />
        {connected ? "Wallet Connected" : error ? "Connection Error" : "Wallet Disconnected"}
      </span>

      {connected && (
        <>
          <span className="nm-wallet-address">{getEllipsisTxt(account, 6)}</span>
          <span className="nm-badge-info">BSC Ready</span>
        </>
      )}

      {!connected && !error && (
        <span className="text-sm text-gray-500">
          Connect your wallet to interact with Node Meta features
        </span>
      )}
    </div>
  );
};

export default WalletStatusBar;
