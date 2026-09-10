import Head from "next/head";
import React from 'react';
import { Container, Typography, Box, Card, CardContent, Alert, Button, Grid, Chip } from '@mui/material';

const DeveloperPage = () => {
  const sdkFeatures = [
    'TypeScript/JavaScript SDK',
    'Rust Libraries', 
    'REST APIs',
    'WebSocket Streams',
    'GraphQL Endpoints',
    'Webhook Management'
  ];

  return (
    <>
      <Head>
        <title>Nodveta Developer - Infrastructure SDKs & APIs</title>
        <meta name="description" content="SDKs, APIs, and tools that simplify blockchain integration for engineering teams." />
      </Head>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
            🛠️ Nodveta Developer
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Developer infrastructure that makes blockchain integration simple
          </Typography>
        </Box>

        <Alert severity="success" sx={{ mb: 4 }}>
          <strong>Developer-First Design:</strong> Clean APIs, comprehensive documentation, 
          and SDKs designed to make complex blockchain infrastructure simple to integrate.
        </Alert>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                  📚 SDK & API Features
                </Typography>
                <Grid container spacing={2}>
                  {sdkFeatures.map((feature, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Chip 
                        label={feature} 
                        variant="outlined" 
                        sx={{ width: '100%', justifyContent: 'flex-start' }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  📖 Documentation
                </Typography>
                <Box component="ul" sx={{ pl: 2, listStyle: 'none' }}>
                  <Box component="li" sx={{ mb: 1 }}>📋 API Reference</Box>
                  <Box component="li" sx={{ mb: 1 }}>🚀 Quick Start Guides</Box>
                  <Box component="li" sx={{ mb: 1 }}>💡 Integration Examples</Box>
                  <Box component="li" sx={{ mb: 1 }}>🔧 Troubleshooting</Box>
                  <Box component="li" sx={{ mb: 1 }}>📦 Sample Applications</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Code Example */}
        <Card sx={{ mb: 6 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              💻 Simple Integration Example
            </Typography>
            <Box sx={{ 
              bgcolor: '#1e293b', 
              color: '#e2e8f0', 
              p: 3, 
              borderRadius: 2, 
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}>
              <Box sx={{ color: '#94a3b8', mb: 1 }}>// Initialize Nodveta SDK</Box>
              <Box>const nodveta = new NodvetaSDK(&#123;</Box>
              <Box sx={{ pl: 2 }}>apiKey: 'your-api-key',</Box>
              <Box sx={{ pl: 2 }}>network: 'mainnet'</Box>
              <Box>&#125;);</Box>
              <br />
              <Box sx={{ color: '#94a3b8', mb: 1 }}>// Submit transaction with automatic retry and monitoring</Box>
              <Box>const result = await nodveta.relay.submit(&#123;</Box>
              <Box sx={{ pl: 2 }}>transaction: signedTransaction,</Box>
              <Box sx={{ pl: 2 }}>options: &#123; </Box>
              <Box sx={{ pl: 4 }}>confirmationLevel: 'finalized',</Box>
              <Box sx={{ pl: 4 }}>maxRetries: 3,</Box>
              <Box sx={{ pl: 4 }}>webhookUrl: 'https://your-app.com/webhook'</Box>
              <Box sx={{ pl: 2 }}>&#125;</Box>
              <Box>&#125;);</Box>
              <br />
              <Box sx={{ color: '#94a3b8', mb: 1 }}>// Stream real-time blockchain data</Box>
              <Box>nodveta.stream.subscribe('account_changes', &#123;</Box>
              <Box sx={{ pl: 2 }}>accounts: ['your-account-address'],</Box>
              <Box sx={{ pl: 2 }}>callback: (data) =&gt; console.log(data)</Box>
              <Box>&#125;);</Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center' }}>
          <Button variant="contained" size="large" sx={{ mr: 2 }}>
            Get API Keys
          </Button>
          <Button variant="outlined" size="large" sx={{ mr: 2 }}>
            View Documentation
          </Button>
          <Button variant="outlined" size="large">
            Download SDK
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default DeveloperPage;