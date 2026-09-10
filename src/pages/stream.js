import Head from "next/head";
import React from 'react';
import { Container, Typography, Box, Card, CardContent, Alert, Button, Grid } from '@mui/material';

const StreamPage = () => {
  return (
    <>
      <Head>
        <title>Nodveta Stream - Blockchain Data Services</title>
        <meta name="description" content="Real-time blockchain data, event processing, and indexing for production applications." />
      </Head>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
            📊 Nodveta Stream
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Real-time blockchain data and event-delivery platform
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 4 }}>
          <strong>Data Infrastructure:</strong> Nodveta Stream transforms raw blockchain activity into 
          accurate and usable information for applications with real-time processing and data integrity validation.
        </Alert>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  🔄 Real-time Capabilities
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <li>Live transaction streaming</li>
                  <li>Account and wallet monitoring</li>
                  <li>Smart contract event processing</li>
                  <li>Program log decoding (Solana)</li>
                  <li>EVM log decoding</li>
                  <li>Reorganization-aware processing</li>
                  <li>Filtered webhook delivery</li>
                  <li>Historical data access</li>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  🛡️ Data Integrity
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <li>Data reconciliation and validation</li>
                  <li>Duplicate event detection</li>
                  <li>Missing data recovery</li>
                  <li>Chain reorganization handling</li>
                  <li>State consistency checks</li>
                  <li>Delivery guarantees</li>
                  <li>Audit trails and logging</li>
                  <li>Quality metrics and monitoring</li>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button variant="contained" size="large" sx={{ mr: 2 }}>
            Explore Stream API
          </Button>
          <Button variant="outlined" size="large">
            View Data Examples
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default StreamPage;