import { Box, Button, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import OTPInput from "react-otp-input";
import LoginLayout from "@/layout/LoginLayout/LoginLayout";
import Timer from "@/components/Timer/Timer";
// import { api_configs } from "@/api-services";
// import { apiRouterCall } from "@/api-services/service";
import toast from "react-hot-toast";
import ButtonCircularProgress from "@/components/ButtonCircularProgress";

const OtpComponent = styled(Box)(({ theme }) => ({
  height: "100%",
  zIndex: "999",
  display: "flex",
  minHeight: "100vh",
  backgroundColor: "#f5f5f5",
  alignItems: "center",
  justifyContent: "center",
  "& .upperBox": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: "16px",
  },
  "& .otp-mainBox": {
    maxWidth: "415px",
  },
  "& input": {
    border: "1px solid rgba(78, 35, 35, 0.1)",
    borderRadius: "10px",
    fontSize: "20px",
    height: "55px !important",
    width: "64px !important",
    marginRight: "16px",
    color: "#000 !important",
    background: "#e7e2e2",
    [theme.breakpoints.down("sm")]: {
      height: "55px !important",
      width: "55px !important",
    },
  },
  "& .otpInput:last-child": {
    marginRight: "0px !important", // remove marginRight for last input
  },
  "& .timeBox": {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    marginTop: "24px",
  },
}));

export default function ForgotOtpVerify() {
  const router = useRouter();
  const [OTP, setOTP] = useState("");
  const [email, setEmail] = useState("");
  const [screenWidth, setScreenWidth] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const emailFromQuery = window.location.search.split("?")[1];
      setEmail(emailFromQuery || "");
      setScreenWidth(window.innerWidth);
    }
  }, []);

  const verifyOTPHandler = async () => {
    setIsVerifying(true);
    try {
      const res = await apiRouterCall({
        method: "PATCH",
        url: api_configs.verifyOTP,
        bodyData: {
          email: email,
          otp: OTP,
        },
      });

      if (res.data.responseCode === 200) {
        toast.success(res.data.responseMessage);
        window.localStorage.removeItem("otpTimer");
        router.replace("/auth/reset-password?query=" + res.data.result.token);
      } else {
        toast.error(res.data.responseMessage);
        setOTP("");
      }
    } catch (error) {
      console.log(error);
      setOTP("");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <OtpComponent>
      <Box className="otp-mainBox">
        <Box className="upperBox" mb={5.4}>
          <Typography variant="h2" color="primary" className="loginText">
            OTP Verification
          </Typography>
          <Typography
            variant="body1"
            color="#000000CC"
            style={{ maxWidth: screenWidth < 425 ? "300px" : "400px" }}
          >
            A 6-digit OTP has been sent to your registered e-mail address{" "}
            <span>{email}.</span>
          </Typography>
        </Box>

        <Box className="displayCenter" mt={4}>
          <OTPInput
            value={OTP}
            onChange={setOTP}
            numInputs={4}
            autoFocus={true}
            renderInput={(props, index) => (
              <input
                {...props}
                className={`otpInput ${index === 3 ? "lastInput" : ""}`}
              />
            )}
            secure
          />
        </Box>

        <Box className="timeBox">
          <Timer email={email} setOTP={setOTP} />
        </Box>

        <Box mt={5.5} align="center">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            onClick={verifyOTPHandler}
            disabled={!OTP || OTP.length !== 4 || isVerifying}
          >
            {isVerifying ? "Verifying..." : "Submit"}
          </Button>
        </Box>
      </Box>
    </OtpComponent>
  );
}

ForgotOtpVerify.getLayout = function getLayout(page) {
  return <LoginLayout>{page}</LoginLayout>;
};
