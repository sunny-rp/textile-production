import React from "react";
import { CircularProgress, Box } from "@mui/material";

function ButtonCircularProgress() {
  return (
    <Box color="secondary.main" pl={1.5} display="flex">
      <CircularProgress size={24} thickness={5} />
    </Box>
  );
}

export default ButtonCircularProgress;
