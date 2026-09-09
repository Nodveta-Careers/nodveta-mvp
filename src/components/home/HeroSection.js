import Link from "next/link"
import Stack from '@mui/material/Stack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
//import logoArt from "../../assets/images/logo-blue-art1.png";
import ReactPlayer from 'react-player'
import { SITE_URL } from 'config/site';

const HeroSection = () => {
  return (
    <Container className="fadeInUp">
      <Stack 
        direction="row"
        spacing={3}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box sx={{maxWidth: "700px", py: 5, mb: 5, mx: 'auto'}}>
          <Typography 
            color="primary.main" 
            variant="h2" 
            sx={{ fontWeight: 'bold', mb: 3}} 
            component="div"
          >
            Node Meta Ecosystem
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Node Meta is a Web3 infrastructure protocol on BNB Smart Chain. Stake $NTE, earn node rewards, trade NFTs, and participate in decentralized commerce across the Node Meta ecosystem.
          </Typography>
          {/* <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            ...
          </Typography> */}
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mb: 2, fontWeight: 700 }}
          >
            Let's get more and more $NTE token.
            </Typography>
          <Stack
            direction="row"
            spacing={2}
          >
            <Button
              component={Link}
              href="/pre-sale"
              disableElevation 
              variant="contained" 
              endIcon={<ArrowForwardIcon />}>
              Get NTE
            </Button>
            <Button 
              component="a"
              href={SITE_URL}
              target="_blank" 
              rel="noopener noreferrer"
              endIcon={<ArrowDownwardIcon />}>
              NTE Whitepaper
            </Button>
          </Stack>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          {/* <img 
            src={logoArt}
            alt="Node Meta logo" 
            width="450"
          /> */}
          <ReactPlayer url='https://www.youtube.com/watch?v=VB5_R9_F8MY' />
        </Box>
      </Stack>
    </Container>
  );
}
 
export default HeroSection;
