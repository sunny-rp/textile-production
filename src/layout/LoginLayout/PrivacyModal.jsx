import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Button,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function PrivacyModal({
  open,
  handleClose,
  onAccept,
  onDecline,
  params,
}) {
  const handleAccept = () => {
    handleClose();
    onAccept();
  };

  const handleDecline = () => {
    handleClose();
    onDecline();
  };
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      style={{}}
      aria-labelledby="customized-dialog-title"
      keepMounted
      {...params}
    >
      <DialogTitle
        className="chatdialogBox"
        style={{
          padding: "0px",
        }}
      >
        <Box className="displaySpacebetween">
          <Typography variant="h5" style={{ color: "#000" }}>
            We value your privacy
          </Typography>
          <IconButton onClick={handleDecline} size="large">
            <CloseIcon style={{ color: "#000" }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent className="">
        <Box mt={2} mb={3}>
          <Typography variant="body2" style={{ color: "#000" }}>
            Thank you for choosing to join our community! Before you get
            started, we want to ensure that you are aware of and agree to the
            terms and conditions that govern your use of our platform. Your
            privacy and security are important to us, and we are committed to
            being transparent about how your information will be used.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        <Button
          variant="outlined"
          color="primary"
          style={{ whiteSpace: "pre" }}
          onClick={handleDecline}
        >
          Decline All
        </Button>
        &nbsp; &nbsp;
        <Button
          variant="contained"
          color="primary"
          style={{ whiteSpace: "pre" }}
          onClick={handleAccept}
        >
          Accept All
        </Button>
      </DialogActions>
    </Dialog>
  );
}
