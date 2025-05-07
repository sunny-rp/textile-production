"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Chip,
  Tooltip,
  Divider,
  Grid,
  Box,
  InputAdornment,
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Clear as ClearIcon,
} from "@mui/icons-material"
import { useFormik } from "formik"
import * as yup from "yup"
import styled from "@emotion/styled"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

// Enhanced table container styling for better full-width display
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  width: "100%",
  maxWidth: "100%",
  overflowX: "auto",
  maxHeight: "600px",
  "& .MuiTableCell-head": {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  "& .MuiTable-root": {
    width: "100%",
    minWidth: "800px", // Ensures table doesn't get too compressed
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
}))

const validationSchema = yup.object({
  material: yup.string().required("Material is required"),
  t1: yup.string().required("T1 is required"),
  materialDescription: yup.string().required("Material description is required"),
  flameAdhesive: yup.string().required("Flame / Adhesive is required"),
  colorway: yup.string().required("Colorway is required"),
  width: yup.string().required("Width is required"),
})

const ProductionTable = ({ data, isAdmin, onUpdate, onDelete }) => {
  const router = useRouter()
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState(data)
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const [selectedFilters, setSelectedFilters] = useState({
    material: [],
    flameAdhesive: [],
  })
  // Add refs to track if we've already checked the URL for IDs
  const hasCheckedEditUrlRef = useRef(false)
  const hasCheckedDeleteUrlRef = useRef(false)
  // Add refs to track if we're currently updating the URL
  const isUpdatingUrlRef = useRef(false)

  const flameAdhesiveOptions = ["Flame", "Adhesive"]

  // Check URL for edit ID and delete ID on component mount and when router query changes
  useEffect(() => {
    if (!router.isReady || isUpdatingUrlRef.current) return

    const { editId, deleteId } = router.query

    // Process editId if present
    if (editId && data && data.length > 0 && !openEditDialog) {
      // Find the item with the matching ID (handle both string and number comparisons)
      const itemToEdit = data.find(
        (item) =>
          (item.id && item.id.toString() === editId.toString()) ||
          (item._id && item._id.toString() === editId.toString()),
      )

      if (itemToEdit) {
        handleOpenEditDialog(itemToEdit, false) // Pass false to prevent URL update
        hasCheckedEditUrlRef.current = true
      }
    } else if (!editId) {
      // Reset the flag when editId is removed from URL
      hasCheckedEditUrlRef.current = false
    }

    // Process deleteId if present
    if (deleteId && data && data.length > 0 && !openDeleteDialog) {
      // Find the item with the matching ID (handle both string and number comparisons)
      const itemToDelete = data.find(
        (item) =>
          (item.id && item.id.toString() === deleteId.toString()) ||
          (item._id && item._id.toString() === deleteId.toString()),
      )

      if (itemToDelete) {
        handleOpenDeleteDialog(itemToDelete, false) // Pass false to prevent URL update
        hasCheckedDeleteUrlRef.current = true
      }
    } else if (!deleteId) {
      // Reset the flag when deleteId is removed from URL
      hasCheckedDeleteUrlRef.current = false
    }
  }, [router.query, data, openEditDialog, openDeleteDialog, router.isReady])

  // Update filtered data when data, search term, or filters change
  useEffect(() => {
    if (!Array.isArray(data)) {
      console.warn("ProductionTable expected 'data' to be an array but got:", data)
      setFilteredData([])
      return
    }

    let result = [...data]

    // search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter(
        (item) =>
          (item.material && item.material.toLowerCase().includes(searchLower)) ||
          (item.t1 && item.t1.toLowerCase().includes(searchLower)) ||
          (item.materialDescription && item.materialDescription.toLowerCase().includes(searchLower)) ||
          (item.colorway && item.colorway.toLowerCase().includes(searchLower)) ||
          (item.width && item.width.toString().includes(searchTerm)),
      )
    }

    // filters
    if (selectedFilters.material.length > 0) {
      result = result.filter((item) => selectedFilters.material.includes(item.material))
    }

    if (selectedFilters.flameAdhesive.length > 0) {
      result = result.filter((item) => selectedFilters.flameAdhesive.includes(item.flameAdhesive))
    }

    setFilteredData(result)
  }, [data, searchTerm, selectedFilters])

  const formik = useFormik({
    initialValues: {
      material: "",
      t1: "",
      materialDescription: "",
      flameAdhesive: "",
      colorway: "",
      width: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Get the ID from the selected item (handle both id and _id)
      const itemId = selectedItem.id || selectedItem._id

      // Log what we're submitting for debugging
      console.log("Submitting update for ID:", itemId, "with data:", values)

      // Call the onUpdate function with both ID and updated data
      onUpdate(itemId, values)
      handleCloseEditDialog()
    },
  })

  const handleOpenEditDialog = (item, updateUrl = true) => {
    setSelectedItem(item)

    // Update URL with the item ID only if updateUrl is true
    if (updateUrl && router.isReady) {
      const itemId = item.id || item._id

      // Set flag to prevent re-processing this URL change
      isUpdatingUrlRef.current = true

      // Preserve existing query parameters
      const newQuery = { ...router.query, editId: itemId }
      // Remove deleteId if it exists to avoid confusion
      delete newQuery.deleteId

      // Update URL
      router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true }).then(() => {
        // Reset flag after URL update is complete
        setTimeout(() => {
          isUpdatingUrlRef.current = false
        }, 100)
      })
    }

    // Set form values
    formik.setValues({
      material: item.material || "",
      t1: item.t1 || "",
      materialDescription: item.materialDescription || "",
      flameAdhesive: item.flameAdhesive || "",
      colorway: item.colorway || "",
      width: item.width ? item.width.toString() : "", // Ensure width is a string
    })

    // Open dialog immediately
    setOpenEditDialog(true)
  }

  const handleCloseEditDialog = () => {
    // First, close the dialog immediately for better UX
    setOpenEditDialog(false)

    // Then update the URL if router is ready
    if (router.isReady) {
      // Set flag to prevent re-processing this URL change
      isUpdatingUrlRef.current = true

      // Remove the editId from URL when closing while preserving other query params
      const { editId, ...restQuery } = router.query

      // Update URL
      router.push({ pathname: router.pathname, query: restQuery }, undefined, { shallow: true }).then(() => {
        // Reset flag after URL update is complete
        setTimeout(() => {
          isUpdatingUrlRef.current = false
        }, 100)
      })
    }

    // Reset the form
    formik.resetForm()
  }

  const handleOpenViewDialog = (item) => {
    setSelectedItem(item)
    setOpenViewDialog(true)
  }

  const handleCloseViewDialog = () => {
    // Close dialog immediately
    setOpenViewDialog(false)
  }

  const handleOpenDeleteDialog = (item, updateUrl = true) => {
    setSelectedItem(item)

    // Update URL with the item ID only if updateUrl is true
    if (updateUrl && router.isReady) {
      const itemId = item.id || item._id

      // Set flag to prevent re-processing this URL change
      isUpdatingUrlRef.current = true

      // Preserve existing query parameters
      const newQuery = { ...router.query, deleteId: itemId }
      // Remove editId if it exists to avoid confusion
      delete newQuery.editId

      // Update URL
      router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true }).then(() => {
        // Reset flag after URL update is complete
        setTimeout(() => {
          isUpdatingUrlRef.current = false
        }, 100)
      })
    }

    // Open dialog immediately
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    // First, close the dialog immediately for better UX
    setOpenDeleteDialog(false)

    // Then update the URL if router is ready
    if (router.isReady) {
      // Set flag to prevent re-processing this URL change
      isUpdatingUrlRef.current = true

      // Remove the deleteId from URL when closing while preserving other query params
      const { deleteId, ...restQuery } = router.query

      // Update URL
      router.push({ pathname: router.pathname, query: restQuery }, undefined, { shallow: true }).then(() => {
        // Reset flag after URL update is complete
        setTimeout(() => {
          isUpdatingUrlRef.current = false
        }, 100)
      })
    }
  }

  const handleConfirmDelete = () => {
    // Get the ID from the selected item (handle both id and _id)
    const itemId = selectedItem.id || selectedItem._id
    console.log("Deleting item with ID:", itemId)

    // Close dialog first for better UX
    setOpenDeleteDialog(false)

    // Then call delete function
    onDelete(itemId)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setFilterAnchorEl(null)
  }

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => {
      const currentValues = [...prev[filterType]]
      const valueIndex = currentValues.indexOf(value)

      if (valueIndex === -1) {
        currentValues.push(value)
      } else {
        currentValues.splice(valueIndex, 1)
      }

      return {
        ...prev,
        [filterType]: currentValues,
      }
    })
  }

  const handleClearFilters = () => {
    setSelectedFilters({
      material: [],
      flameAdhesive: [],
    })
  }

  const getFlameAdhesiveChipColor = (type) => {
    switch (type) {
      case "Flame":
        return "error"
      case "Adhesive":
        return "primary"
      default:
        return "default"
    }
  }

  const isFiltersApplied = selectedFilters.material.length > 0 || selectedFilters.flameAdhesive.length > 0
  const handleExportToExcel = () => {
    if (filteredData.length === 0) {
      alert("No data to export.")
      return
    }

    // Map your data into a simple array of objects
    const exportData = filteredData.map((row) => ({
      Material: row.material,
      T1: row.t1,
      "Material Description": row.materialDescription,
      "Flame / Adhesive": row.flameAdhesive,
      Colorway: row.colorway,
      Width: row.width,
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Production Data")

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const data = new Blob([excelBuffer], { type: "application/octet-stream" })

    saveAs(data, `Production_Data_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }
  return (
    // Modified container to ensure full width
    <Box sx={{ width: "100%", maxWidth: "100%" }} className="production-table-container">
      <div className="table-toolbar">
        {/* Improved search field */}
        <TextField
          placeholder="Search by material, description, colorway..."
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            "& .MuiInputBase-input": {
              color: "#000", // user input text
              "&::placeholder": {
                color: "#888", // placeholder text
                opacity: 1, // override MUI default opacity
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#888" }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleExportToExcel}
          style={{ marginLeft: "10px", height: "40px" }}
        >
          Export
        </Button>
        <Divider />
        <Divider />
      </div>

      {/* Modified table container to ensure full width */}
      <StyledTableContainer component={Paper} className="table-wrapper">
        <Table stickyHeader aria-label="production data table">
          <TableHead>
            <TableRow>
              <TableCell>Material</TableCell>
              <TableCell>T1</TableCell>
              <TableCell>Material Description</TableCell>
              <TableCell>Flame / Adhesive</TableCell>
              <TableCell>Colorway</TableCell>
              <TableCell>Width</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <StyledTableRow key={row.id || row._id} className="table-row">
                  <TableCell>{row.material}</TableCell>
                  <TableCell>{row.t1}</TableCell>
                  <TableCell>{row.materialDescription}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.flameAdhesive}
                      size="small"
                      color={getFlameAdhesiveChipColor(row.flameAdhesive)}
                      className="flame-adhesive-chip"
                    />
                  </TableCell>
                  <TableCell>{row.colorway}</TableCell>
                  <TableCell>{row.width}</TableCell>
                  <TableCell align="center" className="action-cell">
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleOpenViewDialog(row)} className="action-button view">
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {isAdmin && (
                      <>
                        <Tooltip title="Edit Record">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditDialog(row)}
                            className="action-button edit"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Record">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDeleteDialog(row)}
                            className="action-button delete"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" className="no-data">
                  {searchTerm || isFiltersApplied
                    ? "No matching records found. Try adjusting your search or filters."
                    : "No production data available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
        className="edit-dialog"
        disableEscapeKeyDown={false}
      >
        <DialogTitle className="dialog-title">
          <Typography variant="h6" color="#2752e7">
            Edit Production Record {selectedItem ? `#${selectedItem.id || selectedItem._id}` : ""}
          </Typography>
          <IconButton
            onClick={handleCloseEditDialog}
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

        <Divider />

        <form onSubmit={formik.handleSubmit}>
          <DialogContent className="dialog-content">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  id="material"
                  name="material"
                  label="Material"
                  value={formik.values.material}
                  onChange={formik.handleChange}
                  error={formik.touched.material && Boolean(formik.errors.material)}
                  helperText={formik.touched.material && formik.errors.material}
                  className="form-field"
                  sx={{
                    input: { color: "#000" },
                    label: { color: "#000" },
                    "& .MuiFormHelperText-root": { color: "#d32f2f" },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  id="t1"
                  name="t1"
                  label="T1"
                  value={formik.values.t1}
                  onChange={formik.handleChange}
                  error={formik.touched.t1 && Boolean(formik.errors.t1)}
                  helperText={formik.touched.t1 && formik.errors.t1}
                  className="form-field"
                  sx={{
                    input: { color: "#000" },
                    label: { color: "#000" },
                    "& .MuiFormHelperText-root": { color: "#d32f2f" },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  id="materialDescription"
                  name="materialDescription"
                  label="Material Description"
                  value={formik.values.materialDescription}
                  onChange={formik.handleChange}
                  error={formik.touched.materialDescription && Boolean(formik.errors.materialDescription)}
                  helperText={formik.touched.materialDescription && formik.errors.materialDescription}
                  className="form-field"
                  sx={{
                    input: { color: "#000" },
                    label: { color: "#000" },
                    "& .MuiFormHelperText-root": { color: "#d32f2f" },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  margin="dense"
                  error={formik.touched.flameAdhesive && Boolean(formik.errors.flameAdhesive)}
                  className="form-field"
                >
                  <InputLabel id="edit-flame-adhesive-label" sx={{ color: "#000" }}>
                    Flame / Adhesive
                  </InputLabel>
                  <Select
                    labelId="edit-flame-adhesive-label"
                    id="flameAdhesive"
                    name="flameAdhesive"
                    value={formik.values.flameAdhesive}
                    onChange={formik.handleChange}
                    label="Flame / Adhesive"
                    sx={{ color: "#000" }}
                  >
                    {flameAdhesiveOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.flameAdhesive && formik.errors.flameAdhesive && (
                    <Typography variant="caption" color="error">
                      {formik.errors.flameAdhesive}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  id="colorway"
                  name="colorway"
                  label="Colorway"
                  value={formik.values.colorway}
                  onChange={formik.handleChange}
                  error={formik.touched.colorway && Boolean(formik.errors.colorway)}
                  helperText={formik.touched.colorway && formik.errors.colorway}
                  className="form-field"
                  sx={{
                    input: { color: "#000" },
                    label: { color: "#000" },
                    "& .MuiFormHelperText-root": { color: "#d32f2f" },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  id="width"
                  name="width"
                  label="Width"
                  type="text"
                  value={formik.values.width}
                  onChange={formik.handleChange}
                  error={formik.touched.width && Boolean(formik.errors.width)}
                  helperText={formik.touched.width && formik.errors.width}
                  className="form-field"
                  sx={{
                    input: { color: "#000" },
                    label: { color: "#000" },
                    "& .MuiFormHelperText-root": { color: "#d32f2f" },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <Divider />

          <DialogActions className="dialog-actions">
            <Button onClick={handleCloseEditDialog} className="cancel-button">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" className="save-button">
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
        className="view-dialog"
        disableEscapeKeyDown={false}
      >
        <DialogTitle className="dialog-title">
          <Typography variant="h6" color="#2752e7">
            Production Record Details {selectedItem ? `#${selectedItem.id || selectedItem._id}` : ""}
          </Typography>
          <IconButton onClick={handleCloseViewDialog} className="close-button">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent className="dialog-content view-dialog-content">
          {selectedItem && (
            <Grid container spacing={3} className="detail-grid">
              <Grid item xs={12} md={6} className="detail-item">
                <Typography variant="subtitle2" color="primary" className="detail-label">
                  Material
                </Typography>
                <Typography variant="body1" className="detail-value highlight-value">
                  {selectedItem.material}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6} className="detail-item">
                <Typography variant="subtitle2" className="detail-label">
                  T1
                </Typography>
                <Typography variant="body1" className="detail-value highlight-value">
                  {selectedItem.t1}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6} className="detail-item">
                <Typography variant="subtitle2" className="detail-label">
                  Material Description
                </Typography>
                <Typography variant="body1" className="detail-value highlight-value">
                  {selectedItem.materialDescription}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6} className="detail-item">
                <Typography variant="subtitle2" className="detail-label">
                  Flame / Adhesive
                </Typography>
                <Chip
                  label={selectedItem.flameAdhesive}
                  size="small"
                  color={getFlameAdhesiveChipColor(selectedItem.flameAdhesive)}
                  className="flame-adhesive-chip detail-chip"
                />
              </Grid>

              <Grid item xs={12} md={6} className="detail-item">
                <Typography variant="subtitle2" className="detail-label">
                  Colorway
                </Typography>
                <Typography variant="body1" className="detail-value highlight-value">
                  {selectedItem.colorway}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6} className="detail-item">
                <Typography variant="subtitle2" className="detail-label">
                  Width
                </Typography>
                <Typography variant="body1" className="detail-value highlight-value">
                  {selectedItem.width}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <Divider />

        <DialogActions className="dialog-actions view-dialog-actions">
          <Button onClick={handleCloseViewDialog} className="cancel-button">
            Close
          </Button>
          {isAdmin && (
            <>
              <Button
                onClick={() => {
                  handleCloseViewDialog()
                  handleOpenEditDialog(selectedItem)
                }}
                className="edit-button"
                variant="contained"
                color="primary"
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  handleCloseViewDialog()
                  handleOpenDeleteDialog(selectedItem)
                }}
                className="delete-button"
                variant="contained"
                color="error"
              >
                Delete
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        className="delete-dialog"
        disableEscapeKeyDown={false}
      >
        <DialogTitle className="dialog-title">
          <Typography variant="h6" color="#2752e7">
            Confirm Delete
          </Typography>
          <IconButton
            onClick={handleCloseDeleteDialog}
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
        <Divider />
        <DialogContent className="dialog-content">
          <Typography className="delete-message">
            Are you sure you want to delete this production record? This action cannot be undone.
          </Typography>
          {/* {selectedItem && (
            <Box mt={3} p={2} bgcolor="rgba(0, 0, 0, 0.04)" borderRadius={1}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Material:
                  </Typography>
                  <Typography>{selectedItem.material}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    T1:
                  </Typography>
                  <Typography>{selectedItem.t1}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Material Description:
                  </Typography>
                  <Typography>{selectedItem.materialDescription}</Typography>
                </Grid>
              </Grid>
            </Box>
          )} */}
        </DialogContent>
        <Divider />
        <DialogActions className="dialog-actions">
          <Button onClick={handleCloseDeleteDialog} className="cancel-button">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" className="delete-button">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProductionTable
