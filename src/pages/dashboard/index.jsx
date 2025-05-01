"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Chip,
  Divider,
  Button,
  IconButton,
  Drawer,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  FormHelperText,
  Checkbox,
  MenuItem,
} from "@mui/material"
import {
  People,
  Add as AddIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material"
import { HiEye, HiEyeOff } from "react-icons/hi"
import { FiUser } from "react-icons/fi"
import { MdOutlineMail } from "react-icons/md"
import { LiaKeySolid } from "react-icons/lia"
import { useFormik } from "formik"
import * as yup from "yup"
import Link from "next/link"
import toast from "react-hot-toast"
import ProductionForm from "../../components/ProductionForm"
import ProductionTable from "../../components/ProductionTable"
import { SecurePassword } from "../../components/PasswordStrengthIndicator"
import { Toaster } from "react-hot-toast"
import { registerUser } from "@/api/authApi"

// List of admin emails for role-based access control
const drawerWidth = 260

const Dashboard = () => {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userData, setUserData] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [productionData, setProductionData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [signupDialogOpen, setSignupDialogOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword1, setShowPassword1] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [signupLoading, setSignupLoading] = useState(false)

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated")
    if (!isAuth) {
      router.push("/auth/login")
      return
    }
    const storedName = localStorage.getItem("userName")
    setUserName(storedName || "User")
    // Get the account type from URL query parameters
    const { accountType } = router.query

    if (accountType) {
      // Set admin status based on account type from URL
      setIsAdmin(accountType === "Admin")

      // Set mock user data with the correct role
      const mockUserData = {
        name: "Demo User",
        email: accountType === "Admin" ? "admin@textile.com" : "user@textile.com",
        role: accountType === "Admin" ? "admin" : "user",
        isAuthenticated: true,
      }

      setUserData(mockUserData)
    }

    // Load initial production data
    setProductionData(initialData)
    setIsLoading(false)
  }, [router.query]) 
  const initialData = [
    {
      id: 1,
      material: "Cotton",
      t1: "T1-001",
      materialDescription: "Premium cotton fabric",
      flameAdhesive: "Flame",
      colorway: "Blue",
      width: 150,
    },
    {
      id: 2,
      material: "Polyester",
      t1: "T1-002",
      materialDescription: "Standard polyester blend",
      flameAdhesive: "Adhesive",
      colorway: "Red",
      width: 120,
    },
    {
      id: 3,
      material: "Silk",
      t1: "T1-003",
      materialDescription: "Luxury silk material",
      flameAdhesive: "Flame",
      colorway: "Gold",
      width: 100,
    },
  ]

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
        setIsLoading(true)

        const formData = {
          email: values.email.toLowerCase(),
          password: values.password,
          confirmPassword: values.confirmPassword,
          fullname: values.fullname.trim(),
          accountType: values.accountType,
        }

        console.log("Sending formData:", formData)

        const res = await registerUser(formData)
        console.log("Signup response:", res)

        if (res.data.statusCode === 201) {
          toast.success(res.data.message || "Account Created Successfully")

          // Close the dialog box and reset the form
          setSignupDialogOpen(false)
          formik.resetForm()

          // Optionally reset any other states related to the form
          setIsChecked(false)
        } else if (res.data.statusCode === 409) {
          // This condition handles the "user already exists" case
          toast.error("User already exists")
          formik.resetForm()
        } else {
          toast.error(res.data.message || "Signup failed")
        }
      } catch (error) {
        console.error("Signup error:", error.response?.data || error.message)
        toast.error(error.response?.data?.message || "An error occurred during signup")
      } finally {
        setIsLoading(false)
      }
    },
  })

  const cancelLogout = () => {
    setLogoutDialogOpen(false)
  }

  const confirmLogout = () => {
    // Clear auth flags
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userData")
    localStorage.removeItem("userName")

    // Show toast and redirect
    toast.success("Logged out successfully")
    router.push("/auth/login")
  }

  const handleAddProduction = (newProduction) => {
    const newEntry = {
      id: productionData.length + 1,
      ...newProduction,
    }

    setProductionData([...productionData, newEntry])
    toast.success("Production data added successfully")
    setShowAddForm(false)
  }

  const handleUpdateProduction = (id, updatedData) => {
    const updatedProductionData = productionData.map((item) => (item.id === id ? { ...item, ...updatedData } : item))

    setProductionData(updatedProductionData)
    toast.success("Production data updated successfully")
  }

  const handleDeleteProduction = (id) => {
    const filteredData = productionData.filter((item) => item.id !== id)
    setProductionData(filteredData)
    toast.success("Production data deleted successfully")
  }

  // Modify the handleLogout function to not require authentication
  const handleLogout = () => {
    // Comment out localStorage removal
    // localStorage.removeItem("userData")

    toast.success("Logged out successfully")
    // Redirect to home instead of login
    router.push("/")
  }

  const handleOpenSignupDialog = () => {
    setSignupDialogOpen(true)
    setSidebarOpen(false)
  }

  const handleCloseSignupDialog = () => {
    setSignupDialogOpen(false)
    formik.resetForm()
    setIsChecked(false)
  }

  if (isLoading) {
    return (
      <Box className="loading-container">
        <CircularProgress color="primary" />
      </Box>
    )
  }

  return (
    <Box className="dashboard-root">
      {/* Sidebar Drawer */}
      <Drawer
        variant="temporary" // changed from 'persistent'
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)} // add this to handle outside clicks
        ModalProps={{
          keepMounted: true, // Improves performance on mobile
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f8f9fa",
            borderRight: "1px solid #e0e0e0",
            boxShadow: "2px 0 10px rgba(0, 0, 0, 0.05)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          },
        }}
        className="sidebar-drawer"
      >
        <Box className="sidebar-header">
          <Typography variant="h6" color="primary" fontWeight={600} className="sidebar-title" mt={3} ml={3}>
            Jasmine Knitting Industries
          </Typography>
          <IconButton onClick={() => setSidebarOpen(false)} className="close-sidebar-btn">
            <ChevronLeftIcon />
          </IconButton>
        </Box>

        <Divider />

        <Box className="sidebar-content" sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {isAdmin && (
            <>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  margin: "4px 0",
                  textTransform: "none",
                  mt: 2,
                }}
                onClick={() => {
                  setShowAddForm(true)
                  setSidebarOpen(false)
                }}
              >
                Add Production
              </Button>

              <Button
                startIcon={<People />}
                variant="outlined"
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  margin: "4px 0",
                  textTransform: "none",
                  mt: 1,
                  color: "#d32f2f",
                  borderColor: "#d32f2f",
                }}
                onClick={handleOpenSignupDialog}
              >
                Create Account
              </Button>
            </>
          )}
        </Box>

        <Box className="sidebar-footer" sx={{ p: 2, borderTop: "1px solid #e0e0e0", mt: "auto" }}>
          <Button
            startIcon={<LogoutIcon />}
            variant="outlined"
            color="error"
            fullWidth
            sx={{
              justifyContent: "flex-start",
              padding: "10px 16px",
              borderRadius: "8px",
              textTransform: "none",
            }}
            onClick={() => setLogoutDialogOpen(true)}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        className="main-content"
        sx={{
          flexGrow: 1,
          padding: 3,
          width: "100%",
          height: "100vh",
          overflow: "auto",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* Top Bar with Menu Button */}
        <Box className="top-bar" sx={{ position: "fixed", top: 16, left: 16, zIndex: 1100 }}>
          <Tooltip title="Open Menu">
            <IconButton
              onClick={() => setSidebarOpen(true)}
              sx={{
                backgroundColor: "white",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
              size="large"
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Centered Content Container */}
        <Box
          className="content-wrapper"
          sx={{
            maxWidth: "1200px",
            margin: "0 auto",
            paddingTop: "60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Dashboard Header */}
          <Box className="dashboard-header" sx={{ width: "100%", textAlign: "center", mb: 4 }}>
            <Typography variant="h4" className="page-title" color="primary" fontWeight={600}>
              Textile Production Dashboard
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 1 }}>
              <Typography variant="subtitle1" className="welcome-message">
              Welcome, {userName}
              </Typography> 
              <Chip
                label={isAdmin ? "Administrator" : "User"}
                size="small"
                color={isAdmin ? "primary" : "primary"}
                className="role-chip"
                sx={{ ml: 1 }}
              />
            </Box>
          </Box>

          {/* Main Content Grid */}
          <Grid container spacing={3} sx={{ width: "100%" }}>
            {/* Production Form - Only for Admin */}
            {isAdmin && showAddForm && (
              <Grid item xs={12} md={6}>
                <Paper
                  className="form-paper"
                  sx={{
                    p: 3,
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" className="form-title" fontWeight={600} color="primary">
                      Add Production Details
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      className="cancel-button"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <ProductionForm onSubmit={handleAddProduction} />
                </Paper>
              </Grid>
            )}

            {/* Production Table */}
            <Grid item xs={12} md={isAdmin && showAddForm ? 6 : 12} sx={{ width: "100%" }}>
              <Paper
                className="table-paper"
                sx={{
                  p: 3,
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Typography variant="h6" className="table-title" fontWeight={600} color="primary" sx={{ mb: 2 }}>
                  Production Records
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <ProductionTable
                  data={productionData}
                  isAdmin={isAdmin}
                  onUpdate={isAdmin ? handleUpdateProduction : undefined}
                  onDelete={isAdmin ? handleDeleteProduction : undefined}
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog
        className="logout-dialog"
        open={logoutDialogOpen}
        onClose={cancelLogout}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <Box className="content-ask">
          <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
          <DialogContent dividers>
            <Typography id="logout-dialog-description">Are you sure you want to log out?</Typography>
          </DialogContent>
        </Box>
        <DialogActions>
          <Button onClick={cancelLogout} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmLogout} color="error" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Signup Dialog */}
      <Dialog
        open={signupDialogOpen}
        onClose={handleCloseSignupDialog}
        maxWidth="sm"
        fullWidth
        aria-labelledby="signup-dialog-title"
      >
        <DialogTitle id="signup-dialog-title" sx={{ textAlign: "center", pt: 3 }}>
          <Typography variant="h5" color="primary" fontWeight={600}>
            Create New Account
          </Typography>
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              formik.handleSubmit()
            }}
          >
            <Box mt={2}>
              <TextField
                fullWidth
                variant="standard"
                placeholder="Full name"
                type="text"
                name="fullname"
                value={formik.values.fullname}
                error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                onBlur={formik.handleBlur}
                disabled={signupLoading}
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
                disabled={signupLoading}
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
                disabled={signupLoading}
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
                disabled={signupLoading}
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
              <FormHelperText error>{formik.touched.confirmPassword && formik.errors.confirmPassword}</FormHelperText>
            </Box>

            <Box className="agreeBox displayStart" mt={3} align="center">
              <Box
                style={{ marginLeft: "-8px" }}
                className="displayStart"
                onClick={() => !signupLoading && setIsChecked(!isChecked)}
              >
                <Checkbox checked={isChecked} />
                <Typography variant="body2" color="#00000080" ml={1} fontSize="13px">
                  <label onClick={() => !signupLoading && setIsChecked(!isChecked)} style={{ color: "#000000" }}>
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
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
          <Button onClick={handleCloseSignupDialog} color="inherit" disabled={signupLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={signupLoading || !isChecked}
            onClick={() => {
              formik.handleSubmit()
            }}
          >
            {signupLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </DialogActions>
      </Dialog>
      <Toaster position="top-right" />
    </Box>
  )
}

Dashboard.getLayout = function getLayout(page) {
  return page
}

export default Dashboard
