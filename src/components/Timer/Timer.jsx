import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import moment from "moment";
import { calculateTimeLeft } from "@/utils";
import { toast } from "react-hot-toast";
// import { api_configs } from "@/api-services";
// import { apiRouterCall } from "@/api-services/service";

export default function Timer({ email, setOTP }) {
  const [endTime, setEndTime] = useState(null);
  const [timeStamp, setTimeStamp] = useState({ minutes: 3, seconds: 0, total: 180000 }); // 🛠 Default values
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("otpTimer");
      if (stored) {
        const parsed = JSON.parse(stored);
        const newEnd = moment()
          .add(parsed.minutes, "minutes")
          .add(parsed.seconds, "seconds")
          .unix();
        setEndTime(newEnd);
        return;
      }
    }

    // No previous timer, start new one
    setEndTime(moment().add(3, "minutes").unix());
  }, []);

  useEffect(() => {
    if (!endTime) return;

    const timer = setInterval(() => {
      const left = calculateTimeLeft(endTime * 1000);

      // 🛠 Fix: set safe values on expiration
      if (left.total <= 0) {
        clearInterval(timer);
        setTimeStamp({ minutes: 0, seconds: 0, total: 0 });

        if (typeof window !== "undefined") {
          sessionStorage.removeItem("otpTimer");
        }

        return;
      }

      setTimeStamp(left);

      if (typeof window !== "undefined") {
        sessionStorage.setItem("otpTimer", JSON.stringify(left));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const handleResendOtpSubmit = async () => {
    try {
      setIsUpdating(true);
      setOTP("");

      const bodyData = { email };

      const response = await apiRouterCall({
        method: "PATCH",
        url: api_configs.resendOTPU,
        bodyData,
      });

      if (response?.data?.responseCode === 200) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("otpTimer");
        }
        setEndTime(moment().add(3, "minutes").unix());
        toast.success(response.data.responseMessage);
      } else {
        toast.error(response.data.responseMessage);
      }

      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
      console.error(error);
      toast.error(error?.response?.data?.responseMessage || "Something went wrong");
    }
  };

  const isExpired = timeStamp?.total <= 0;

  if (!hasMounted) return null; // Prevent hydration mismatch

  const safeMinutes = String(timeStamp?.minutes ?? 0).padStart(2, "0");
  const safeSeconds = String(timeStamp?.seconds ?? 0).padStart(2, "0");

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      {!isExpired ? (
        <Typography
          variant="body1"
          fontWeight="500"
          color="primary"
          style={{ display: "flex", alignItems: "flex-start" }}
        >
          <Box>{safeMinutes}</Box>:<Box>{safeSeconds}</Box>
        </Typography>
      ) : (
        <Typography
          variant="body1"
          fontWeight="500"
          sx={{ color: "red" }}
        >
          OTP Expired
        </Typography>
      )}

      <Typography
        variant="body1"
        fontWeight="500"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          cursor: isUpdating || !isExpired ? "not-allowed" : "pointer",
          pointerEvents: isUpdating || !isExpired ? "none" : "auto",
          color: "#000000",
        }}
        onClick={handleResendOtpSubmit}
      >
        {isUpdating ? "Sending..." : "Resend OTP"}
      </Typography>
    </Box>
  );
}
