import { Fragment } from 'react'
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import PhaseI from '../../components/private-sale/PhaseI/Renderer';
import PreSaleSteps from 'components/private-sale/PreSaleSteps';
//import Ended from './Ended';

export default function PreSale() {

  //return <Ended />

  return (
    <Fragment>
      <Container>
        <Box sx={{mb: 4}}>
          <Typography 
            color="primary.main" 
            variant="h4" 
            sx={{ fontWeight: 'bold', mb: 1}} 
            component="div"
          >
            Private-sale
          </Typography>
          <Typography variant="body1" color="text.secondary">
            During the private-sale, you will have the option to buy $NTE. All $NTE purchased can be claimed after the end of the vesting period.
          </Typography>
        </Box>
      </Container>
      <Box 
        sx={{
          bgcolor: "neutral.main", 
          py: 7, 
          borderTop: 1, 
          borderBottom: 1, 
          borderColor: "grey.100",
          mb: 4
        }}
      >
        <Container>
          {/* <Typography 
            color="text.primary"
            sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}
            variant="h4"
          >
            I C O
          </Typography> */}
          <Typography 
            variant="body1" color="text.secondary"
            sx={{ mb: 2, textAlign: 'center', maxWidth: 600, mx: 'auto' }}
          >
            Grab your Node Meta token now and enjoy vast benefits that come along with being a part of us.
          </Typography>
          <PreSaleSteps />
          <PhaseI />
        </Container>
      </Box>

      {/* Advanced Features Quick Access */}
      <Container sx={{ my: 6 }}>
        <Typography 
          variant="h4" 
          sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}
        >
          🚀 Explore Advanced Features
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 4, textAlign: 'center', maxWidth: 800, mx: 'auto' }}
        >
          NodeMeta ecosystem offers cutting-edge Web3 functionality including AI trading bots, 
          cross-chain bridges, smart commerce, and comprehensive tokenomics dashboard.
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                  🤖 AI Trading Bot
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Automated trading strategies with 1inch integration
                </Typography>
                <Link href="/advanced?tab=trading" passHref>
                  <Button variant="outlined" size="small">
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                  🌉 Cross-Chain Bridge
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Transfer assets across multiple blockchains
                </Typography>
                <Link href="/advanced?tab=bridge" passHref>
                  <Button variant="outlined" size="small">
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                  🛒 Smart Commerce
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Decentralized marketplace with NTE payments
                </Typography>
                <Link href="/advanced?tab=commerce" passHref>
                  <Button variant="outlined" size="small">
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                  📊 Tokenomics Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Real-time transparency and analytics
                </Typography>
                <Link href="/advanced?tab=tokenomics" passHref>
                  <Button variant="outlined" size="small">
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ textAlign: 'center' }}>
          <Link href="/advanced" passHref>
            <Button variant="contained" size="large" sx={{ px: 4 }}>
              View All Advanced Features
            </Button>
          </Link>
        </Box>
      </Container>
    </Fragment>
  )
}
