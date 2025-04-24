"use client"

import { useState, useEffect } from "react"
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
  Menu,
  Checkbox,
  ListItemText,
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Clear as ClearIcon,
} from "@mui/icons-material"
import { useFormik } from "formik"
import * as yup from "yup"
import styled from "@emotion/styled"

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
  width: yup.number().positive("Width must be positive").required("Width is required"),
})

const ProductionTable = ({ data, isAdmin, onUpdate, onDelete }) => {
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

  const flameAdhesiveOptions = ["Flame", "Adhesive"]

  // Update filtered data when data, search term, or filters change
  useEffect(() => {
    let result = [...data]

    // Apply search filter
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

    // Apply material filter
    if (selectedFilters.material.length > 0) {
      result = result.filter((item) => selectedFilters.material.includes(item.material))
    }

    // Apply flame/adhesive filter
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
      onUpdate(selectedItem.id, values)
      handleCloseEditDialog()
    },
  })

  const handleOpenEditDialog = (item) => {
    setSelectedItem(item)
    formik.setValues({
      material: item.material || "",
      t1: item.t1 || "",
      materialDescription: item.materialDescription || "",
      flameAdhesive: item.flameAdhesive || "",
      colorway: item.colorway || "",
      width: item.width || "",
    })
    setOpenEditDialog(true)
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
    formik.resetForm()
  }

  const handleOpenViewDialog = (item) => {
    setSelectedItem(item)
    setOpenViewDialog(true)
  }

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false)
  }

  const handleOpenDeleteDialog = (item) => {
    setSelectedItem(item)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  const handleConfirmDelete = () => {
    onDelete(selectedItem.id)
    handleCloseDeleteDialog()
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

        {/* Filter button moved to right */}
        <Button
          startIcon={<FilterIcon />}
          variant="outlined"
          size="small"
          className={`filter-button ${isFiltersApplied ? "filter-active" : ""}`}
          onClick={handleFilterClick}
        >
          Filter {isFiltersApplied && `(${selectedFilters.material.length + selectedFilters.flameAdhesive.length})`}
        </Button>

        {/* Filter menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
          className="filter-menu"
        >
          <div className="filter-menu-header">
            <Typography variant="subtitle2">Filter Records</Typography>
            {isFiltersApplied && (
              <Button size="small" onClick={handleClearFilters} className="clear-filters-btn">
                Clear All
              </Button>
            )}
          </div>
          <Divider />

          <div className="filter-section">
            <Typography variant="body2" className="filter-section-title">
              Flame / Adhesive
            </Typography>
            {flameAdhesiveOptions.map((type) => (
              <div key={type} className="filter-option">
                <Checkbox
                  checked={selectedFilters.flameAdhesive.includes(type)}
                  onChange={() => handleFilterChange("flameAdhesive", type)}
                  size="small"
                />
                <ListItemText primary={type} />
              </div>
            ))}
          </div>

          <Divider />

          <div className="filter-menu-footer">
            <Button variant="contained" color="primary" onClick={handleFilterClose} fullWidth>
              Apply Filters
            </Button>
          </div>
        </Menu>
      </div>

      {/* Display active filters */}
      {isFiltersApplied && (
        <div className="active-filters">
          <Typography variant="body2" className="active-filters-title">
            Active Filters:
          </Typography>
          <div className="filter-chips">
            {selectedFilters.material.map((type) => (
              <Chip
                key={`material-${type}`}
                label={`Material: ${type}`}
                size="small"
                onDelete={() => handleFilterChange("material", type)}
                className="filter-chip"
              />
            ))}
            {selectedFilters.flameAdhesive.map((type) => (
              <Chip
                key={`flame-adhesive-${type}`}
                label={`Type: ${type}`}
                size="small"
                onDelete={() => handleFilterChange("flameAdhesive", type)}
                className="filter-chip"
              />
            ))}
          </div>
        </div>
      )}

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
                <StyledTableRow key={row.id} className="table-row">
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
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth className="edit-dialog">
        <DialogTitle className="dialog-title">
          <Typography variant="h6" color="#2752e7">
            Edit Production Record
          </Typography>
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
                  type="number"
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
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth className="view-dialog">
        <DialogTitle className="dialog-title">
          <Typography variant="h6" color="#2752e7">
            Production Record Details
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
                <Typography variant="subtitle2" className="detail-label">
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
            <Button
              onClick={() => {
                handleCloseViewDialog()
                handleOpenEditDialog(selectedItem)
              }}
              className="edit-button"
              variant="contained"
            >
              Edit
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} className="delete-dialog">
        <DialogTitle className="dialog-title">
          <Typography variant="h6" color="#2752e7">
            Confirm Delete
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent className="dialog-content">
          <Typography className="delete-message">
            Are you sure you want to delete this production record? This action cannot be undone.
          </Typography>
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
