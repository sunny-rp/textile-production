"use client"
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
import { registerUser } from "@/api/authApi"

const StyledContainer = styled(Grid)({
  height: "100vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f5f5f5",
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
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword1, setShowPassword1] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  const formValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email.")
      .max(56, "Email should not exceed 56 characters.")
      .required("Email is required."),
    accountType: yup.string().required("Account type is required."),
    password: yup
      .string()
      .required("Password is required.")
      .max(16, "Password should not exceed 16 characters.")
      .min(8, "Password must be a minimum of 8 characters.")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Please enter a valid password."),
    confirmPassword: yup
      .string()
      .required("Confirm password is required.")
      .oneOf([yup.ref("password"), null], "Confirm password doesn't match."),
    fullname: yup
      .string("Please enter valid full name.")
      .required("Full name is required.")
      .matches(/^[a-zA-Z\s,-.']+$/, "Only alphabets and white spaces are allowed.")
      .min(3, "Please enter at least 3 characters.")
      .max(120, "You can enter only 120 characters."),
  })

  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      accountType: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
    
        const formData = {
          email: values.email.toLowerCase(),
          password: values.password,
          confirmPassword: values.confirmPassword,
          fullname: values.fullname.trim(),
          accountType: values.accountType,
        };
    
        console.log("Sending formData:", formData);
    
        const res = await registerUser(formData);
        console.log("Signup response:", res);
    
        if (res.data.responseCode === 200) {
          toast.success(res.data.responseMessage);
          router.push("/auth/login")
        } else {
          toast.error(res.data.responseMessage || "Signup failed");
        }
      } catch (error) {
        console.error("Signup error:", error.response?.data || error.message);
        toast.error(
          error.response?.data?.message || "An error occurred during signup"
        );
      } finally {
        setIsLoading(false);
      }
    }
    
    
  })

  return (
    <SignupComponent>
      <StyledContainer container>
        <Grid item xs={12}>
          <RightSection>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%">
              <Box width="110%" maxWidth="500px">
                <Box align="center" mb={5.4}>
                  <Typography variant="h1" color="primary">
                    Sign Up
                  </Typography>
                  <Typography variant="body1" color="#000000CC" fontWeight="500" mt={2}>
                    Already have an account?{" "}
                    <span
                      style={{ cursor: "pointer", fontWeight: 600, color: "#2752E7" }}
                      onClick={() => router.push("/auth/login")}
                    >
                      Log In
                    </span>
                  </Typography>
                </Box>

                <form onSubmit={formik.handleSubmit}>
                  <Box mt={0}>
                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="Full name"
                      type="text"
                      name="fullname"
                      value={formik.values.fullname}
                      error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                      onBlur={formik.handleBlur}
                      disabled={isLoading}
                      onChange={formik.handleChange}
                      autoComplete="off"
                      inputProps={{ maxLength: 121 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FiUser />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <FormHelperText error>{formik.touched.fullname && formik.errors.fullname}</FormHelperText>
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
                    <FormHelperText error>{formik.touched.email && formik.errors.email}</FormHelperText>
                  </Box>

                  {/* Account Type Field */}
                  <Box mt={3}>
                    <TextField
                      fullWidth
                      select
                      variant="standard"
                      name="accountType"
                      value={formik.values.accountType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.accountType && Boolean(formik.errors.accountType)}
                      helperText={formik.touched.accountType && formik.errors.accountType}
                      SelectProps={{
                        displayEmpty: true,
                      }}
                      inputProps={{
                        style: { textAlign: "center" },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FiUser />
                          </InputAdornment>
                        ),
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select Account Type
                      </MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                      <MenuItem value="User">User</MenuItem>
                    </TextField>
                  </Box>

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
                              {showPassword ? <HiEye style={{ color: "#000" }} /> : <HiEyeOff style={{ color: "#000" }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {formik.touched.password && formik.errors.password && (
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
                              {showPassword1 ? <HiEye style={{ color: "#000" }} /> : <HiEyeOff style={{ color: "#000" }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <FormHelperText error>
                      {formik.touched.confirmPassword && formik.errors.confirmPassword}
                    </FormHelperText>
                  </Box>

                  <Box className="agreeBox displayStart" mt={3} align="center">
                    <Box
                      style={{ marginLeft: "-8px" }}
                      className="displayStart"
                      onClick={() => !isLoading && setIsChecked(!isChecked)}
                    >
                      <Checkbox checked={isChecked} />
                      <Typography variant="body2" color="#00000080" ml={1} fontSize="13px">
                        <label onClick={() => !isLoading && setIsChecked(!isChecked)} style={{ color: "#000000" }}>
                          I accept the{" "}
                        </label>
                        <Link href="/term-condition" target="_blank" style={{ color: "#2752E7" }}>
                          Terms & Conditions
                        </Link>{" "}
                        <span style={{ color: "#2752E7" }}>&</span>{" "}
                        <Link href="/privacy-policy" target="_blank" style={{ color: "#2752E7" }}>
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
                      Next
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
