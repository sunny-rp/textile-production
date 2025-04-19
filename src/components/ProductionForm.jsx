"use client"
import { TextField, Button, Grid, MenuItem, FormControl, InputLabel, Select, FormHelperText } from "@mui/material"
import { useFormik } from "formik"
import * as yup from "yup"
// import "./productionForm.scss"

const validationSchema = yup.object({
  date: yup.date().required("Date is required"),
  productType: yup.string().required("Product type is required"),
  quantity: yup.number().positive("Quantity must be positive").required("Quantity is required"),
  unit: yup.string().required("Unit is required"),
  quality: yup.string().required("Quality is required"),
  machineId: yup.string().required("Machine ID is required"),
  supervisor: yup.string().required("Supervisor name is required"),
})

const ProductionForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      date: new Date().toISOString().split("T")[0],
      productType: "",
      quantity: "",
      unit: "meters",
      quality: "Standard",
      machineId: "",
      supervisor: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values)
      resetForm()
    },
  })

  const productTypes = ["Cotton Fabric", "Polyester Blend", "Silk", "Wool", "Linen", "Denim", "Nylon", "Rayon"]
  const qualityLevels = ["Premium", "Standard", "Economy"]
  const units = ["meters", "yards", "pieces", "kg"]

  return (
    <div className="production-form">
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
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

          <Grid item xs={12}>
            <FormControl
              fullWidth
              error={formik.touched.productType && Boolean(formik.errors.productType)}
              className="form-field"
            >
              <InputLabel id="product-type-label">Product Type</InputLabel>
              <Select
                labelId="product-type-label"
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
                <FormHelperText>{formik.errors.productType}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
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

          <Grid item xs={6}>
            <FormControl fullWidth error={formik.touched.unit && Boolean(formik.errors.unit)} className="form-field">
              <InputLabel id="unit-label">Unit</InputLabel>
              <Select
                labelId="unit-label"
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
              {formik.touched.unit && formik.errors.unit && <FormHelperText>{formik.errors.unit}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl
              fullWidth
              error={formik.touched.quality && Boolean(formik.errors.quality)}
              className="form-field"
            >
              <InputLabel id="quality-label">Quality</InputLabel>
              <Select
                labelId="quality-label"
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
                <FormHelperText>{formik.errors.quality}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
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

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth className="submit-button">
              Add Production Record
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default ProductionForm
