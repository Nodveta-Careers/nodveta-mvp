import Head from "next/head";
import React from 'react';
import { Container, Typography, Box, Card, CardContent, Alert, Button, Grid } from '@mui/material';

const RelayPage = () => {
  return (
    <>
      <Head>
        <title>Nodveta Relay - Transaction Infrastructure</title>
        <meta name="description" content="Reliable transaction submission, simulation, and confirmation tracking across blockchain networks." />
      </Head>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
            ⚡ Nodveta Relay
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Dependable transaction execution and monitoring layer for blockchain applications
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 4 }}>
          <strong>Infrastructure Service:</strong> Nodveta Relay provides reliable transaction submission, 
          simulation, and confirmation tracking across Solana, Ethereum, and BSC networks.
        </Alert>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  🎯 Core Capabilities
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <li>Transaction simulation and validation</li>
                  <li>Multi-RPC provider routing with failover</li>
                  <li>Gas optimization and priority fee management</li>
                  <li>Confirmation and finality tracking</li>
                  <li>Structured error classification</li>
                  <li>Retry protection and idempotency</li>
                  <li>Real-time status webhooks</li>
                  <li>Production metrics and observability</li>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  📊 Performance Metrics
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                      99.8%
                    </Typography>
                    <Typography variant="body2">Transaction Success Rate</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                      2.3s
                    </Typography>
                    <Typography variant="body2">Average Confirmation Time</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                      99.9%
                    </Typography>
                    <Typography variant="body2">Infrastructure Uptime</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button variant="contained" size="large" sx={{ mr: 2 }}>
            View API Documentation
          </Button>
          <Button variant="outlined" size="large">
            Try Demo Environment
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default RelayPage;