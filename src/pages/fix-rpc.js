/**
 * RPC Fix Page
 * Dedicated page for fixing RPC connection issues
 */

import React from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Alert } from '@mui/material';
import InstantRPCFix from '../components/ui/InstantRPCFix';

const FixRPCPage = () => {
  return (
    <>
      <Head>
        <title>Fix RPC Connection - Nodveta</title>
        <meta name="description" content="Fix MetaMask RPC connection issues with reliable BSC endpoints" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/nodemeta-logo.png" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: '#d97706' }}>
              🔧 Fix RPC Connection Issues
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Resolve MetaMask BSC network connection problems instantly
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 4 }}>
            <strong>Common RPC Errors:</strong>
            <ul className="mt-2 ml-4">
              <li>Error -32002: RPC endpoint returned too many errors</li>
              <li>Missing revert data in call exception</li>
              <li>Rate limiting errors</li>
              <li>Connection timeouts</li>
            </ul>
          </Alert>

          <div className="flex justify-center">
            <InstantRPCFix />
          </div>

          <Box sx={{ mt: 6, p: 3, bgcolor: '#f8fafc', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              💡 Why This Happens
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              BSC RPC endpoints can become overloaded with requests, causing MetaMask to fail when trying to connect to the blockchain. This is especially common with popular endpoints.
            </Typography>
            <Typography variant="body1">
              Our fix switches your MetaMask to use reliable, less congested RPC endpoints that provide better performance and stability.
            </Typography>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Need help? Contact Nodveta support or check our documentation.
            </Typography>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default FixRPCPage;