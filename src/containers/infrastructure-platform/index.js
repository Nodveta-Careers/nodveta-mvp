/**
 * Nodveta Infrastructure Platform - Main Landing
 * Showcasing reliable blockchain infrastructure capabilities
 */

import React, { Fragment } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import Link from 'next/link';

// Styled components for modern infrastructure feel
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
  color: 'white',
  padding: theme.spacing(12, 0),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 75% 75%, rgba(147, 197, 253, 0.1) 0%, transparent 50%)`,
  },
}));

const InfrastructureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease-in-out',
  border: '1px solid rgba(59, 130, 246, 0.1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 32px rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
}));

const MetricBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  textAlign: 'center',
  border: '1px solid #e2e8f0',
}));

const StatusBadge = styled(Chip)(({ theme, status }) => ({
  fontWeight: 'bold',
  ...(status === 'operational' && {
    backgroundColor: '#dcfce7',
    color: '#166534',
  }),
  ...(status === 'monitoring' && {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  }),
}));

export default function InfrastructurePlatform() {
  const infrastructureServices = [
    {
      title: 'Transaction Infrastructure',
      description: 'Reliable transaction submission, simulation, and confirmation tracking across blockchain networks.',
      icon: '⚡',
      features: ['Multi-RPC routing', 'Failover protection', 'Gas optimization', 'Confirmation tracking'],
      status: 'operational',
      link: '/relay'
    },
    {
      title: 'Blockchain Data Services',
      description: 'Real-time blockchain data, event processing, and indexing for production applications.',
      icon: '📊',
      features: ['Real-time streams', 'Event decoding', 'Historical data', 'Data integrity'],
      status: 'operational',
      link: '/stream'
    },
    {
      title: 'Developer Infrastructure', 
      description: 'SDKs, APIs, and tools that simplify blockchain integration for engineering teams.',
      icon: '🛠️',
      features: ['TypeScript SDKs', 'REST APIs', 'WebSocket streams', 'Developer dashboard'],
      status: 'operational',
      link: '/developer'
    },
    {
      title: 'Network Observability',
      description: 'Monitor transaction performance, RPC health, and application behavior in production.',
      icon: '👁️',
      features: ['Performance metrics', 'Health monitoring', 'Alert systems', 'Incident tracking'],
      status: 'monitoring',
      link: '/observe'
    }
  ];

  const supportedNetworks = [
    { name: 'Solana', status: 'Production Ready', color: '#9945FF' },
    { name: 'Ethereum', status: 'Production Ready', color: '#627EEA' },
    { name: 'BSC', status: 'Production Ready', color: '#F3BA2F' },
    { name: 'Polygon', status: 'In Development', color: '#8247E5' },
  ];

  const platformMetrics = [
    { label: 'Transaction Success Rate', value: '99.8%', description: 'Across all networks' },
    { label: 'Average Confirmation Time', value: '2.3s', description: 'Solana mainnet' },
    { label: 'RPC Uptime', value: '99.9%', description: 'Multi-provider routing' },
    { label: 'API Response Time', value: '<100ms', description: 'P95 latency' },
  ];

  return (
    <Fragment>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <img 
              src="/nodveta-logo.png" 
              alt="Nodveta Technologies"
              style={{ width: '120px', height: '120px', marginBottom: '24px' }}
            />
            <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Dependable Infrastructure for Onchain Applications
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, maxWidth: '800px', mx: 'auto' }}>
              Nodveta connects applications with blockchain networks through reliable transaction execution, 
              real-time data, and developer tools built for production.
            </Typography>
            <Typography variant="h6" sx={{ mb: 6, fontStyle: 'italic', opacity: 0.8 }}>
              "Connecting applications to blockchain with confidence."
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                size="large" 
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.main', 
                  '&:hover': { bgcolor: '#f8fafc' },
                  px: 4, 
                  py: 1.5 
                }}
              >
                Explore Our Technology
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                sx={{ 
                  borderColor: 'white', 
                  color: 'white',
                  '&:hover': { borderColor: '#f8fafc', bgcolor: 'rgba(255,255,255,0.1)' },
                  px: 4, 
                  py: 1.5 
                }}
              >
                View Documentation
              </Button>
            </Box>
          </Box>
        </Container>
      </HeroSection>

      {/* Platform Metrics */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
          Production-Grade Performance
        </Typography>
        
        <Grid container spacing={4}>
          {platformMetrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MetricBox>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                  {metric.value}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 1 }}>
                  {metric.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.description}
                </Typography>
              </MetricBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Infrastructure Services */}
      <Box sx={{ bgcolor: '#f8fafc', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold' }}>
            Core Infrastructure Services
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 6, color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
            Production-ready blockchain infrastructure components designed for reliability, 
            security, and ease of integration.
          </Typography>
          
          <Grid container spacing={4}>
            {infrastructureServices.map((service, index) => (
              <Grid item xs={12} md={6} key={index}>
                <InfrastructureCard>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h3" component="span" sx={{ mr: 2 }}>
                        {service.icon}
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {service.title}
                        </Typography>
                        <StatusBadge 
                          size="small" 
                          label={service.status === 'operational' ? 'Operational' : 'Monitoring'}
                          status={service.status}
                        />
                      </Box>
                    </Box>
                    
                    <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                      {service.description}
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Key Features:
                      </Typography>
                      {service.features.map((feature, idx) => (
                        <Chip 
                          key={idx}
                          label={feature}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                    
                    <Link href={service.link} passHref>
                      <Button variant="contained" fullWidth>
                        Explore Service →
                      </Button>
                    </Link>
                  </CardContent>
                </InfrastructureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Supported Networks */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold' }}>
          Supported Blockchain Networks
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 6, color: 'text.secondary' }}>
          Multi-network support with consistent APIs and unified infrastructure management.
        </Typography>
        
        <Grid container spacing={3} justifyContent="center">
          {supportedNetworks.map((network, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {network.name}
                </Typography>
                <Chip 
                  label={network.status}
                  size="small"
                  sx={{ 
                    bgcolor: network.status === 'Production Ready' ? '#dcfce7' : '#fef3c7',
                    color: network.status === 'Production Ready' ? '#166534' : '#92400e',
                  }}
                />
                <Box 
                  sx={{ 
                    width: '40px', 
                    height: '4px', 
                    bgcolor: network.color, 
                    mx: 'auto', 
                    mt: 2, 
                    borderRadius: '2px' 
                  }} 
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Company Mission */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
            Our Mission
          </Typography>
          <Typography variant="h6" sx={{ textAlign: 'center', mb: 4, lineHeight: 1.6 }}>
            "Nodveta exists to make blockchain infrastructure dependable for real applications, users, and businesses."
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', opacity: 0.9, lineHeight: 1.8 }}>
            We build reliable transaction, data, and developer infrastructure that connects production 
            applications with blockchain networks. Our goal is simple: make blockchain infrastructure 
            trustworthy enough for products that people and businesses depend on.
          </Typography>
        </Container>
      </Box>

      {/* Developer Focus */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
              Built for Engineering Teams
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: 'text.secondary' }}>
              Nodveta helps engineering teams move from experimental blockchain code to secure, 
              scalable, and dependable production systems. We focus on the infrastructure between 
              application code and blockchain execution.
            </Typography>
            
            <Box component="ul" sx={{ pl: 0, listStyle: 'none' }}>
              {[
                'Reliable transaction submission and confirmation',
                'Real-time blockchain data with integrity validation',
                'Observable production systems with comprehensive monitoring',
                'Developer-friendly APIs and SDKs',
                'Clear documentation and integration guides'
              ].map((item, index) => (
                <Box component="li" key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    width: '8px', 
                    height: '8px', 
                    bgcolor: 'primary.main', 
                    borderRadius: '50%', 
                    mr: 2 
                  }} />
                  <Typography variant="body1">{item}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              bgcolor: '#f8fafc', 
              p: 4, 
              borderRadius: 3,
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                💡 Why Choose Nodveta Infrastructure?
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Focus on building your application while we handle the blockchain complexity:
              </Typography>
              <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                <Box sx={{ color: '#059669', mb: 1 }}>// Simple transaction execution</Box>
                <Box sx={{ color: '#1f2937' }}>const result = await nodveta.transactions.submit(&#123;</Box>
                <Box sx={{ color: '#1f2937', pl: 2 }}>transaction: signedTx,</Box>
                <Box sx={{ color: '#1f2937', pl: 2 }}>options: &#123; confirmationLevel: 'finalized' &#125;</Box>
                <Box sx={{ color: '#1f2937' }}>&#125;);</Box>
                <Box sx={{ color: '#059669', mt: 2 }}>// Automatic retry, monitoring & alerts included</Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
}