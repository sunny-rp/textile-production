"use client"

import { useState } from "react"
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
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
} from "@mui/icons-material"
import { useFormik } from "formik"
import * as yup from "yup"
import styled from "@emotion/styled"
// import "./productionTable.scss"

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: "600px",
  "& .MuiTableCell-head": {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
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

  const productTypes = ["Cotton Fabric", "Polyester Blend", "Silk", "Wool", "Linen", "Denim", "Nylon", "Rayon"]
  const qualityLevels = ["Premium", "Standard", "Economy"]
  const units = ["meters", "yards", "pieces", "kg"]

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

  return (
    <div className="production-table-container">
      <div className="table-toolbar">
        <div className="search-filter">
          <div className="search-box">
            <SearchIcon className="search-icon" />
            <input type="text" placeholder="Search records..." className="search-input" />
          </div>
          <Button startIcon={<FilterIcon />} variant="outlined" size="small" className="filter-button">
            Filter
          </Button>
        </div>
        <Button startIcon={<DownloadIcon />} variant="outlined" size="small" className="export-button">
          Export
        </Button>
      </div>

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
            {data.length > 0 ? (
              data.map((row) => (
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
                  No production data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth className="edit-dialog">
        <DialogTitle className="dialog-title">
          <Typography variant="h6">Edit Production Record</Typography>
          <IconButton onClick={handleCloseEditDialog} className="close-button">
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
                  id="date"
                  name="date"
                  label="Production Date"
                  type="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="form-field"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  margin="dense"
                  error={formik.touched.productType && Boolean(formik.errors.productType)}
                  className="form-field"
                >
                  <InputLabel id="edit-product-type-label">Product Type</InputLabel>
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
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  margin="dense"
                  error={formik.touched.unit && Boolean(formik.errors.unit)}
                  className="form-field"
                >
                  <InputLabel id="edit-unit-label">Unit</InputLabel>
                  <Select
                    labelId="edit-unit-label"
                    id="unit"
                    name="unit"
                    value={formik.values.unit}
                    onChange={formik.handleChange}
                    label="Unit"
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
                  <InputLabel id="edit-quality-label">Quality</InputLabel>
                  <Select
                    labelId="edit-quality-label"
                    id="quality"
                    name="quality"
                    value={formik.values.quality}
                    onChange={formik.handleChange}
                    label="Quality"
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
          <Typography variant="h6">Production Record Details</Typography>
          <IconButton onClick={handleCloseViewDialog} className="close-button">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent className="dialog-content">
          {selectedItem && (
            <Grid container spacing={3} className="detail-grid">
              <Grid item xs={12} md={6} className="detail-item">
                <Typography variant="subtitle2" className="detail-label">
                  Date
                </Typography>
                <Typography variant="body1" className="detail-value">
                  {selectedItem.date}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6} className="detail-item">
                <Typography variant="subtitle2" className="detail-label">
                  Product Type
                </Typography>
                <Typography variant="body1" className="detail-value">
                  {selectedItem.productType}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6} className="detail-item">
                <Typography variant="subtitle2" className="detail-label">
                  Quantity
                </Typography>
                <Typography variant="body1" className="detail-value">
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
                <Typography variant="body1" className="detail-value">
                  {selectedItem.machineId}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6} className="detail-item">
                <Typography variant="subtitle2" className="detail-label">
                  Supervisor
                </Typography>
                <Typography variant="body1" className="detail-value">
                  {selectedItem.supervisor}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <Divider />
        <DialogActions className="dialog-actions">
          <Button onClick={handleCloseViewDialog} className="close-button">
            Close
          </Button>
          {isAdmin && (
            <Button
              color="primary"
              onClick={() => {
                handleCloseViewDialog()
                handleOpenEditDialog(selectedItem)
              }}
              className="edit-button"
            >
              Edit
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} className="delete-dialog">
        <DialogTitle className="dialog-title">
          <Typography variant="h6">Confirm Delete</Typography>
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
    </div>
  )
}

export default ProductionTable
