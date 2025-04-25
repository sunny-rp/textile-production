"use client"

import { Box, Button, TextField, Typography, IconButton, InputAdornment, FormHelperText, Checkbox } from "@mui/material"
import { useState } from "react"
import { Form, Formik } from "formik"
import * as yup from "yup"
import styled from "@emotion/styled"
import { useRouter } from "next/router"
import toast from "react-hot-toast"
import { MdOutlineMail } from "react-icons/md"
import { GoKey } from "react-icons/go"
import { Eye, EyeOff } from "lucide-react"
import CustomHead from "../../../components/CustomHead"
import LoginLayout from "../../../layout/LoginLayout/LoginLayout"

const SignupComponent = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  height: "100%",
  position: "relative",
  zIndex: "999",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflowY: "auto",
  backgroundColor: "#f5f5f5",
  "& h6": {
    fontSize: "45px !important",
  },
  "& .Mui-checked": {
    color: "#bef856",
  },
  "& .loginBox": {
    height: "initial",
    margin: "15px auto",
    maxWidth: "95%",
    width: "640px",
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
    "& .mainBox": {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      boxShadow: "none",
      padding: "40px",
    },
  },
}))

// List of admin emails for role-based access control
const ADMIN_EMAILS = ["admin@textile.com", "manager@textile.com", "supervisor@textile.com"]

export default function Login() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [isRemember, setIsRemember] = useState(false)

  const formValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email.")
      .max(256, "Should not exceed 256 characters.")
      .required("Email is required."),
    password: yup
      .string()
      .trim()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Please enter a valid password.")
      .required("Password is required.")
      .max(18, "Password should not exceed 18 characters.")
      .min(8, "Password must be at least 8 characters."),
  })

  const handleFormSubmit = async (values) => {
    const formData = {
      email: values.email.toLowerCase(),
      password: values.password,
    }
    try {
      setisLoading(true)

      // For demo purposes, we'll simulate a successful login
      // In a real app, you would call your API here
      setTimeout(() => {
        // Check if the email is an admin email
        const isAdmin = ADMIN_EMAILS.includes(formData.email)

        // Store user data and role in localStorage
        const userData = {
          email: formData.email,
          role: isAdmin ? "admin" : "user",
          name: formData.email.split("@")[0],
          isAuthenticated: true,
        }

        localStorage.setItem("userData", JSON.stringify(userData))

        // Redirect to dashboard
        router.push("/dashboard")

        toast.success(`Welcome back, ${userData.name}!`)
        setisLoading(false)
      }, 1000)

      // Original API call code (commented out for demo)
      /*
      const response = await apiRouterCall({
        method: "POST",
        url: api_configs.login,
        bodyData: formData,
      });

      if (response?.data?.responseCode === 200) {
        let obj = JSON.stringify(formData);
        window.localStorage.setItem("loginData", obj);
        let endTime = moment().add(3, "m").unix();
        if (endTime) {
          const timeLefts = calculateTimeLeft(endTime * 1000);
          sessionStorage.setItem("otpTimer", JSON.stringify(timeLefts));
        }
        sessionStorage.setItem("previousRoute", router.asPath);
        router.push(`/auth/verify-otp?${values.email.toLowerCase()}`);
      } else {
        toast.error(response.data.responseMessage);
      }
      */
    } catch (error) {
      setisLoading(false)
      console.error("Error:", error)
      toast.error(error?.response?.data?.responseMessage || "Login failed.")
    }
  }

  return (
    <SignupComponent>
      <CustomHead image="/images/FbSizeImage.png" video="" isVideo={false} />
      <Box className="loginBox" sx={{ color: "#2752e7" }}>
        <Box align="center" mb={5.4}>
          <Typography variant="h1" color="primary" className="loginText">
            Login
          </Typography>
          {/* <Typography variant="body1" color="#000000CC" mt={2}>
            Don't have an account?{" "}
            <span
              style={{ color: "#2752E7", fontWeight: 600, cursor: "pointer" }}
              onClick={() => router.push("/auth/sign-up")}
            >
              Sign Up
            </span>
          </Typography> */}
        </Box>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          initialStatus={{
            success: false,
            successMsg: "",
          }}
          validationSchema={formValidationSchema}
          onSubmit={handleFormSubmit}
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
                  error={Boolean(touched.email && errors.email)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  autoComplete="off"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton edge="start" sx={{ p: "1px", ml: "4px" }}>
                          <MdOutlineMail style={{ color: "#00000099" }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                    inputProps: { style: { paddingLeft: "0px" } },
                  }}
                />
                <FormHelperText error>{touched.email && errors.email}</FormHelperText>
              </Box>

              <Box mt={3}>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  error={Boolean(touched.password && errors.password)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton edge="start" sx={{ p: "1px", ml: "4px" }}>
                          <GoKey style={{ color: "#00000099" }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          sx={{ p: "1px", mr: "0px" }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Eye style={{ color: "#00000099" }} />
                          ) : (
                            <EyeOff style={{ color: "#00000099" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                    inputProps: { style: { paddingLeft: "0px" } },
                  }}
                />
                <FormHelperText error>{touched.password && errors.password}</FormHelperText>
              </Box>

              <Box className="agreeBox displaySpacebetween" mt={5.4} align="center">
                <Box
                  style={{ marginLeft: "-8px" }}
                  className="displayStart"
                  onClick={() => !isLoading && setIsRemember(!isRemember)}
                >
                  <Checkbox
                    checked={isRemember}
                    sx={{
                      color: "grey",
                      "&.Mui-checked": {
                        color: "black !important",
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: "25px",
                        color: "grey",
                      },
                    }}
                  />
                  <Typography variant="body1" color="#000000CC" ml={1}>
                    Remember me
                  </Typography>
                </Box>

                <Typography
                  variant="body1"
                  color="primary"
                  sx={{  
                    textAlign: "center",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => router.push("/auth/forgot-password")}
                >
                  Forgot Password?
                </Typography>
              </Box>

              <Box className="displayCenter" mt={5.4}>
                <Button variant="contained" color="primary" type="submit" fullWidth disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Log in"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </SignupComponent>
  )
}

Login.getLayout = function getLayout(page) {
  return <LoginLayout>{page}</LoginLayout>
}
