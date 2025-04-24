"use client"

import { useState, useEffect } from "react"
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Badge,
  Tooltip,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon,
  Search as SearchIcon,
} from "@mui/icons-material"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import toast from "react-hot-toast"
// import "./dashboardLayout.scss"

const drawerWidth = 260

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#ffffff",
  color: "#2752e7",
  boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.1)",
}))

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: "#f8f9fa",
    borderRight: "1px solid #e0e0e0",
  },
}))

const DashboardLayout = ({ children }) => {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userData, setUserData] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const notificationOpen = Boolean(notificationAnchorEl)

  useEffect(() => {
    // Check if user is logged in
    const storedUserData = localStorage.getItem("userData")

    if (!storedUserData) {
      toast.error("Please login to access the dashboard")
      router.push("/auth/login")
      return
    }

    setUserData(JSON.parse(storedUserData))
  }, [router])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null)
  }

  const handleLogout = () => {
    localStorage.removeItem("userData")
    toast.success("Logged out successfully")
    router.push("/auth/login")
  }

  // const menuItems = [
  //   { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  //   { text: "Production", icon: <InventoryIcon />, path: "/dashboard/production" },
  //   { text: "Reports", icon: <AssessmentIcon />, path: "/dashboard/reports" },
  //   { text: "Team", icon: <PeopleIcon />, path: "/dashboard/team" },
  //   { text: "Settings", icon: <SettingsIcon />, path: "/dashboard/settings" },
  // ]

  const drawer = (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <Typography variant="h6" color="primary" className="sidebar-title">
          Textile Admin
        </Typography>
      </div>
      <Divider />
      <List className="sidebar-menu">
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => router.push(item.path)}
              selected={router.pathname === item.path}
              className={router.pathname === item.path ? "menu-item-active" : "menu-item"}
            >
              <ListItemIcon className={router.pathname === item.path ? "menu-icon-active" : "menu-icon"}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  className: router.pathname === item.path ? "menu-text-active" : "menu-text",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box className="sidebar-footer">
        <Button fullWidth startIcon={<LogoutIcon />} onClick={handleLogout} className="logout-button">
          Logout
        </Button>
      </Box>
    </div>
  )

  if (!userData) {
    return null // Don't render anything until we check authentication
  }

  return (
    <Box className="dashboard-layout">
      <CssBaseline />
      <StyledAppBar position="fixed" className="app-header">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className="menu-button"
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" className="app-title">
            Textile Management System
          </Typography>

          <Box className="header-actions">
            <Tooltip title="Search">
              <IconButton color="inherit" className="header-icon">
                <SearchIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Help">
              <IconButton color="inherit" className="header-icon">
                <HelpIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton color="inherit" className="header-icon" onClick={handleNotificationClick}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={notificationAnchorEl}
              open={notificationOpen}
              onClose={handleNotificationClose}
              onClick={handleNotificationClose}
              className="notification-menu"
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem className="notification-item">
                <Typography variant="body2" className="notification-title">
                  New production record added
                </Typography>
                <Typography variant="caption" className="notification-time">
                  5 minutes ago
                </Typography>
              </MenuItem>
              <MenuItem className="notification-item">
                <Typography variant="body2" className="notification-title">
                  Production record updated
                </Typography>
                <Typography variant="caption" className="notification-time">
                  1 hour ago
                </Typography>
              </MenuItem>
              <MenuItem className="notification-item">
                <Typography variant="body2" className="notification-title">
                  System maintenance scheduled
                </Typography>
                <Typography variant="caption" className="notification-time">
                  1 day ago
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem className="notification-footer">
                <Typography variant="body2" color="primary">
                  View all notifications
                </Typography>
              </MenuItem>
            </Menu>

            <Box className="user-profile">
              <Typography variant="body2" className="user-name">
                {userData?.name}
                <Typography variant="caption" className="user-role" display="block">
                  {userData?.role === "admin" ? "Administrator" : "User"}
                </Typography>
              </Typography>
              <IconButton onClick={handleProfileClick} className="avatar-button">
                <Avatar className="user-avatar" alt={userData?.name || "User"}>
                  {userData?.name?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                className="profile-menu"
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={() => router.push("/dashboard/profile")} className="profile-menu-item">
                  <Typography variant="body2">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={() => router.push("/dashboard/settings")} className="profile-menu-item">
                  <Typography variant="body2">Settings</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} className="profile-menu-item logout">
                  <Typography variant="body2">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </StyledAppBar>

      <Box component="nav" className="sidebar-nav">
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          className="mobile-drawer"
          sx={{
            display: { xs: "block", sm: "none" },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <StyledDrawer
          variant="permanent"
          className="desktop-drawer"
          sx={{
            display: { xs: "none", sm: "block" },
          }}
          open
        >
          {drawer}
        </StyledDrawer>
      </Box>

      <Box component="main" className="main-content">
        {children}
      </Box>
    </Box>
  )
}

export default DashboardLayout
