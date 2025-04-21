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
  date: yup.date().required("Date is required"),
  productType: yup.string().required("Product type is required"),
  quantity: yup.number().positive("Quantity must be positive").required("Quantity is required"),
  unit: yup.string().required("Unit is required"),
  quality: yup.string().required("Quality is required"),
  machineId: yup.string().required("Machine ID is required"),
  supervisor: yup.string().required("Supervisor name is required"),
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
    productType: [],
    quality: [],
  })

  const productTypes = ["Cotton Fabric", "Polyester Blend", "Silk", "Wool", "Linen", "Denim", "Nylon", "Rayon"]
  const qualityLevels = ["Premium", "Standard", "Economy"]
  const units = ["meters", "yards", "pieces", "kg"]

  // Update filtered data when data, search term, or filters change
  useEffect(() => {
    let result = [...data]

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter(
        (item) =>
          item.productType.toLowerCase().includes(searchLower) ||
          item.machineId.toLowerCase().includes(searchLower) ||
          item.supervisor.toLowerCase().includes(searchLower) ||
          item.date.includes(searchTerm) ||
          item.quantity.toString().includes(searchTerm),
      )
    }

    // Apply product type filter
    if (selectedFilters.productType.length > 0) {
      result = result.filter((item) => selectedFilters.productType.includes(item.productType))
    }

    // Apply quality filter
    if (selectedFilters.quality.length > 0) {
      result = result.filter((item) => selectedFilters.quality.includes(item.quality))
    }

    setFilteredData(result)
  }, [data, searchTerm, selectedFilters])

  const formik = useFormik({
    initialValues: {
      date: "",
      productType: "",
      quantity: "",
      unit: "",
      quality: "",
      machineId: "",
      supervisor: "",
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
      date: item.date,
      productType: item.productType,
      quantity: item.quantity,
      unit: item.unit,
      quality: item.quality,
      machineId: item.machineId,
      supervisor: item.supervisor,
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
      productType: [],
      quality: [],
    })
  }

  const getQualityChipColor = (quality) => {
    switch (quality) {
      case "Premium":
        return "success"
      case "Standard":
        return "primary"
      case "Economy":
        return "default"
      default:
        return "default"
    }
  }

  const isFiltersApplied = selectedFilters.productType.length > 0 || selectedFilters.quality.length > 0

  return (
    // Modified container to ensure full width
    <Box sx={{ width: "100%", maxWidth: "100%" }} className="production-table-container">
      <div className="table-toolbar">
        {/* Improved search field */}
        <TextField
          placeholder="Search by product, machine ID, supervisor..."
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            '& .MuiInputBase-input': {
              color: '#000', // user input text
              '&::placeholder': {
                color: '#888', // placeholder text
                opacity: 1,    // override MUI default opacity
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#888' }} />
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
          Filter {isFiltersApplied && `(${selectedFilters.productType.length + selectedFilters.quality.length})`}
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
              Product Type
            </Typography>
            {productTypes.map((type) => (
              <div key={type} className="filter-option">
                <Checkbox
                  checked={selectedFilters.productType.includes(type)}
                  onChange={() => handleFilterChange("productType", type)}
                  size="small"
                />
                <ListItemText primary={type} />
              </div>
            ))}
          </div>

          <Divider />

          <div className="filter-section">
            <Typography variant="body2" className="filter-section-title">
              Quality
            </Typography>
            {qualityLevels.map((quality) => (
              <div key={quality} className="filter-option">
                <Checkbox
                  checked={selectedFilters.quality.includes(quality)}
                  onChange={() => handleFilterChange("quality", quality)}
                  size="small"
                />
                <ListItemText primary={quality} />
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
            {selectedFilters.productType.map((type) => (
              <Chip
                key={`type-${type}`}
                label={`Type: ${type}`}
                size="small"
                onDelete={() => handleFilterChange("productType", type)}
                className="filter-chip"
              />
            ))}
            {selectedFilters.quality.map((quality) => (
              <Chip
                key={`quality-${quality}`}
                label={`Quality: ${quality}`}
                size="small"
                onDelete={() => handleFilterChange("quality", quality)}
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
              <TableCell>Date</TableCell>
              <TableCell>Product Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Quality</TableCell>
              <TableCell>Machine ID</TableCell>
              <TableCell>Supervisor</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <StyledTableRow key={row.id} className="table-row">
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.productType}</TableCell>
                  <TableCell>
                    {row.quantity} {row.unit}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.quality}
                      size="small"
                      color={getQualityChipColor(row.quality)}
                      className="quality-chip"
                    />
                  </TableCell>
                  <TableCell>{row.machineId}</TableCell>
                  <TableCell>{row.supervisor}</TableCell>
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
                  id="date"
                  name="date"
                  label="Production Date"
                  type="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  InputLabelProps={{ shrink: true }}
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
                  error={formik.touched.productType && Boolean(formik.errors.productType)}
                  className="form-field"
                >
                  <InputLabel id="edit-product-type-label" sx={{ color: "#000" }}>
                    Product Type
                  </InputLabel>
                  <Select
                    labelId="edit-product-type-label"
                    id="productType"
                    name="productType"
                    value={formik.values.productType}
                    onChange={formik.handleChange}
                    label="Product Type"
                  >
                    {productTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.productType && formik.errors.productType && (
                    <Typography variant="caption" color="error">
                      {formik.errors.productType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  id="quantity"
                  name="quantity"
                  label="Quantity"
                  type="number"
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                  helperText={formik.touched.quantity && formik.errors.quantity}
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
                  error={formik.touched.unit && Boolean(formik.errors.unit)}
                  className="form-field"
                >
                  <InputLabel id="edit-unit-label" sx={{ color: "#000" }}>
                    Unit
                  </InputLabel>
                  <Select
                    labelId="edit-unit-label"
                    id="unit"
                    name="unit"
                    value={formik.values.unit}
                    onChange={formik.handleChange}
                    label="Unit"
                    sx={{ color: "#000" }}
                  >
                    {units.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.unit && formik.errors.unit && (
                    <Typography variant="caption" color="error">
                      {formik.errors.unit}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  margin="dense"
                  error={formik.touched.quality && Boolean(formik.errors.quality)}
                  className="form-field"
                >
                  <InputLabel id="edit-quality-label" sx={{ color: "#000" }}>
                    Quality
                  </InputLabel>
                  <Select
                    labelId="edit-quality-label"
                    id="quality"
                    name="quality"
                    value={formik.values.quality}
                    onChange={formik.handleChange}
                    label="Quality"
                    sx={{ color: "#000" }}
                  >
                    {qualityLevels.map((quality) => (
                      <MenuItem key={quality} value={quality}>
                        {quality}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.quality && formik.errors.quality && (
                    <Typography variant="caption" color="error">
                      {formik.errors.quality}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  id="machineId"
                  name="machineId"
                  label="Machine ID"
                  value={formik.values.machineId}
                  onChange={formik.handleChange}
                  error={formik.touched.machineId && Boolean(formik.errors.machineId)}
                  helperText={formik.touched.machineId && formik.errors.machineId}
                  className="form-field"
                  sx={{
                    input: { color: "#000" },
                    label: { color: "#000" },
                    "& .MuiFormHelperText-root": { color: "#d32f2f" },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="dense"
                  id="supervisor"
                  name="supervisor"
                  label="Supervisor"
                  value={formik.values.supervisor}
                  onChange={formik.handleChange}
                  error={formik.touched.supervisor && Boolean(formik.errors.supervisor)}
                  helperText={formik.touched.supervisor && formik.errors.supervisor}
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
                  Date
                </Typography>
                <Typography variant="body1" className="detail-value highlight-value">
                  {selectedItem.date}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6} className="detail-item">
                <Typography variant="subtitle2" className="detail-label">
                  Product Type
                </Typography>
                <Typography variant="body1" className="detail-value highlight-value">
                  {selectedItem.productType}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6} className="detail-item">
                <Typography variant="subtitle2" className="detail-label">
                  Quantity
                </Typography>
                <Typography variant="body1" className="detail-value highlight-value">
                  {selectedItem.quantity} {selectedItem.unit}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6} className="detail-item">
                <Typography variant="subtitle2" className="detail-label">
                  Quality
                </Typography>
                <Chip
                  label={selectedItem.quality}
                  size="small"
                  color={getQualityChipColor(selectedItem.quality)}
                  className="quality-chip detail-chip"
                />
              </Grid>

              <Grid item xs={12} md={6} className="detail-item">
                <Typography variant="subtitle2" className="detail-label">
                  Machine ID
                </Typography>
                <Typography variant="body1" className="detail-value highlight-value">
                  {selectedItem.machineId}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6} className="detail-item">
                <Typography variant="subtitle2" className="detail-label">
                  Supervisor
                </Typography>
                <Typography variant="body1" className="detail-value highlight-value">
                  {selectedItem.supervisor}
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
