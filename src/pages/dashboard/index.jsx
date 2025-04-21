"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Box, Typography, Grid, Paper, CircularProgress, Card, CardContent, Chip, Divider, Button } from "@mui/material"
import { TrendingUp, TrendingDown, Inventory, People, Add as AddIcon } from "@mui/icons-material"
import toast from "react-hot-toast"
import DashboardLayout from "../../layout/DashboardLayout/DashboardLayout"
import ProductionForm from "../../components/ProductionForm"
import ProductionTable from "../../components/ProductionTable"


const ADMIN_EMAILS = ["admin@textile.com", "manager@textile.com", "supervisor@textile.com"]

const Dashboard = () => {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [productionData, setProductionData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  const initialData = [
    {
      id: 1,
      date: "2023-06-15",
      productType: "Cotton Fabric",
      quantity: 500,
      unit: "meters",
      quality: "Premium",
      machineId: "M001",
      supervisor: "John Doe",
    },
    {
      id: 2,
      date: "2023-06-16",
      productType: "Polyester Blend",
      quantity: 750,
      unit: "meters",
      quality: "Standard",
      machineId: "M002",
      supervisor: "Jane Smith",
    },
    {
      id: 3,
      date: "2023-06-17",
      productType: "Silk",
      quantity: 200,
      unit: "meters",
      quality: "Premium",
      machineId: "M003",
      supervisor: "Robert Johnson",
    },
    {
      id: 4,
      date: "2023-06-18",
      productType: "Wool",
      quantity: 300,
      unit: "meters",
      quality: "Standard",
      machineId: "M004",
      supervisor: "Emily Davis",
    },
    {
      id: 5,
      date: "2023-06-19",
      productType: "Denim",
      quantity: 450,
      unit: "meters",
      quality: "Economy",
      machineId: "M005",
      supervisor: "Michael Wilson",
    },
  ]

  useEffect(() => {
    // Check if user is logged in
    const storedUserData = localStorage.getItem("userData")

    if (!storedUserData) {
      // For testing purposes, you can use this mock data
      // In production, redirect to login
      const mockUser = {
        name: "Test User",
        email: "admin@textile.com", // Admin email for testing admin view
        role: "admin",
      }
      localStorage.setItem("userData", JSON.stringify(mockUser))
      const parsedUserData = mockUser

      // Determine if user is admin based on email
      const userEmail = parsedUserData.email?.toLowerCase()
      const adminStatus = ADMIN_EMAILS.includes(userEmail)

      setUserData(parsedUserData)
      setIsAdmin(adminStatus)

      setProductionData(initialData)
      setIsLoading(false)

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
  }, [router])

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

  const totalProduction = productionData.reduce((sum, item) => sum + item.quantity, 0)
  const premiumCount = productionData.filter((item) => item.quality === "Premium").length
  const standardCount = productionData.filter((item) => item.quality === "Standard").length
  const economyCount = productionData.filter((item) => item.quality === "Economy").length

  if (isLoading) {
    return (
      <Box className="loading-container">
        <CircularProgress color="primary" />
      </Box>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <Typography variant="h4" className="page-title">
            Textile Production Dashboard
          </Typography>
          <Typography variant="subtitle1" className="welcome-message">
            Welcome, {userData?.name}
            <Chip
              label={isAdmin ? "Administrator" : "User"}
              size="small"
              color={isAdmin ? "primary" : "default"}
              className="role-chip"
            />
          </Typography>
        </div>

        {isAdmin && !showAddForm && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="add-button"
            onClick={() => setShowAddForm(true)}
          >
            Add Production
          </Button>
        )}
      </div>

      {isAdmin && (
        <Grid container spacing={3} className="stats-container">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card">
              <CardContent>
                <div className="stat-header">
                  <Typography variant="subtitle2" className="stat-title">
                    Total Production
                  </Typography>
                  <div className="stat-icon production">
                    <Inventory />
                  </div>
                </div>
                <Typography variant="h4" className="stat-value">
                  {totalProduction}
                </Typography>
                <Typography variant="body2" className="stat-unit">
                  meters
                </Typography>
                <div className="stat-trend positive">
                  <TrendingUp fontSize="small" />
                  <Typography variant="caption">12% increase from last week</Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card">
              <CardContent>
                <div className="stat-header">
                  <Typography variant="subtitle2" className="stat-title">
                    Premium Quality
                  </Typography>
                  <div className="stat-icon premium">
                    <TrendingUp />
                  </div>
                </div>
                <Typography variant="h4" className="stat-value">
                  {premiumCount}
                </Typography>
                <Typography variant="body2" className="stat-unit">
                  products
                </Typography>
                <div className="stat-trend positive">
                  <TrendingUp fontSize="small" />
                  <Typography variant="caption">8% increase from last week</Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card">
              <CardContent>
                <div className="stat-header">
                  <Typography variant="subtitle2" className="stat-title">
                    Standard Quality
                  </Typography>
                  <div className="stat-icon standard">
                    <TrendingUp />
                  </div>
                </div>
                <Typography variant="h4" className="stat-value">
                  {standardCount}
                </Typography>
                <Typography variant="body2" className="stat-unit">
                  products
                </Typography>
                <div className="stat-trend positive">
                  <TrendingUp fontSize="small" />
                  <Typography variant="caption">5% increase from last week</Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card">
              <CardContent>
                <div className="stat-header">
                  <Typography variant="subtitle2" className="stat-title">
                    Active Supervisors
                  </Typography>
                  <div className="stat-icon supervisors">
                    <People />
                  </div>
                </div>
                <Typography variant="h4" className="stat-value">
                  {new Set(productionData.map((item) => item.supervisor)).size}
                </Typography>
                <Typography variant="body2" className="stat-unit">
                  people
                </Typography>
                <div className="stat-trend negative">
                  <TrendingDown fontSize="small" />
                  <Typography variant="caption">2% decrease from last week</Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Modified layout to ensure the table always takes full width */}
      <Box sx={{ width: "100%", maxWidth: "100%" }} className="content-container">
        <Grid container spacing={3}>
          {/* Form column - only shown when adding production */}
          {isAdmin && showAddForm && (
            <Grid item xs={12} md={4}>
              <Paper className="form-paper">
                <div className="form-header">
                  <Typography variant="h6" className="form-title">
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
                </div>
                <Divider className="form-divider" />
                <ProductionForm onSubmit={handleAddProduction} />
              </Paper>
            </Grid>
          )}

          {/* Table column - always shown and takes full width when form is not shown */}
          <Grid item xs={12} md={isAdmin && showAddForm ? 8 : 12}>
            <Paper className="table-paper" sx={{ width: "100%", maxWidth: "100%" }}>
              <Typography variant="h6" className="table-title">
                Production Records
              </Typography>
              <Divider className="table-divider" />
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
    </div>
  )
}

Dashboard.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>
}

export default Dashboard
