import { Fragment, useState } from 'react';
import Link from "next/link";
import { SITE_URL } from "config/site";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Account from "../../account/";
import Networks from "../../Chains/Networks";
import Navbar from './Navbar';
import Contracts from '../../shared/Contracts';
import QuickRPCFix from '../../ui/QuickRPCFix';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SideDrawer from './SideDrawer';

// const mainLinks = [
//   { label: "Home", href: "/" },
//   { label: "Gallery", href: "/gallery" },
// ]

const mainLinks = [
  { label: "Infrastructure", href: "/infrastructure" },
  { label: "Relay", href: "/relay" },
  { label: "Stream", href: "/stream" },
  { label: "Developer", href: "/developer" },
  { label: "Observe", href: "/observe" },
]

const legacyLink = { 
  label: "Legacy Demo", 
  href: "/private-sale" 
}

// const bridgeLink = {
//   label: "Bridge",
//   href: "https://bridge.poly.network/token/"
// }

const comingSoonLink = [];


const moreMenuLinks = [
  { label: "Transactions", href: "/transactions" },
  { label: "RPC Test", href: "/rpc-test" },
  { label: "Documentation", href: "/docs" },
  { label: "About", href: "/about" },
] 

const MainNavigation = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [contractsDialogOpen, setContractsDialogOpen] = useState(false);

  const handleContractsDialogToggle = () => {
    setContractsDialogOpen(!contractsDialogOpen);
  };

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <Fragment>
      <AppBar
        position="fixed"
        color="inherit"
        enableColorOnDark
        elevation={0}
        sx={{bgcolor: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)'}}
      >
        <Toolbar 
          sx={{borderBottom: 1, borderColor: "grey.100"}}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{marginRight: "auto"}}>
            <Link href="/" style={{marginRight: "auto"}} className="inline-flex items-center" title={SITE_URL}>
              <img 
                src="/nodveta-logo.png" 
                alt="Node Meta logo" 
                width="50"
                height="50"
                className="animate-in fade-in duration-300"
              />
            </Link>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Navbar 
              mainLinks={mainLinks}
              moreMenuLinks={moreMenuLinks}
              comingSoonLink={comingSoonLink}
              // bridgeLink={bridgeLink}
              presaleLink={presaleLink}
              privateLink={privateLink}
              handleClickContracts={handleContractsDialogToggle} />
          </Box>
          <Box sx={{marginLeft: "auto"}}>
            <Networks />
          </Box>
          <Box sx={{ml: 1}}>
            <QuickRPCFix />
          </Box>
          <Box sx={{ml: 1}}>
            <Account />
          </Box>
        </Toolbar>
      </AppBar>
      <SideDrawer
        mainLinks={mainLinks}
        presaleLink={presaleLink}
        privateLink={privateLink}
        moreMenuLinks={moreMenuLinks}
        comingSoonLink={comingSoonLink}
        onClose={handleDrawerToggle}
        open={mobileDrawerOpen}
        handleClickContracts={handleContractsDialogToggle} 
      />
      <Contracts 
        open={contractsDialogOpen} 
        handleClose={handleContractsDialogToggle} 
      />
    </Fragment>
  );
}

export default MainNavigation;