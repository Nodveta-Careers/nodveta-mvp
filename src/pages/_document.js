import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* CRITICAL: Load RPC fix before ANY other scripts */}
        <script src="/preemptive-rpc-fix.js" />
        
        <link rel="icon" href="/nodemeta-logo.png" />
        <meta
          name="description"
          content="Node Meta — Web3 infrastructure ecosystem on BNB Smart Chain. https://node-meta.com"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&family=Roboto+Mono:wght@100&display=swap"
          rel="stylesheet"
        />
        
        {/* Emergency RPC fix styling */}
        <style>{`
          .emergency-rpc-button {
            position: fixed !important;
            top: 10px !important;
            right: 10px !important;
            z-index: 99999 !important;
            background: linear-gradient(135deg, #ff1744 0%, #d50000 100%) !important;
            color: white !important;
            border: none !important;
            padding: 8px 16px !important;
            border-radius: 20px !important;
            font-weight: bold !important;
            font-size: 12px !important;
            cursor: pointer !important;
            box-shadow: 0 4px 15px rgba(255, 23, 68, 0.4) !important;
            animation: pulse 2s infinite !important;
          }
          
          .emergency-rpc-button:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 6px 20px rgba(255, 23, 68, 0.6) !important;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}</style>
      </Head>
      <body>
        {/* Emergency RPC fix button - always visible */}
        <button 
          className="emergency-rpc-button"
          onClick="window.EMERGENCY_RPC_FIX && window.EMERGENCY_RPC_FIX()"
          title="Click if you're seeing RPC errors - Will reload page with fix"
        >
          ⚡ FIX RPC
        </button>
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Track RPC errors and highlight emergency button
              window.addEventListener('unhandledrejection', function(event) {
                const error = event.reason;
                if (error && (
                  error.code === -32002 || 
                  (error.message && (
                    error.message.includes('RPC endpoint') ||
                    error.message.includes('revert data') ||
                    error.message.includes('call exception')
                  ))
                )) {
                  console.log('🚨 RPC error detected, emergency button available');
                  const btn = document.querySelector('.emergency-rpc-button');
                  if (btn) {
                    btn.style.animation = 'pulse 0.5s infinite';
                    btn.textContent = '🚨 FIX NOW';
                    btn.style.fontSize = '14px';
                  }
                }
              });
              
              // Also track regular errors
              window.addEventListener('error', function(event) {
                const error = event.error;
                if (error && error.message && (
                  error.message.includes('RPC endpoint') ||
                  error.message.includes('revert data')
                )) {
                  const btn = document.querySelector('.emergency-rpc-button');
                  if (btn) {
                    btn.style.animation = 'pulse 0.3s infinite';
                    btn.textContent = '🚨 URGENT';
                    btn.style.background = 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)';
                  }
                }
              });
            `
          }}
        />
        
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
