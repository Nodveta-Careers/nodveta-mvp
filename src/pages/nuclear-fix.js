/**
 * Nuclear RPC Fix Page
 * Emergency page for complete MetaMask RPC bypass
 */

import React from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Alert } from '@mui/material';
import NuclearRPCFix from '../components/ui/NuclearRPCFix';

const NuclearFixPage = () => {
  return (
    <>
      <Head>
        <title>Nuclear RPC Fix - Nodveta Emergency</title>
        <meta name="description" content="Emergency nuclear fix for persistent MetaMask RPC connection issues" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/nodemeta-logo.png" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-50 to-yellow-50 py-8">
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <div className="text-8xl mb-4">☢️</div>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: '#c62828' }}>
              Nuclear RPC Fix
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              Last resort solution for persistent MetaMask RPC failures
            </Typography>
          </Box>

          <Alert severity="error" sx={{ mb: 4 }}>
            <strong>⚠️ EMERGENCY ONLY:</strong> This fix completely bypasses MetaMask's RPC configuration. 
            Use only when standard fixes have repeatedly failed and the application is unusable.
          </Alert>

          <Alert severity="info" sx={{ mb: 4 }}>
            <strong>What this does:</strong>
            <ul className="mt-2 ml-4">
              <li>Overrides all MetaMask RPC calls with direct blockchain connections</li>
              <li>Bypasses rate limiting and congestion completely</li>
              <li>Forces the use of ultra-reliable BSC endpoints</li>
              <li>Maintains MetaMask signing functionality</li>
              <li>Persists across browser sessions until manually reset</li>
            </ul>
          </Alert>

          <div className="flex justify-center">
            <NuclearRPCFix />
          </div>

          <Box sx={{ mt: 6, p: 3, bgcolor: '#ffebee', borderRadius: 2, border: '1px solid #ffcdd2' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#c62828' }}>
              ⚠️ Important Warnings
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>This is an emergency measure:</strong> The nuclear fix completely overrides normal blockchain 
              interaction patterns. While safe, it should be disabled once BSC network conditions improve.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Performance Impact:</strong> The bypass may slightly increase initial connection times 
              as it tests multiple endpoints for reliability.
            </Typography>
            <Typography variant="body1">
              <strong>Reverting:</strong> To disable the nuclear fix, clear your browser's localStorage 
              or use the "Reset RPC Configuration" option in the Advanced settings.
            </Typography>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Need help? This fix was automatically generated to resolve persistent RPC issues.<br />
              Contact Nodveta support if problems continue after using the nuclear option.
            </Typography>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default NuclearFixPage;