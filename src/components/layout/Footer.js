import Typography from '@mui/material/Typography';
import TwitterIcon from '@mui/icons-material/Twitter';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import EmailIcon from '@mui/icons-material/Email';
import TelegramIcon from '@mui/icons-material/Telegram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LanguageIcon from '@mui/icons-material/Language';
import { SITE_URL, SITE_EMAIL } from 'config/site';

const socialLinks = [
  {
    label: 'Twitter',
    icon: <TwitterIcon />,
    href: 'https://twitter.com/nodemeta'
  },
  {
    label: 'Telegram',
    icon: <TelegramIcon />,
    href: 'https://t.me/nodemeta'
  },
  {
    label: 'Facebook',
    icon: <FacebookIcon />,
    href: 'https://www.facebook.com/nodemeta'
  }
]

const Footer = () => {
  return (
    <Container sx={{mt: 5}}>
      <Stack 
        direction="row" 
        spacing={2} 
        mt={2}
        alignItems="center"
        justifyContent="center"
        className="@container"
      >
        <a href={SITE_URL} target="_blank" rel="noopener noreferrer" aria-label="Node Meta website">
          <img
            src="/nodemeta-logo.png"
            alt="Node Meta logo"
            width={40}
            height={40}
            className="animate-in fade-in duration-500"
          />
        </a>
      </Stack>
      <Grid 
        container 
        spacing={2} 
        alignItems="center" 
        justifyContent="center"
        my={2}
      >
        {socialLinks.map((link) => (
          <Grid item xs={2} md={1} sx={{textAlign: 'center'}} key={link.label}>
            <IconButton 
              component="a"
              href={link.href}
              target="_blank"
              aria-label={link.label} 
            >
              {link.icon}
            </IconButton>
          </Grid>
        ))}
        <Grid item xs={2} md={1} sx={{textAlign: 'center'}}>
          <IconButton
            component="a"
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Website"
          >
            <LanguageIcon />
          </IconButton>
        </Grid>
        <Grid item xs={2} md={1} sx={{textAlign: 'center'}}>
          <IconButton 
            component="a"
            href={`mailto:${SITE_EMAIL}`}
            aria-label="Email"
          >
            <EmailIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Typography 
        variant="caption"
        display="block"
        color="text.secondary"
        sx={{mt: 3, pb: 3, textAlign: 'center'}}
      >
        {'Copyright © '} {new Date().getFullYear()}{' '}
        <a href={SITE_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          Node Meta
        </a>
        . All rights reserved.
      </Typography>
    </Container>
  );
}
 
export default Footer;
