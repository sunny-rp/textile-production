import {
  Box,
  Button,
  FormHelperText,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { Form, Formik } from "formik";
import * as yup from "yup";
import LoginLayout from "@/layout/LoginLayout/LoginLayout";
import { toast } from "react-hot-toast";
import moment from "moment";
import { calculateTimeLeft } from "@/utils";
import { MdOutlineMailOutline } from "react-icons/md";

const ForgotComponent = styled(Box)(({ theme }) => ({
  height: "100%",
  position: "relative",
  zIndex: "999",
  display: "flex",
  alignItems: "center",
  backgroundColor: "#f5f5f5",
  minHeight: "100vh",
  justifyContent: "center",
  overflowY: "auto",
  [theme.breakpoints.down("sm")]: {
    alignItems: "center",
  },
  "& .loginBox": {
    height: "initial",
    margin: "15px auto",
    maxWidth: "95%",
    width: "640px",
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      margin: "3px auto",
    },
    "& .mainBox": {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      boxShadow: "none",
      padding: "40px",
      [theme.breakpoints.down("xs")]: {
        padding: "20px",
      },
      "& h2": {
        textAlign: "center",
        paddingBottom: "0px",
        fontSize: "30px",
        fontWeight: "300",
        fontFamily: "'Open Sans', sans-serif",
        [`@media (max-width: 767px)`]: {
          fontSize: "28px",
        },
      },

    },
    "& .titleBox": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "12px",
    },
  },
  "& p": {
    // lineHeight: "20px",
    // fontSize: "12px",
  },
}));

export default function ForgotPassword() {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const [timer, setTimer] = useState(180);

  useEffect(() => {
    let timerInterval;

    if (timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(timerInterval);
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [timer]);

  const formInitialSchema = {
    email: "",
  };
  const formValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email.")
      .max(256, "Should not exceeds 256 characters.")
      .required("Email is required."),
  });

  const handleFormSubmit = async (values) => {   
    try {
      setisLoading(true);
      const formData = {
        email: values.email.toLowerCase(),
      };
      const response = await apiRouterCall({
        method: "PATCH",
        url: api_configs.forgotPasswordU,
        bodyData: formData,
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        router.replace(`/auth/forgot-verify?${values.email.toLowerCase()}`);
        let endTime = moment().add(3, "m").unix();
        const timeLefts = calculateTimeLeft(endTime * 1000);
        sessionStorage.setItem("otpTimer", JSON.stringify(timeLefts));
        setisLoading(false);
      } else {
        setisLoading(false);
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      setisLoading(false);
      console.error("Error:", error);
    }
  };

  return (
    <ForgotComponent>
      <Box className="loginBox">
        <Box align="center" mb={5}>
          <Typography
            variant="h2"
            color="primary"
            sx={{ 
              fontSize: {
                xs: "28px", 
                md: "50px",
              },
              fontWeight: 500,
              lineHeight: "40.32px",
              textAlign: "center",
            }}
          >
            Forgot Password ?
          </Typography>


          <Typography variant="body1" color="#000000CC" mt={2}>
            Enter your registered Email here, we will send a verification link
            to retrieve your password.
          </Typography>
        </Box>

        <Formik
          initialValues={formInitialSchema}
          initialStatus={{
            success: false,
            successMsg: "",
          }}
          validationSchema={formValidationSchema}
          onSubmit={(values) => handleFormSubmit(values)}
        >
          {({ errors, handleBlur, handleChange, touched, values }) => (
            <Form>
              <Box>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Email"
                  type="text"
                  name="email"
                  value={values.email.toLowerCase()}
                  error={Boolean(touched.email && errors.email)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  autoComplete="off"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment>
                        <MdOutlineMailOutline
                          style={{
                            color: "#00000099",
                            fontSize: "24px",
                            paddingRight: "10px",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormHelperText error>
                  {touched.email && errors.email}
                </FormHelperText>
              </Box>
              <Box mt={5.5} align="center">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Next"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>

        <Typography
          className="body1"
          color="primary"
          style={{
            cursor: "pointer",
            textDecoration: "underline",
          }}
          mt={5.5}
          align="center"
          onClick={() => router.push("/auth/login")}
        >
          Go Back To <span>Login</span>
        </Typography>
      </Box>
    </ForgotComponent>
  );
}

ForgotPassword.getLayout = function getLayout(page) {
  return <LoginLayout>{page}</LoginLayout>;
};
