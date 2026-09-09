import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  buildCommercePayload,
  submitCommerceOrder,
} from "services/assessment/commerceService";

const CommercePanel = () => {
  const { account } = useWeb3React();
  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async () => {
    // ASSESSMENT_TASK_4: Validate inputs and submit order via commerceService
    setStatus({ type: "info", message: "ASSESSMENT_TASK_4: Not implemented" });
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={6}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 10,
            p: 1,
            boxShadow: "0 2px 16px rgb(53 69 89 / 5%)",
          }}
        >
          <CardContent>
            <Typography
              color="text.primary"
              sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}
              variant="h5"
            >
              SmartCommerce
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, textAlign: "center" }}
            >
              Purchase digital and physical goods using your connected BSC wallet.
            </Typography>
            <TextField
              fullWidth
              label="Product ID"
              variant="standard"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Price (BNB)"
              variant="standard"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              sx={{ mb: 2 }}
            />
            {status && (
              <div
                className={`nm-alert mb-4 ${
                  status.type === "error"
                    ? "nm-alert-error"
                    : status.type === "success"
                    ? "nm-alert-success"
                    : "nm-alert-info"
                }`}
              >
                {status.message}
              </div>
            )}
          </CardContent>
          <CardActions className="px-4 pb-4">
            <button
              type="button"
              className="nm-btn-primary w-full"
              disabled={!account}
              onClick={handleSubmit}
            >
              {account ? "Submit Order" : "Connect Wallet to Order"}
            </button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CommercePanel;
