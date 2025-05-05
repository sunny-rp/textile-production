"use client"

import { useEffect, useState, useCallback } from "react"
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
import { createClient, totalClient,editClient } from "@/api/clientApi"

// List of admin emails for role-based access control
const drawerWidth = 260

const Dashboard = () => {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userData, setUserData] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [productionData, setProductionData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false) // New state for tracking form submission
  const [showAddForm, setShowAddForm] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [signupDialogOpen, setSignupDialogOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword1, setShowPassword1] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [signupLoading, setSignupLoading] = useState(false)

  // Memoized fetch function to prevent unnecessary re-creation
  const fetchClientData = useCallback(async () => {
    try {
      setIsLoading(true)
      const clientData = await totalClient()
      if (clientData?.data?.data?.clients) {
        setProductionData(clientData.data.data.clients)
      }
    } catch (error) {
      console.error("Failed to fetch client data:", error)
      toast.error("Failed to load production data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem("isAuthenticated")
    if (!isAuth) {
      router.push("/auth/login")
      return
    }

    // Check if we're on the login page and redirect if authenticated
    if (router.pathname === "/auth/login") {
      // Get the stored account type
      const storedAccountType = localStorage.getItem("accountType")
      // Redirect to dashboard with the stored account type
      router.push({
        pathname: "/dashboard",
        query: { accountType: storedAccountType || "User" },
      })
      return
    }

    // Set username from localStorage
    const storedName = localStorage.getItem("userName")
    setUserName(storedName || "User")

    // Get the account type from URL query parameters or localStorage
    const { accountType } = router.query
    const storedAccountType = localStorage.getItem("accountType")

    // Determine the account type to use (prefer URL param, fallback to localStorage)
    const effectiveAccountType = accountType || storedAccountType || "User"

    // Store the account type in localStorage for persistence
    if (accountType) {
      localStorage.setItem("accountType", accountType)
    }

    // Set admin status based on the effective account type
    const isAdminUser = effectiveAccountType === "Admin"
    setIsAdmin(isAdminUser)

    // // // Set mock user data with the correct role
    // const mockUserData = {
    //   name: "Demo User",
    //   email: isAdminUser ? "admin@textile.com" : "user@textile.com",
    //   role: isAdminUser ? "admin" : "user",
    //   isAuthenticated: true,
    // }

    // setUserData(mockUserData)

    // Load initial data
    fetchClientData()
  }, [router.query, router.pathname, fetchClientData])

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
        setSignupLoading(true)

        const formData = {
          email: values.email.toLowerCase(),
          password: values.password,
          confirmPassword: values.confirmPassword,
          fullname: values.fullname.trim(),
          accountType: values.accountType,
        }

        const res = await registerUser(formData)

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
        setSignupLoading(false)
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
    localStorage.removeItem("accountType") // Also clear account type

    // Show toast and redirect
    toast.success("Logged out successfully")
    router.push("/auth/login")
  }

  // Optimized function to add production data with better error handling and optimistic updates
  const handleAddProduction = async (newProduction) => {
    try {
      // Set submitting state to true
      setIsSubmitting(true)

      // Create a temporary ID for optimistic update
      const tempId = `temp-${Date.now()}`

      // Create a temporary entry with the form data
      const tempEntry = {
        id: tempId,
        ...newProduction,
        // Add any default values that might be needed
        _isOptimistic: true, // Flag to identify this as an optimistic update
      }

      // Optimistically update the UI immediately
      setProductionData((prevData) => [...prevData, tempEntry])

      // Close the form immediately for better UX
      setShowAddForm(false)

      // Show a loading toast that we'll update later
      const toastId = toast.loading("Adding production data...")

      // Make the actual API call
      const response = await createClient(newProduction)

      // Handle the API response
      if (response.status === 200 || response.status === 201) {
        // Get the real data from the response
        const newClientData = response.data.data

        // Replace the temporary entry with the real one
        setProductionData((prevData) =>
          prevData.map((item) => (item.id === tempId ? { ...newClientData, _isOptimistic: false } : item)),
        )

        // Update the toast to success
        toast.success("Production data added successfully", { id: toastId })
      } else {
        // If the API call failed, remove the temporary entry
        setProductionData((prevData) => prevData.filter((item) => item.id !== tempId))

        // Update the toast to error
        toast.error(`Failed to add production data: ${response.status}`, { id: toastId })
      }
    } catch (error) {
      console.error("Error adding production:", error)

      // Remove the optimistic entry on error
      setProductionData((prevData) => prevData.filter((item) => !item._isOptimistic))

      // Show error toast
      toast.error(`Failed to add production data: ${error.message || "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateProduction = async (id, updatedData) => {
    try {
      // Optimistic UI update
      setProductionData(prev => prev.map(item => 
        item.id === id ? { ...item, ...updatedData, _isUpdating: true } : item
      ));
      
  
      const response = await editClient(id, updatedData);
      console.log("res",response)
      if (response.data.statusCode === 200) {
        toast.success(response.data.message || "Production data updated successfully");
        await fetchClientData(); // Refresh the data
      } else {
        // Revert optimistic update if failed
        setProductionData(prev => prev.map(item => 
          item.id === id ? { ...item, _isUpdating: false } : item
        ));
        toast.error(response.data.message || "Failed to update production data");
      }
    } catch (error) {
      console.error("Error updating production data:", error);
      // Revert optimistic update on error
      setProductionData(prev => prev.map(item => 
        item.id === id ? { ...item, _isUpdating: false } : item
      ));
      toast.error(
        error.response?.data?.message || 
        "An error occurred while updating production data"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleDeleteProduction = (id) => {
    // Optimistic delete for better UX
    const filteredData = productionData.filter((item) => item.id !== id)
    setProductionData(filteredData)
    toast.success("Production data deleted successfully")
  }

  const handleLogout = () => {
    toast.success("Logged out successfully")
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

  return (
    <Box className="dashboard-root">
      {/* Sidebar Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{
          keepMounted: true,
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
                disabled={isSubmitting}
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
                disabled={signupLoading}
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
                      disabled={isSubmitting}
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <ProductionForm onSubmit={handleAddProduction} isSubmitting={isSubmitting} />
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
                {isLoading && !productionData.length ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress size={40} />
                  </Box>
                ) : (
                  <ProductionTable
                    data={productionData}
                    isAdmin={isAdmin}
                    onUpdate={isAdmin ? handleUpdateProduction : undefined}
                    onDelete={isAdmin ? handleDeleteProduction : undefined}
                  />
                )}
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
