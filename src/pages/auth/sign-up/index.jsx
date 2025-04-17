"use client";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  FormHelperText,
  Checkbox,
  Grid,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useFormik } from "formik";
import * as yup from "yup";
import styled from "@emotion/styled";
import { useRouter } from "next/router"; // Update this if using Next.js 13+
// import PrivacyModal from "@/layout/LoginLayout/PrivacyModal";

import { toast } from "react-hot-toast";
import moment from "moment";
import { calculateTimeLeft } from "@/utils";
import Link from "next/link";
import { SecurePassword } from "@/components/PasswordStrengthIndicator";
import { FiUser } from "react-icons/fi";
import { MdOutlineMail } from "react-icons/md";
import { LiaKeySolid } from "react-icons/lia";
import Cookies from "js-cookie";
import { BiWorld } from "react-icons/bi";
import Image from "next/image";
import axios from "axios";
import Logo from "@/components/Logo";
import { apiRouterCall } from "@/api-services/service";
import { VscReferences } from "react-icons/vsc";
import ButtonCircularProgress from "@/components/ButtonCircularProgress";
import { decrypt, encrypt } from "@/utils";
const StyledContainer = styled(Grid)({
  height: "100vh",
  display: "flex",
});
const RightSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  backgroundColor: "#fff",
});

const LeftSection = styled(Box)({
  background: "#2752E7",
  color: "#fff",
  textAlign: "center",
  padding: "0 50px 0 50px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});
const SignupComponent = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  "& .MuiOutlinedInput-input": {
    padding: "10px !important",
  },
}));

