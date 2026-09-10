import { Fragment } from 'react'
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';

export default function PublicSale() {
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
            Public Sale
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join the Nodveta public token sale. Get NTE tokens with transparent pricing and immediate availability.
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
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                color="text.primary"
                sx={{ fontWeight: 'bold', mb: 2 }}
                variant="h4"
              >
                🚀 Public Sale Live
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                The Nodveta public sale is now open to everyone. No whitelist required - 
                purchase NTE tokens directly with transparent pricing and instant delivery.
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Chip 
                  label="✅ Public Access" 
                  color="success" 
                  sx={{ mr: 1, mb: 1 }} 
                />
                <Chip 
                  label="🔓 No KYC Required" 
                  color="primary" 
                  sx={{ mr: 1, mb: 1 }} 
                />
                <Chip 
                  label="⚡ Instant Delivery" 
                  color="secondary" 
                  sx={{ mr: 1, mb: 1 }} 
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Public Sale Details
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Token Price
                  </Typography>
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    1 NTE = $0.15 USD
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Min Purchase
                  </Typography>
                  <Typography variant="h6">
                    100 NTE ($15 USD)
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Max Purchase
                  </Typography>
                  <Typography variant="h6">
                    50,000 NTE ($7,500 USD)
                  </Typography>
                </Box>
                
                <Button 
                  variant="contained" 
                  size="large" 
                  fullWidth
                  sx={{ py: 1.5, fontSize: '1.1rem' }}
                >
                  Buy NTE Tokens Now
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Payment Methods */}
      <Container sx={{ mb: 6 }}>
        <Typography 
          variant="h5" 
          sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}
        >
          💳 Accepted Payment Methods
        </Typography>
        
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                🔷 ETH
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ethereum Network
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                💰 USDT
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tether USD
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                💵 USDC
              </Typography>
              <Typography variant="body2" color="text.secondary">
                USD Coin
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                🟡 BNB
              </Typography>
              <Typography variant="body2" color="text.secondary">
                BSC Network
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Key Features */}
      <Container sx={{ mb: 6 }}>
        <Typography 
          variant="h5" 
          sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}
        >
          🌟 Public Sale Benefits
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                🔓 Open Access
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No whitelist, no restrictions. Anyone can participate in the public sale 
                with transparent and fair pricing for all participants.
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                ⚡ Instant Tokens
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Receive your NTE tokens immediately after purchase. No vesting period, 
                no waiting - trade and use your tokens right away.
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                🛡️ Secure Platform
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Built on proven blockchain infrastructure with multi-signature security 
                and audited smart contracts for safe transactions.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Important Notice */}
      <Container sx={{ mb: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Public Sale Notice:</strong> This is an open public sale with no geographic restrictions. 
            Ensure you're using a compatible wallet and have sufficient gas fees for the transaction.
          </Typography>
        </Alert>
        
        <Alert severity="warning">
          <Typography variant="body2">
            <strong>Investment Warning:</strong> Cryptocurrency investments carry risk. 
            Only invest what you can afford to lose. This is not financial advice.
          </Typography>
        </Alert>
      </Container>

      {/* Quick Navigation to Other Sales */}
      <Container sx={{ mb: 6 }}>
        <Typography 
          variant="h6" 
          sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}
        >
          🔄 Other Sale Options
        </Typography>
        
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Link href="/private-sale" passHref>
              <Button variant="outlined">
                Private Sale (Legacy)
              </Button>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/pre-sale" passHref>
              <Button variant="outlined">
                Pre-Sale Information
              </Button>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/advanced" passHref>
              <Button variant="contained">
                Explore Advanced Features
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  )
}