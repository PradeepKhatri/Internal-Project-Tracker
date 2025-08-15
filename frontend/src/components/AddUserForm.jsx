import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ColourButton from "./ColourButton";
import { createUser, updateUserDetail } from "../api/user.service";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";

const AddUserForm = ({ open, onClose, onSucces }) => {
  const { token } = useAuth();
  const { showSnackbar } = useSnackbar();

  const emptyFormState = {
    name: "",
    email: "",
    password: "12345",
    role: "viewer",
  };

  const [formData, setFormData] = useState(emptyFormState);

  const handleChange = (e) => {
    setFormData((prev)=>({...prev, [e.target.name]: e.target.value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData, token);
      onSucces();
      showSnackbar("User created successfully!", "success");
      onClose();
    } catch (error) {
    //   console.error(error);
      showSnackbar(error.message, "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ alignSelf: "center", py: 4 }}>
        <Typography variant="h5" component="span" fontWeight={600}>
          Add New User
        </Typography>
      </DialogTitle>

      <DialogContent>
        <form id="add-user-form">
          <Grid container rowSpacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid size={12}>
              <InputLabel id="role-label" sx={{ mb: 1 }}>
                Role
              </InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={formData.role}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
              >
                <MenuItem value="viewer">Viewer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="superadmin">Superadmin</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ alignSelf: "center", paddingY: 3 }}>
        <Button variant="contained" onClick={onClose} color="error">
          Cancel
        </Button>
        <ColourButton type="submit" form="add-user-form" onClick={handleSubmit}>
          Add User
        </ColourButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserForm;
