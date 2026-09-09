import { Fragment } from 'react'
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TokenPools from '../../components/stake/TokenPools';
import StakeSteps from '../../components/stake/StakeSteps';
import HowToStake from '../../components/stake/HowToStake';
import WalletStatusBar from 'components/ui/WalletStatusBar';
import StatBar from 'components/ui/StatBar';
import RPCStatus from 'components/ui/RPCStatus';

export default function Stake() {
  return (
    <Fragment>
      <Container>
        <Box sx={{mb: 4}}>
          <Typography 
            color="text.primary" 
            variant="h4" 
            sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main'}} 
            component="div"
          >
            Staking
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Stake $NTE to earn more $NTE. You can stake $NTE tokens in the staking pools to earn high APR as a return for holding $NTE tokens.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <WalletStatusBar />
            <RPCStatus chainId={56} />
          </Box>
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
        <Container className="fadeInUp">
          <StatBar
            items={[
              { label: "APR", value: "0.000%" },
              { label: "Pool Status", value: "Active", highlight: true },
              { label: "Network", value: "BSC" },
            ]}
          />
          <Typography
            variant="h5" 
            component="div" 
            color="text.primary"
            sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}
          >
            Stake $NTE tokens to earn rewards
          </Typography>
          <Typography 
            variant="body1" color="text.secondary" 
            sx={{ mb: 2, textAlign: 'center', maxWidth: 600, mx: 'auto' }}
          >
            Please be aware <strong>estimated APRs will likely drop over time as more people join the pool</strong>. First you must approve you&apos;ve $ for use on the staking contract, then enter an amount and press stake.
          </Typography>
          <StakeSteps />
          <HowToStake />
          <TokenPools />
        </Container>
      </Box>
    </Fragment>
  )
}
