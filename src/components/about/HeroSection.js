import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const HeroSection = () => {
  return (
    <Container className="fadeInUp">
      <Box sx={{maxWidth: "800px", py: 5, my: 5, mx: 'auto'}}>
        <Typography 
          variant="h5"
          color="primary.main" 
          sx={{ mb: 1, fontWeight: 'bold', textAlign: 'center' }}
        >
          About us
        </Typography>
        <Typography 
          color="text.primary" 
          variant="h4"
          sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }} 
          component="div"
        >
          Node Meta — Web3 Infrastructure on BSC
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
          Node Meta is building a decentralized ecosystem with node rewards, staking, NFT marketplace, and SmartCommerce powered by the $NTE token on BNB Smart Chain.
        </Typography>
      </Box>
    </Container>
  );
}
 
export default HeroSection;
