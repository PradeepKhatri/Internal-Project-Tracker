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
import { updateUserDetail } from "../api/user.service";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";

const EditUserForm = ({ open, onClose, user }) => {
  const { token } = useAuth();
  const { showSnackbar } = useSnackbar();

  // Only role is editable
  const [role, setRole] = useState("");

  const handleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedResponse = await updateUserDetail(
        { role },
        token,
        user._id
      );

      showSnackbar("User Role Updated!", "success");
      onClose();
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  useEffect(() => {
    if (user) {
      setRole(user.role || "");
    }
  }, [user]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ alignSelf: "center", py: 4 }}>
        <Typography variant="h5" component="span" fontWeight={600}>
          Edit Role of {user?.name || ""}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <form id="edit-user-form" onSubmit={handleSubmit}>
          <Grid container rowSpacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={user?.name || ""}
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
                value={role}
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
        <ColourButton type="submit" form="edit-user-form">
          Save
        </ColourButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserForm;
