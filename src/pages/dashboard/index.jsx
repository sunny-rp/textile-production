"use client"

import { useEffect, useState, useCallback, useRef } from "react"
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
import { createClient, totalClient, editClient, deleteClient } from "@/api/clientApi"
import CloseIcon from "@mui/icons-material/Close"

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

  // Add a ref to track if data has been fetched and prevent infinite loops
  const dataFetchedRef = useRef(false)
  const initialLoadDoneRef = useRef(false)

  // Memoized fetch function to prevent unnecessary re-creation
  const fetchClientData = useCallback(async () => {
    // Skip if we're already loading or if data has been fetched and we're not submitting
    if (isLoading && dataFetchedRef.current && !isSubmitting) return

    try {
      setIsLoading(true)
      console.log("Fetching client data...")
      const clientData = await totalClient()
      console.log("API Response:", clientData)

      if (clientData?.data?.data?.clients) {
        const clients = clientData.data.data.clients
        console.log("Client data received:", clients)
        setProductionData(clients)
      } else {
        console.log("No clients data found in response:", clientData)
        setProductionData([])
      }

      // Mark data as fetched
      dataFetchedRef.current = true
    } catch (error) {
      console.error("Failed to fetch client data:", error)
      if (error.response) {
        console.error("Error response data:", error.response.data)
        console.error("Error response status:", error.response.status)
      }
      toast.error("Failed to load production data")
      setProductionData([])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, isSubmitting])

  // Add this effect to log productionData after it changes
  useEffect(() => {
    console.log("Production data state updated:", productionData)
  }, [productionData])

  // Initial setup effect - only runs once on mount
  useEffect(() => {
    // Skip if we've already done the initial load
    if (initialLoadDoneRef.current) return

    // Check if user is authenticated
    const isAuth = localStorage.getItem("isAuthenticated")
    if (!isAuth) {
      router.push("/auth/login")
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

    // Load initial data for ALL users
    console.log("Fetching client data for user type:", effectiveAccountType)
    fetchClientData()

    // Mark initial load as done
    initialLoadDoneRef.current = true
  }, [router.query, fetchClientData, router])

  // Separate effect for handling query parameter changes
  useEffect(() => {
    // Only handle query changes after initial load
    if (!initialLoadDoneRef.current) return

    const { accountType } = router.query
    if (accountType) {
      localStorage.setItem("accountType", accountType)
      const isAdminUser = accountType === "Admin"
      setIsAdmin(isAdminUser)
    }
  }, [router.query])

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

  // Helper function to determine which ID field to use
  const getIdField = (item) => {
    // Check if the item has _id or id
    if (item && item._id !== undefined) return "_id"
    return "id"
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
        _id: tempId,
        id: tempId, // Include both ID formats to be safe
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

      console.log("Adding production with data:", newProduction)
      // Make the actual API call
      const response = await createClient(newProduction)
      console.log("Add production response:", response)

      // Handle the API response
      if (response.status === 200 || response.status === 201) {
        // Get the real data from the response
        const newClientData = response.data.data

        // Replace the temporary entry with the real one
        setProductionData((prevData) => {
          const idField = prevData.length > 0 ? getIdField(prevData[0]) : "_id"
          return prevData.map((item) =>
            item._id === tempId || item.id === tempId ? { ...newClientData, _isOptimistic: false } : item,
          )
        })

        // Update the toast to success
        toast.success("Production data added successfully", { id: toastId })
      } else {
        // If the API call failed, remove the temporary entry
        setProductionData((prevData) => prevData.filter((item) => item._id !== tempId && item.id !== tempId))

        // Update the toast to error
        toast.error(`Failed to add production data: ${response.status}`, { id: toastId })
      }
    } catch (error) {
      console.error("Error adding production:", error)
      if (error.response) {
        console.error("Error response data:", error.response.data)
        console.error("Error response status:", error.response.status)
      }

      // Remove the optimistic entry on error
      setProductionData((prevData) => prevData.filter((item) => !item._isOptimistic))

      // Show error toast
      toast.error(`Failed to add production data: ${error.message || "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
      // Reset the data fetched flag to allow a refresh after adding
      dataFetchedRef.current = false
    }
  }

  // Then make sure your handleUpdateProduction function uses it correctly
  const handleUpdateProduction = async (id, updatedData) => {
    try {
      setIsSubmitting(true)

      // Log the request details for debugging
      console.log("Update request - ID:", id)
      console.log("Update request - Data:", updatedData)

      // Ensure updatedData is not undefined
      if (!updatedData) {
        console.error("updatedData is undefined")
        toast.error("Update data is missing")
        return
      }

      // Optimistic UI update
      setProductionData((prev) =>
        prev.map((item) => (item.id === id || item._id === id ? { ...item, ...updatedData, _isUpdating: true } : item)),
      )

      // Make the API call with both ID and updated data
      const response = await editClient(id, updatedData)
      console.log("Update response:", response)

      if (response && response.data && response.data.statusCode === 200) {
        toast.success(response.data.message || "Production data updated successfully")

        // Reset the data fetched flag to allow a refresh after updating
        dataFetchedRef.current = false
        await fetchClientData() // Refresh the data
      } else {
        // Revert optimistic update if failed
        setProductionData((prev) =>
          prev.map((item) => (item.id === id || item._id === id ? { ...item, _isUpdating: false } : item)),
        )
        toast.error(response?.data?.message || "Failed to update production data")
      }
    } catch (error) {
      console.error("Error updating production data:", error)

      // Log detailed error information
      if (error.response) {
        console.error("Error response data:", error.response.data)
        console.error("Error response status:", error.response.status)
        console.error("Error response headers:", error.response.headers)
        console.error("Requested URL:", error.config.url)
      }

      // Revert optimistic update on error
      setProductionData((prev) =>
        prev.map((item) => (item.id === id || item._id === id ? { ...item, _isUpdating: false } : item)),
      )

      toast.error(error.response?.data?.message || "An error occurred while updating production data")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduction = async (id) => {
    // Optimistically remove item from UI
    const sampleItem = productionData.length > 0 ? productionData[0] : null
    const idField = getIdField(sampleItem)

    // Store the item before removing it in case we need to restore it
    const itemToDelete = productionData.find((item) => item[idField] === id)

    // Remove the item from the UI immediately
    const newProductionData = productionData.filter((item) => item[idField] !== id)
    setProductionData(newProductionData)

    const toastId = toast.loading("Deleting production data...")
    setIsSubmitting(true)

    try {
      const response = await deleteClient(id)
      console.log("Delete response:", response)

      if (response && response.status === 200) {
        toast.success("Production data deleted successfully", { id: toastId })
      } else {
        throw new Error(response?.data?.message || "Failed to delete production data")
      }
    } catch (error) {
      console.error("Failed to delete client:", error)

      toast.error(`Delete failed: ${error.message || "Unknown error"}`, { id: toastId })

      // Restore the deleted item only if the delete fails
      if (itemToDelete) {
        setProductionData([...newProductionData, itemToDelete])
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    setLogoutDialogOpen(true)
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
            onClick={handleLogout}
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
                {isLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress size={40} />
                  </Box>
                ) : productionData.length === 0 ? (
                  <Box sx={{ textAlign: "center", p: 4 }}>
                    <Typography variant="body1">No production data available.</Typography>
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
        disableEscapeKeyDown={false}
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
        disableEscapeKeyDown={false}
      >
        <DialogTitle id="signup-dialog-title" sx={{ textAlign: "center", pt: 3 }}>
          <Typography variant="h5" color="primary" fontWeight={600}>
            Create New Account
          </Typography>
          <IconButton
            onClick={handleCloseSignupDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
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
