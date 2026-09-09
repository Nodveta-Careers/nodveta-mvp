/**
 * NodeMeta Advanced Features Page
 * Comprehensive dashboard for all advanced ecosystem functionality
 */

import React from 'react';
import Head from 'next/head';
import { useMoralis } from 'react-moralis';
import AdvancedFeatures from '../components/dashboard/AdvancedFeatures';

const AdvancedFeaturesPage = () => {
  const { account } = useMoralis();

  return (
    <>
      <Head>
        <title>Advanced Features - NodeMeta Ecosystem</title>
        <meta 
          name="description" 
          content="Explore NodeMeta's advanced Web3 features including AI trading bots, cross-chain bridges, smart commerce, and tokenomics dashboard" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/nodemeta-logo.png" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Advanced Features - NodeMeta Ecosystem" />
        <meta property="og:description" content="AI Trading Bots, Cross-Chain Bridge, Smart Commerce & Tokenomics Dashboard" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/nodemeta-logo.png" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NodeMeta Advanced Features" />
        <meta name="twitter:description" content="Cutting-edge Web3 functionality for the decentralized future" />
        <meta name="twitter:image" content="/nodemeta-logo.png" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <AdvancedFeatures address={account} />
        </div>
      </div>
    </>
  );
};

export default AdvancedFeaturesPage;