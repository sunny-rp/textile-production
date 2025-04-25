"use client"
import { TextField, Button, Grid, MenuItem, FormControl, InputLabel, Select, FormHelperText } from "@mui/material"
import { useFormik } from "formik"
import * as yup from "yup"


const validationSchema = yup.object({
  material: yup.string().required("Material is required"),
  t1: yup.string().required("T1 is required"),
  materialDescription: yup.string().required("Material description is required"),
  flameAdhesive: yup.string().required("Flame / Adhesive is required"),
  colorway: yup.string().required("Colorway is required"),
  width: yup.number().positive("Width must be positive").required("Width is required"),
})

const ProductionForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      material: "",
      t1: "",
      materialDescription: "",
      flameAdhesive: "",
      colorway: "",
      width: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values)
      resetForm()
    },
  })

  return (
    <div className="production-form">
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              id="material"
              name="material"
              label="Material"
              value={formik.values.material}
              onChange={formik.handleChange}
              error={formik.touched.material && Boolean(formik.errors.material)}
              helperText={formik.touched.material && formik.errors.material}
              sx={{
                '& .MuiInputBase-input': {
                  color: 'black', 
                },
                '& .MuiInputLabel-root': {
                  color: '#808080', // Placeholder/label
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#2752e7', // Normal border
                  },
                  '&:hover fieldset': {
                    borderColor: '#2752e7', // Hover border
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2752e7', // Focused border
                  },
                  '&.Mui-error fieldset': {
                    borderColor: '#2752e7', // Error border (override default red)
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#d32f2f', // Keep error text red
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              id="t1"
              name="t1"
              label="T1"
              value={formik.values.t1}
              onChange={formik.handleChange}
              error={formik.touched.t1 && Boolean(formik.errors.t1)}
              helperText={formik.touched.t1 && formik.errors.t1}
              sx={{
                '& .MuiInputBase-input': {
                  color: 'black', // Input value
                },
                '& .MuiInputLabel-root': {
                  color: '#808080', // Placeholder/label
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#2752e7', // Normal border
                  },
                  '&:hover fieldset': {
                    borderColor: '#2752e7', // Hover border
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2752e7', // Focused border
                  },
                  '&.Mui-error fieldset': {
                    borderColor: '#2752e7', // Error border
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#d32f2f', // Keep error text red
                },
              }}
            />

          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              id="materialDescription"
              name="materialDescription"
              label="Material Description"
              value={formik.values.materialDescription}
              onChange={formik.handleChange}
              error={formik.touched.materialDescription && Boolean(formik.errors.materialDescription)}
              helperText={formik.touched.materialDescription && formik.errors.materialDescription}
              className="form-field"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl
              fullWidth
              error={formik.touched.flameAdhesive && Boolean(formik.errors.flameAdhesive)}
              className="form-field"
            >
              <InputLabel id="flame-adhesive-label">Flame / Adhesive</InputLabel>
              <Select
                labelId="flame-adhesive-label"
                id="flameAdhesive"
                name="flameAdhesive"
                value={formik.values.flameAdhesive}
                onChange={formik.handleChange}
                label="Flame / Adhesive"
                sx={{
                  width: '245px',
                  '& .MuiSelect-select': {
                    paddingLeft: "12px",
                    textAlign: "left",
                    color: "#000000",
                  },
                  '@media (max-width: 320px)': {
                    width: '224px',
                  }
                }}
              >
                <MenuItem value="Flame">Flame</MenuItem>
                <MenuItem value="Adhesive">Adhesive</MenuItem>
              </Select>
              <FormHelperText>{formik.touched.flameAdhesive && formik.errors.flameAdhesive}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              id="colorway"
              name="colorway"
              label="Colorway"
              value={formik.values.colorway}
              onChange={formik.handleChange}
              error={formik.touched.colorway && Boolean(formik.errors.colorway)}
              helperText={formik.touched.colorway && formik.errors.colorway}
              className="form-field"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              id="width"
              name="width"
              label="Width"
              type="number"
              value={formik.values.width}
              onChange={formik.handleChange}
              error={formik.touched.width && Boolean(formik.errors.width)}
              helperText={formik.touched.width && formik.errors.width}
              className="form-field"
            />
          </Grid>

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="submit-button"
            >
              Add Production Record
            </Button>
          </div>
        </Grid>
      </form>
    </div>
  )
}

export default ProductionForm
