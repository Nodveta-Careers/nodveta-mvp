import dynamic from "next/dynamic";
import Head from "next/head";
import "styles/globals.css";
import { useEffect } from "react";
import { setupGlobalRPCErrorHandler } from "utils/rpcErrorDetector";

const AppProviders = dynamic(() => import("components/AppProviders"), {
  ssr: false,
});

const AntdStyles = dynamic(() => import("components/AntdStyles"), {
  ssr: false,
});

const Layout = dynamic(() => import("components/Layout"), {
  ssr: false,
});

const ErrorBoundary = dynamic(() => import("components/ErrorBoundary"), {
  ssr: false,
});

const RPCErrorNotification = dynamic(() => import("components/ui/RPCErrorNotification"), {
  ssr: false,
});

const EmergencyRPCButton = dynamic(() => import("components/ui/EmergencyRPCButton"), {
  ssr: false,
});

export default function App({ Component, pageProps }) {
  // Initialize global RPC error handling
  useEffect(() => {
    setupGlobalRPCErrorHandler();
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/nodemeta-logo.png" />
        <title>Node Meta</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <AntdStyles />
      <ErrorBoundary>
        <AppProviders>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppProviders>
        <RPCErrorNotification />
        <EmergencyRPCButton />
      </ErrorBoundary>
    </>
  );
}
