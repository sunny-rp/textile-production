"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
  IconButton,
  Drawer,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  TrendingUp,
  TrendingDown,
  Inventory,
  People,
  Add as AddIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material"
import toast from "react-hot-toast"
import ProductionForm from "../../components/ProductionForm"
import ProductionTable from "../../components/ProductionTable"


// List of admin emails for role-based access control
const ADMIN_EMAILS = ["admin@textile.com", "manager@textile.com", "supervisor@textile.com"]
const drawerWidth = 260

const Dashboard = () => {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [productionData, setProductionData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  // Updated initial data to match the new form fields
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


  useEffect(() => {
    // Set default mock data for direct access without login
    const mockUserData = {
      name: "Demo User",
      email: "admin@textile.com",
      role: "admin",
      isAuthenticated: true,
    }

    // Set admin status to true by default
    setUserData(mockUserData)
    setIsAdmin(true)

    // Load initial production data
    setProductionData(initialData)
    setIsLoading(false)

    /* 
    // Original authentication code (commented out)
    // Check if user is logged in
    const storedUserData = localStorage.getItem("userData")

    if (!storedUserData) {
      // If no user data, redirect to login
      toast.error("Please login to access the dashboard")
      router.push("/auth/login")
      return
    }

    // Parse user data from localStorage
    const parsedUserData = JSON.parse(storedUserData)

    // Determine if user is admin based on email
    const userEmail = parsedUserData.email?.toLowerCase()
    const adminStatus = ADMIN_EMAILS.includes(userEmail)

    // Update user data with correct role based on email
    if (parsedUserData.role !== (adminStatus ? "admin" : "user")) {
      parsedUserData.role = adminStatus ? "admin" : "user"
      localStorage.setItem("userData", JSON.stringify(parsedUserData))
    }

    setUserData(parsedUserData)
    setIsAdmin(adminStatus)

    // Log access level for debugging
    if (adminStatus) {
      console.log("Admin access granted for:", userEmail)
    } else {
      console.log("User access granted for:", userEmail)
    }

    setProductionData(initialData)
    setIsLoading(false)
    */
  }, [])

  const cancelLogout = () => {
    setLogoutDialogOpen(false)
  }

  const confirmLogout = () => {
    toast.success("Logged out successfully")
    router.push("/")
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
          {/* <Stack spacing={1} className="sidebar-menu">
            {menuItems.map((item) => (
              <Button
                key={item.text}
                startIcon={item.icon}
                className={router.pathname === item.path ? "menu-item-active" : "menu-item"}
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  margin: "4px 0",
                  textTransform: "none",
                }}
                onClick={() => router.push(item.path)}
              >
                {item.text}
              </Button>
            ))} */}

          {isAdmin && (
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
          )}

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
              color: '#d32f2f',
              borderColor: '#d32f2f',

            }}
            onClick={() => router.push("/auth/sign-up")}
          >
            Create Account
          </Button>



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
                Welcome, {userData?.name}
              </Typography>
              <Chip
                label={isAdmin ? "Administrator" : "User"}
                size="small"
                color={isAdmin ? "primary" : "default"}
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
        <DialogActions >
          <Button onClick={cancelLogout} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmLogout} color="error" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}


Dashboard.getLayout = function getLayout(page) {
  return page
}

export default Dashboard
