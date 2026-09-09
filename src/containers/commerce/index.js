import { Fragment } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CommercePanel from "components/commerce/CommercePanel";
import WalletStatusBar from "components/ui/WalletStatusBar";

export default function Commerce() {
  return (
    <Fragment>
      <Container>
        <Box sx={{ mb: 4 }}>
          <Typography
            color="primary.main"
            variant="h4"
            sx={{ fontWeight: "bold", mb: 1 }}
            component="div"
          >
            SmartCommerce
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Node Meta decentralized commerce — purchase goods using your connected
            BSC wallet.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <WalletStatusBar />
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
          mb: 4,
        }}
      >
        <Container className="fadeInUp">
          <CommercePanel />
        </Container>
      </Box>
    </Fragment>
  );
}
