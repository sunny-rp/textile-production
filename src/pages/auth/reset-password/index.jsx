import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    FormHelperText,
    Paper,
    Checkbox,
    Divider,
  } from "@mui/material";
  import React, { useContext, useEffect, useState } from "react";
  import { LuEye, LuEyeOff } from "react-icons/lu";
  import { Form, Formik } from "formik";
  import * as yup from "yup";
  import styled from "@emotion/styled";
  import { useRouter } from "next/router";
  import LoginLayout from "@/layout/LoginLayout/LoginLayout";
//   import { api_configs } from "@/api-services";
//   import { apiRouterCall } from "@/api-services/service";
  import toast from "react-hot-toast";
  import { calculateTimeLeft } from "@/utils";
  import CustomHead from "@/components/CustomHead";
  import moment from "moment";
//   import AppContext from "@/context/AppContext";
  import { GoKey } from "react-icons/go";
  import Link from "next/link";
  const SignupComponent = styled("div")(({ theme }) => ({
    height: "100%",
    position: "relative",
    zIndex: "999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    overflowY: "auto",
    [theme.breakpoints.down("sm")]: {
      alignItems: "center",
    },
    "& h6": {
      fontSize: "45px !important",
    },
    "& .Mui-checked": {
      color: "#fff",
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
      "@media(max-width: 350px)": {
        maxWidth: "90%",
      },
      "& .mainBox": {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        boxShadow: "none",
        padding: "40px",
        [theme.breakpoints.down("xs")]: {
          padding: "20px",
        },
      },
    },
  }));
  
  export default function Signup() {
    const router = useRouter();
    // const auth = useContext(AppContext);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
  
    const formInitialSchema = {
      confirmPassword: "",
      password: "",
    };
    const formValidationSchema = yup.object().shape({
      password: yup
        .string()
        .required("Password is required.")
        .max(16, "Password should not exceed 16 characters.")
        .min(8, "Password must be a minimum of 8 characters.")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Please enter a valid password."
        ),
      confirmPassword: yup
        .string()
        .required("Confirmation of your password is required.")
        .oneOf([yup.ref("password"), null], "Password must match."),
    });
  
    const handleFormSubmit = async (values) => {
      const formData = {
        confirmPassword: values.confirmPassword,
        password: values.password,
      };
      try {
        setisLoading(true);
        const response = await apiRouterCall({
          method: "PATCH",
          url: api_configs.resetPasswordU,
          bodyData: formData,
          token: router.query.query,
        });
        if (response.data.responseCode === 200) {
          toast.success(response.data.responseMessage);
          router.replace("/auth/login");
        } else {
          toast.error(response.data.responseMessage);
        }
      } catch (error) {
        setisLoading(false);
        console.error("Error:", error);
      } finally {
        setisLoading(false);
      }
    };
  
    return (
      <SignupComponent>
        {/* <CustomHead
          title="Login | Trade11"
          image="/images/FbSizeImage.png"
          video="" 
          isVideo={false}
        /> */}
        <Box className="loginBox">
          <Box align="center" mb={5.4}>
            <Typography variant="h2" color="primary" className="loginText"
            sx={{ 
                fontSize: {
                  xs: "28px", 
                  md: "50px",
                }}}>
              Reset Password
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
                    placeholder="New Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={values.password}
                    error={Boolean(touched.password && errors.password)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            sx={{
                              background: "transparent",
                              marginLeft: "0px",
                              padding: "1px",
                              pointerEvents: "none",
                            }}
                            edge="start"
                          >
                            <GoKey style={{ color: "#00000099" }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            sx={{
                              background: "transparent",
                              marginRight: "0px",
                              padding: "1px",
                            }}
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? (
                              <LuEye style={{ color: "#585757" }} />
                            ) : (
                              <LuEyeOff style={{ color: "#585757" }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                      inputProps: {
                        style: { paddingLeft: "0px" },
                      },
                    }}
                  />
                  <FormHelperText error>
                    {touched.password && errors.password}
                  </FormHelperText>
                </Box>
                <Box mt={4}>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Confirm Password"
                    type={showPassword1 ? "text" : "password"}
                    name="confirmPassword"
                    value={values.confirmPassword}
                    error={Boolean(
                      touched.confirmPassword && errors.confirmPassword
                    )}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            sx={{
                              background: "transparent",
                              marginLeft: "0px",
                              padding: "1px",
                              pointerEvents: "none",
                            }}
                            edge="start"
                          >
                            <GoKey style={{ color: "#00000099" }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            sx={{
                              background: "transparent",
                              marginRight: "0px",
                              padding: "1px",
                            }}
                            onClick={() => setShowPassword1(!showPassword1)}
                            edge="end"
                          >
                            {showPassword1 ? (
                              <LuEye style={{ color: "#585757" }} />
                            ) : (
                              <LuEyeOff style={{ color: "#585757" }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                      inputProps: {
                        style: { paddingLeft: "0px" },
                      },
                    }}
                  />
                  <FormHelperText error>
                    {touched.confirmPassword && errors.confirmPassword}
                  </FormHelperText>
                </Box>
                <Box
                  className="agreeBox displaySpacebetween"
                  mt={5.4}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      ml: -1,
                      display: "flex",
                      alignItems: "start",
                      justifyContent: "flex-start",
                    }}
                    onClick={() => !isLoading && setIsAccepted(!isAccepted)}
                  >
                    <Checkbox checked={isAccepted} />
                    <Typography
                      variant="body1"
                      color="primary"
                      sx={{
                        ml: {
                          xs: 0.5,
                          sm: 1,
                          color: "#000",
                          "& a": {
                            textDecorationColor: "none",
                            textDecoration: "none",
                            color: "#000",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          },
                        },
                      }}
                    >
                      I accept the{" "}
                      <Link
                        href="/static/term-condition"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          textDecoration: "none",
                          color: "#000",
                          textDecorationColor: "none",
                        }}
                      >
                        Terms & Conditions
                      </Link>
                      {" & "}
                      <Link
                        href="/static/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          textDecoration: "none",
                          color: "text.primary",
                          textDecorationColor: "none",
                        }}
                      >
                        Privacy Policy
                      </Link>
                    </Typography>
                  </Box>
                </Box>
  
                <Box className="displayCenter" mt={5.4}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    disabled={isLoading || !isAccepted}
                  >
                    {isLoading ? "Loading..." : "Reset Password"}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </SignupComponent>
    );
  }
  
  Signup.getLayout = function getLayout(page) {
    return <LoginLayout>{page}</LoginLayout>;
  };
  