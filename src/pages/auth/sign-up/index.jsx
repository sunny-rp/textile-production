"use client"
// Import Material-UI components
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
} from "@mui/material"
import { useState } from "react"
import { HiEye, HiEyeOff } from "react-icons/hi"
import { useFormik } from "formik"
import * as yup from "yup"
import styled from "@emotion/styled"
import { useRouter } from "next/router"
import { toast } from "react-hot-toast"
import moment from "moment"
import { calculateTimeLeft } from "@/utils"
import Link from "next/link"
import { SecurePassword } from "../../../components/PasswordStrengthIndicator"
import { FiUser } from "react-icons/fi"
import { MdOutlineMail } from "react-icons/md"
import { LiaKeySolid } from "react-icons/lia"

const StyledContainer = styled(Grid)({
  height: "100vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f5f5f5"
})

const RightSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
  backgroundColor: "#f5f5f5",
})

const SignupComponent = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("sm")]: {
    alignItems: "center",
    marginBottom: "20px",
  },
  "& .MuiOutlinedInput-input": {
    padding: "10px !important",
  },
}))


export default function Signup() {
  // Initialize Next.js router
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false) // Toggle password visibility
  const [showPassword1, setShowPassword1] = useState(false) // Toggle confirm password visibility
  const [isLoading, setIsLoading] = useState(false) // Loading state for form submission
  const [isChecked, setIsChecked] = useState(false) // Terms and conditions checkbox state


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
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Please enter a valid password."),

    // Confirm password validation
    confirmPassword: yup
      .string()
      .required("Confirm password is required.")
      .oneOf([yup.ref("password"), null], "Confirm password doesn't match."),

    // Last name validation
    lastName: yup
      .string("Please enter valid last name.")
      .required("Last name is required.")
      .matches(/^[a-zA-Z\s,-.']+$/, "Only alphabets and white spaces are allowed for this field.")
      .min(3, "Please enter at least 3 characters.")
      .max(60, "You can enter only 60 characters."),

    // First name validation
    firstName: yup
      .string("Please enter valid first name.")
      .required("First name is required.")
      .matches(/^[a-zA-Z\s,-.']+$/, "Only alphabets and white spaces are allowed for this field.")
      .min(3, "Please enter at least 3 characters.")
      .max(60, "You can enter only 60 characters."),
  })

  // Initialize Formik for form handling
  const formik = useFormik({
    // Initial form values
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      confirmPassword: "",
      password: "",
    },
    // Apply validation schema
    validationSchema: formValidationSchema,
    // Form submission handler
    onSubmit: async (values) => {
      try {
        // Store email in local storage for later use
        window.localStorage.setItem("user_email", values.email)
        // Set loading state
        setIsLoading(true)

        // Prepare data for API request
        const bodyData = {
          email: values.email.toLowerCase(),
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
        }

        // Uncomment when API is ready
        // const response = await apiRouterCall({
        //   method: "POST",
        //   url: api_configs.userSignup,
        //   bodyData: bodyData,
        // });

        // Mock response for now - remove when API is implemented
        const response = {
          data: {
            responseCode: 200,
            responseMessage: "Signup successful!",
          },
        }

        // Handle successful response
        if (response.data.responseCode === 200) {
          // Show success message
          toast.success(response.data.responseMessage)

          // Set OTP timer (3 minutes)
          const endTime = moment().add(3, "m").unix()
          if (endTime) {
            const timeLefts = calculateTimeLeft(endTime * 1000)
            sessionStorage.setItem("otpTimer", JSON.stringify(timeLefts))
          }

          // Store current route and redirect to OTP verification
          sessionStorage.setItem("previousRoute", router.asPath)
          router.replace(`/auth/verify-otp?${values.email.toLowerCase()}`)
        } else {
          // Show error message if response is not successful
          toast.error(response.data.responseMessage)
        }
      } catch (error) {
        // Log and display error message
        console.log(error)
        toast.error("An error occurred during signup")
      } finally {
        // Reset loading state
        setIsLoading(false)
      }
    },
  })

  return (
    <SignupComponent>
      <StyledContainer container>
        <Grid item xs={12} md={12} lg={12}>
          <RightSection>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              width="100%"
              height="100%"
              sx={{ "& svg": { color: "#585757", fontSize: "25px" } }}
            >
             
              <Box width="110%" maxWidth="500px">
                {/* Header section with title and login link */}
                <Box align="center" mb={5.4}>
                  <Typography variant="h2" color="primary" className="loginText">
                    Sign Up
                  </Typography>
                  <Typography variant="body1" color="#000000CC" fontWeight="500" mt={2}>
                    Already have an account?{" "}
                    <span style={{ cursor: "pointer", fontWeight: 600,color: "#2752E7" }} onClick={() => router.push("/auth/login")}>
                      Log In
                    </span>
                  </Typography>
                </Box>

                {/* Signup form */}
                <form onSubmit={formik.handleSubmit}>
                  {/* First name field */}
                  <Box mt={0}>
                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="First name"
                      type="text"
                      name="firstName"
                      value={formik.values.firstName}
                      error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                      onBlur={formik.handleBlur}
                      disabled={isLoading}
                      onChange={formik.handleChange}
                      autoComplete="off"
                      onKeyPress={(e) => {
                        if (e.key === " ") e.preventDefault()
                      }}
                      inputProps={{ maxLength: 61 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FiUser />
                          </InputAdornment>
                        ),
                      }}
                    />
                    {/* Error message for first name */}
                    <FormHelperText error>{formik.touched.firstName && formik.errors.firstName}</FormHelperText>
                  </Box>

                  {/* Last name field */}
                  <Box mt={3}>
                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="Last name"
                      type="text"
                      name="lastName"
                      value={formik.values.lastName}
                      error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                      onBlur={formik.handleBlur}
                      disabled={isLoading}
                      onChange={formik.handleChange}
                      autoComplete="off"
                      onKeyPress={(e) => {
                        if (e.key === " ") e.preventDefault()
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FiUser />
                          </InputAdornment>
                        ),
                      }}
                    />
                    {/* Error message for last name */}
                    <FormHelperText error>{formik.touched.lastName && formik.errors.lastName}</FormHelperText>
                  </Box>

                  {/* Email field */}
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
                    {/* Error message for email */}
                    <FormHelperText error>{formik.touched.email && formik.errors.email}</FormHelperText>
                  </Box>

                  {/* Password field with visibility toggle */}
                  <Box mt={3}>
                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formik.values.password}
                      error={formik.touched.password && Boolean(formik.errors.password)}
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
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
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
                    {/* Password strength indicator */}
                    {formik.touched.password && formik.errors.password && (
                      <SecurePassword password={formik.values.password} />
                    )}
                  </Box>

                  {/* Confirm password field with visibility toggle */}
                  <Box mt={3}>
                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="Confirm password"
                      type={showPassword1 ? "text" : "password"}
                      name="confirmPassword"
                      value={formik.values.confirmPassword}
                      error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
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
                            <IconButton onClick={() => setShowPassword1(!showPassword1)} edge="end">
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
                    {/* Error message for confirm password */}
                    <FormHelperText error>
                      {formik.touched.confirmPassword && formik.errors.confirmPassword}
                    </FormHelperText>
                  </Box>

                  {/* Terms and conditions checkbox */}
                  <Box className="agreeBox displayStart" mt={3} align="center">
                    <Box
                      style={{ marginLeft: "-8px" }}
                      className="displayStart"
                      onClick={() => !isLoading && setIsChecked(!isChecked)}
                    >
                      <Checkbox checked={isChecked} />
                      <Typography variant="body2" color="#00000080" ml={1} fontSize="13px" className="acceptBox">
                        <label onClick={() => !isLoading && setIsChecked(!isChecked)} style={{ color: "#000000" }}>
                          I accept the{" "}
                        </label>
                        <Link
                          href="/term-condition"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#2752E7" }}
                        >
                          Terms & Conditions
                        </Link>{" "}
                        <span style={{ color: "#2752E7" }}>&</span>{" "}
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

                  {/* Submit button */}
                  <Box className="displayCenter" mt={5.4}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      disabled={isLoading || !isChecked}
                    >
                      Next
                      {/* Uncomment when loading indicator component is available */}
                      {/* {isLoading && <ButtonCircularProgress />} */}
                    </Button>
                  </Box>
                </form>
              </Box>
            </Box>
          </RightSection>
        </Grid>
      </StyledContainer>
    </SignupComponent>
  )
}