export default function Signup() {
  const router = useRouter();
  const [isRemember, setIsRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [countries, setCountries] = useState([]);
  const AcceptTerm_Condition = Cookies.get("AcceptTerm_Condition");
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(
    AcceptTerm_Condition == "ACCEPT" ? false : true
  );
  useEffect(() => {
    axios.get("/json/countries.json").then(function (response) {
      setCountries(response.data.countries);
    });
  }, []);
  const handleAcceptPrivacyPolicy = () => {
    // setisAccepted("ACCEPT");
    Cookies.set("AcceptTerm_Condition", "ACCEPT", { expires: 30 });
  };
  const handleDeclinePrivacyPolicy = () => {
    // setisAccepted("DECLINE");
    Cookies.set("AcceptTerm_Condition", "DECLINE", { expires: 1 });
    Cookies.remove("AcceptTerm_Condition", "DECLINE", { expires: 1 });
  };


  const formValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email.")
      .max(56, "Email should not exceed 56 characters.")
      .required("Email is required."),

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
      .required("Confirm password is required.")
      .oneOf([yup.ref("password"), null], "Confirm password Doesn't match."),

    lastName: yup
      .string("Please enter valid last name.")
      .required("Last name is required.")
      .matches(
        /^[a-zA-Z\s,-.']+$/,
        "Only alphabets and white spaces are allowed for this field."
      )
      .min(3, "Please enter atleast 3 characters.")
      .max(60, "You can enter only 60 characters."),
    firstName: yup
      .string("Please enter valid first name.")
      .required("First name is required.")
      .matches(
        /^[a-zA-Z\s,-.']+$/,
        "Only alphabets and white spaces are allowed for this field."
      )
      .min(3, "Please enter atleast 3 characters.")
      .max(60, "You can enter only 60 characters."),

    country: yup.string().required("Country is required."),
    referralCode: yup
      .string()
      .matches(
       /^[a-zA-Z0-9]{6,12}$/,
        "Referral code must be between 6 to 12 alphanumeric characters."
      )
      .optional(),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      confirmPassword: "",
      password: "",
      country: "",
      referralCode: location?.search.split("?")[1]
      ? decrypt(location?.search.split("?")[1])?.referredBy
      : "",
    },
    validationSchema: formValidationSchema,
    onSubmit: async (values) => {
      console.log("Form submitted:", values);
      try {
        window.localStorage.setItem("user_email", values.email);
        setIsLoading(true);
        const bodyData = {
          email: values.email.toLowerCase(),
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          country: values.country,
          referralByCode: values.referralCode || undefined,
        };
        const response = await apiRouterCall({
          method: "POST",
          url: api_configs.userSignup,
          bodyData: bodyData,
        });
        if (response.data.responseCode === 200) {
          toast.success(response.data.responseMessage);
          let endTime = moment().add(3, "m").unix();
          if (endTime) {
            const timeLefts = calculateTimeLeft(endTime * 1000);
            sessionStorage.setItem("otpTimer", JSON.stringify(timeLefts));
          }
          sessionStorage.setItem("previousRoute", router.asPath);
          router.replace(`/auth/verify-otp?${values.email.toLowerCase()}`);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          toast.error(response.data.responseMessage);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    },
  });

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
        width: 250,
        color: "#fff",
      },
    },
    MenuListProps: {
      sx: {
        "& .MuiMenuItem-root": {
          backgroundColor: "#2752E7 !important", 
          color: "#fff", 
          "&:hover": {
            backgroundColor: "#1e3ea7 !important",
          },
        },
      },
    },
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
    getContentAnchorEl: null,
  };
  
  return (
    <SignupComponent>
      <StyledContainer container>
        <Grid item xs={12} md={12} lg={5} className="sigunpBoxres">
          <LeftSection>
            <Link href="/">
              <Box className="mvpLogo">
                <img
                  src="/images/logo_footer_final.png"
                  className="footerlogo"
                />
              </Box>
            </Link>
            <Typography
              variant="body1"
              color="#fff"
              mt={3}
              style={{ lineHeight: "34px",fontSize:"30px" }}
            >
              Your all-in-one solution for crypto <br />
              <span>trading and exchange</span>
            </Typography>
            <Typography
              variant="body1"
              color="#fff"
              mt={3}
              style={{ lineHeight: "34px",fontSize:"30px" }}
            >
              Quick, Secure & Reliable
            </Typography>
            <Box mt={4}>
              <Image
                width="471"
                height="447"
                src="/images/bgLogin.png"
                style={{ mixBlendMode: "lighten", width: "auto" }}
                layout="responsive"
                className="loginlayoutimg"
              />
            </Box>
          </LeftSection>
        </Grid>
        <Grid item xs={12} md={12} lg={7}>
          <RightSection>
            <Box
              width="90%"
              maxWidth="400px"
              mt={3}
              mb={3}
              sx={{ "& svg": { color: "#585757", fontSize: "25px" } }}
            >
              <Link href="/">
                <Box
                  className="mvpLogo mvpLogo1"
                  align="center"
                  onClick={() => router.push("/")}
                >
                  <Logo />
                </Box>
              </Link>
              <Box align="center" mb={5.4}>
                <Typography variant="h2" color="primary" className="loginText">
                  Sign Up
                </Typography>
                <Typography
                  variant="body1"
                  color="#000000CC"
                  fontWeight="500"
                  mt={2}
                >
                  Already have an account?{" "}
                  <span
                    style={{
                      cursor: "pointer",
                      color: "#2752E7",
                    }}
                    onClick={() => router.push("/auth/login")}
                  >
                    Login
                  </span>
                </Typography>
              </Box>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="First name"
                      type="text"
                      name="firstName"
                      value={formik.values.firstName}
                      error={
                        formik.touched.firstName &&
                        Boolean(formik.errors.firstName)
                      }
                      onBlur={formik.handleBlur}
                      disabled={isLoading}
                      onChange={formik.handleChange}
                      autoComplete="off"
                      onKeyPress={(e) => {
                        if (e.key === " ") {
                          e.preventDefault();
                        }
                      }}
                      inputProps={{
                        maxLength: 61,
                      }}
                      InputProps={{
                        maxLength: 61,
                        startAdornment: (
                          <InputAdornment position="start">
                            <FiUser />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <FormHelperText error>
                      {formik.touched.firstName && formik.errors.firstName}
                    </FormHelperText>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="Last name"
                      type="text"
                      name="lastName"
                      value={formik.values.lastName}
                      error={
                        formik.touched.lastName &&
                        Boolean(formik.errors.lastName)
                      }
                      onBlur={formik.handleBlur}
                      disabled={isLoading}
                      onChange={formik.handleChange}
                      autoComplete="off"
                      onKeyPress={(e) => {
                        if (e.key === " ") {
                          e.preventDefault();
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FiUser />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <FormHelperText error>
                      {formik.touched.lastName && formik.errors.lastName}
                    </FormHelperText>
                  </Grid>
                </Grid>
                <Box mt={3} className="countryBox">
                  <Select
                    name="country"
                    fullWidth
                    variant="standard"
                    value={formik.values.country}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    onChange={formik.handleChange}
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected?.length === 0) {
                        return (
                          <Typography
                            variant="body2"
                            color="secondary"
                            sx={{
                              margin: "0px",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              "& svg": { pr: "8px" },
                            }}
                          >
                            <BiWorld /> Country
                          </Typography>
                        );
                      }
                      return (
                        <Typography
                          variant="body2"
                          color="secondary"
                          style={{
                            margin: "0px",
                            fontSize: "15px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <BiWorld />
                          {selected}
                        </Typography>
                      );
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="" disabled>
                      Select country
                    </MenuItem>
                    {countries &&
                      countries.map((map) => {
                        return (
                          <MenuItem key={map.name} value={map.name}>
                            {map.name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                  <FormHelperText error>
                    {formik.touched.country && formik.errors.country}
                  </FormHelperText>
                </Box>
                <Box mt={3}>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Email"
                    type="text"
                    name="email"
                    value={formik.values.email}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    onChange={formik.handleChange}
                    autoComplete="off"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MdOutlineMail />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormHelperText error>
                    {formik.touched.email && formik.errors.email}
                  </FormHelperText>
                </Box>
                <Box mt={3}>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Referral Code"
                    type="text"
                    name="referralCode"
                    value={formik.values.referralCode}
                    error={
                      formik.touched.referralCode &&
                      Boolean(formik.errors.referralCode)
                    }
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    onChange={formik.handleChange}
                    autoComplete="off"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VscReferences />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormHelperText error>
                    {formik.touched.referralCode && formik.errors.referralCode}
                  </FormHelperText>
                </Box>
                <Box mt={3}>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    onChange={formik.handleChange}
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LiaKeySolid />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            sx={{
                              background: "transparent",
                            }}
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? (
                              <HiEye style={{ color: "#585757" }} />
                            ) : (
                              <HiEyeOff style={{ color: "#585757" }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {formik.touched.password &&
                    Boolean(formik.errors.password) && (
                      <SecurePassword password={formik.values.password} />
                    )}
                </Box>
                <Box mt={3}>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Confirm password"
                    type={showPassword1 ? "text" : "password"}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    error={
                      formik.touched.confirmPassword &&
                      Boolean(formik.errors.confirmPassword)
                    }
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    onChange={formik.handleChange}
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LiaKeySolid />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            sx={{
                              background: "transparent",
                            }}
                            onClick={() => setShowPassword1(!showPassword1)}
                            edge="end"
                          >
                            {showPassword1 ? (
                              <HiEye style={{ color: "#585757" }} />
                            ) : (
                              <HiEyeOff style={{ color: "#585757" }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormHelperText error>
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword}
                  </FormHelperText>
                </Box>
                <Box className="agreeBox displayStart" mt={3} align="center">
                  <Box
                    style={{ marginLeft: "-8px" }}
                    className="displayStart"
                    onClick={() => !isLoading && setIsChecked(!isChecked)}
                  >
                    <Checkbox checked={isChecked} defaultChecked />
                    <Typography
                      variant="body2"
                      color="#00000080"
                      ml={1}
                      fontSize="13px"
                      className="acceptBox"
                    >
                      <lable
                        onClick={() => !isLoading && setIsChecked(!isChecked)}
                        style={{ color: "#000000" }}
                      >
                        I accept the{" "}
                      </lable>
                      <Link
                        href="/term-condition"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#2752E7" }}
                      >
                        Terms & Conditions
                      </Link>{" "}
                      <span style={{ color: "#2752E7" }}>&</span> {""}
                      <Link
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#2752E7" }}
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
                    disabled={isLoading || !isChecked}
                  >
                    Next {isLoading && <ButtonCircularProgress />}
                  </Button>
                </Box>
              </form>
            </Box>
          </RightSection>
        </Grid>
      </StyledContainer>
      {/* {acceptedPrivacyPolicy && (
        <PrivacyModal
          open={acceptedPrivacyPolicy}
          handleClose={() => setAcceptedPrivacyPolicy(false)}
          onAccept={handleAcceptPrivacyPolicy}
          onDecline={handleDeclinePrivacyPolicy}
        />
      )} */}
    </SignupComponent>
  );
}
