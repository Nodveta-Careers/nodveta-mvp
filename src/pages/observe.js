import Head from "next/head";
import React from 'react';
import { Container, Typography, Box, Card, CardContent, Alert, Button, Grid } from '@mui/material';

const ObservePage = () => {
  return (
    <>
      <Head>
        <title>Nodveta Observe - Network Observability</title>
        <meta name="description" content="Monitor transaction performance, RPC health, and application behavior in production." />
      </Head>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
            👁️ Nodveta Observe
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Production observability for blockchain applications and infrastructure
          </Typography>
        </Box>

        <Alert severity="warning" sx={{ mb: 4 }}>
          <strong>Observability Platform:</strong> Monitor transaction success rates, RPC provider health, 
          protocol activity, and application behavior with comprehensive metrics and alerting.
        </Alert>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  📈 Performance Monitoring
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <li>Transaction success rate tracking</li>
                  <li>Confirmation time analysis</li>
                  <li>Gas price trends and optimization</li>
                  <li>RPC provider performance metrics</li>
                  <li>API latency and throughput</li>
                  <li>Error rate classification</li>
                  <li>Custom business metrics</li>
                  <li>Historical trend analysis</li>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  🚨 Alerting & Incidents
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <li>Real-time threshold alerts</li>
                  <li>Anomaly detection</li>
                  <li>RPC provider failure notifications</li>
                  <li>Transaction failure spikes</li>
                  <li>Smart contract event monitoring</li>
                  <li>Infrastructure health checks</li>
                  <li>Custom alert conditions</li>
                  <li>Incident response workflows</li>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  🔍 Deep Insights
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <li>Transaction trace analysis</li>
                  <li>Protocol interaction mapping</li>
                  <li>User behavior patterns</li>
                  <li>Network congestion correlation</li>
                  <li>Fee optimization recommendations</li>
                  <li>Performance bottleneck identification</li>
                  <li>Capacity planning data</li>
                  <li>Security event detection</li>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  📊 Dashboard Features
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <li>Real-time operational dashboards</li>
                  <li>Custom metric visualizations</li>
                  <li>Multi-network comparisons</li>
                  <li>Team collaboration tools</li>
                  <li>Report generation and export</li>
                  <li>Mobile-responsive design</li>
                  <li>Role-based access control</li>
                  <li>API for custom integrations</li>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button variant="contained" size="large" sx={{ mr: 2 }}>
            View Live Dashboard
          </Button>
          <Button variant="outlined" size="large">
            Setup Monitoring
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default ObservePage;