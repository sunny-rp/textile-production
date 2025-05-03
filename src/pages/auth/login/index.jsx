"use client"

import { Box, Button, TextField, Typography, IconButton, InputAdornment, FormHelperText, Paper } from "@mui/material"
import { useState, useEffect } from "react"
import { Form, Formik } from "formik"
import * as yup from "yup"
import styled from "@emotion/styled"
import { useRouter } from "next/router"
import toast, { Toaster } from "react-hot-toast"
import { MdOutlineMail } from "react-icons/md"
import { GoKey } from "react-icons/go"
import { Eye, EyeOff } from "lucide-react"
import CustomHead from "../../../components/CustomHead"
import LoginLayout from "../../../layout/LoginLayout/LoginLayout"
import { loginUser } from "@/api/authApi"


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
    "& .mainBox": {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      boxShadow: "none",
      padding: "40px",
    },
  },
}))

export default function Login() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRemember, setIsRemember] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated")
    if (isAuth === "true") {
      router.push("/dashboard")
    } else {
      setCheckingAuth(false)
    }
  }, [router])

  if (checkingAuth) return null

  const formValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email.")
      .max(256, "Should not exceed 256 characters.")
      .required("Email is required."),
    password: yup
      .string()
      .trim()
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
      const res = await loginUser({
        email: values.email.toLowerCase(),
        password: values.password,
      })

      console.log(res.data.message);


      if (res.data.statusCode === 200) {
        localStorage.setItem("isAuthenticated", "true")

        // Fix: Extract accountType from the nested data structure
        const accountType = res.data.data.accountType
        const userName = res.data.data.fullname

        // ✅ Store userName in localStorage
        localStorage.setItem("userName", userName)

        // Pass the account type as a query parameter
        router.push({
          pathname: "/dashboard",
          query: {
            accountType: accountType,
          },
        })

        console.log("hello", res)


        toast.success("Logged In Successfully")
      }
    }
    catch (error) {
      toast.error("Email id or password is incorrect")
    }
  }

  return (
    <SignupComponent>
      <Paper
        className="loginContainer"
        sx={{
          maxWidth: { xs: '90%', sm: '80%', md: '60%', lg: '50%', xl: '40%' },
          mx: 'auto',
          my: 4,
          p: { xs: 2, sm: 3, md: 4 },
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Box className="companyHeading">
          <Typography variant="h2" color="primary">Development</Typography>
          <img src="/images/download.jpeg" alt="Descriptive alt text" height="50" width="50" />


        </Box>
        <CustomHead image="/images/FbSizeImage.png" video="" isVideo={false} />
        <Box className="loginBox" sx={{ color: "#2752e7" }}>
          <Box align="center" mb={5.4}>
            <Typography variant="h1" color="primary" className="loginText">
              Login
            </Typography>
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
                <Box className="displayCenter" mt={5.4}>
                  <Button variant="contained" color="primary" type="submit" fullWidth disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log in"}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
          <Toaster position="top-right" />
        </Box>
      </Paper>
    </SignupComponent>
  )
}

Login.getLayout = function getLayout(page) {
  return <LoginLayout>{page}</LoginLayout>
}
