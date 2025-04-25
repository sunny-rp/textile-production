import React, { useEffect } from "react";
import { Box } from "@mui/material";
import LoginLayout from "@/layout/LoginLayout/LoginLayout";
import CustomHead from "@/components/CustomHead";
import Login from "./auth/login";


export default function LoginPage() {


  return (
    <>
      <CustomHead
        title="Development-Entry"
        image="/images/fav_icon.svg"
        video=""
        isVideo={false}
      />

<Box>
        <Box>
          <Login />
        </Box>
      </Box>
      
    </>
  );
}

LoginPage.getLayout = function getLayout(page) {
  return <LoginLayout>{page}</LoginLayout>;
};
