import React from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ColourButton from "./ColourButton";
import { getUsers } from "../api/user.service";
import { useAuth } from "../context/AuthContext";
import { createProject, updateProject } from "../api/project.service";
import { useSnackbar } from "../context/SnackbarContext";
import DeleteIcon from "@mui/icons-material/Delete";

const EditProjectForm = ({ open, onClose, initialData, projectId }) => {
  const { token } = useAuth();

  const [managers, setManagers] = useState([]);
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (milestoneKey, date, dateType) => {
    const fieldName = `milestone${milestoneKey.charAt(0).toUpperCase() + milestoneKey.slice(1)}${dateType.charAt(0).toUpperCase() + dateType.slice(1)}`;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: date ? dayjs(date).toDate() : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedResponse = await updateProject(formData, token, projectId);
      setFormData(updatedResponse.project);
      showSnackbar("Project Details Updated Successfully!", "success");
      onClose();
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const receivedData = await getUsers(token);
        setManagers(receivedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        projectManager: initialData.projectManager?.userId || initialData.projectManagerId || ''
      });
    }
  }, [initialData]);
  if (!formData) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ alignSelf: "center", py: 4 }}>
        <Typography variant="h5" component="span" fontWeight={600}>
          Edit Details for {formData.projectName}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <form id="projects-form" onSubmit={handleSubmit}>
          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid size={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="projectName"
                label="Project Name"
                name="projectName"
                autoFocus
                value={formData.projectName}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="department"
                label="Department"
                name="department"
                autoFocus
                value={formData.department}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                margin="normal"
                required
                select
                fullWidth
                id="projectManager"
                label="Project Manager"
                name="projectManager"
                value={formData.projectManager || ""} 
                onChange={handleChange}
              >
                {managers
                  .filter(
                    (manager) =>
                      manager.role === "admin" || manager.role === "superadmin"
                  )
                  .map((manager) => (
                    <MenuItem key={manager.userId} value={manager.userId}>
                      {manager.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid size={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="projectPartner"
                label="Project Partner"
                name="projectPartner"
                autoFocus
                value={formData.projectPartner}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={6}>
              <InputLabel id="demo-simple-select-label">
                Select Stage
              </InputLabel>
              <Select
                name="currentStage"
                labelId="select-stage"
                id="currentStage"
                required
                value={formData.currentStage}
                onChange={handleChange}
                label="Current Stage"
                defaultValue="Ideation"
              >
                <MenuItem value="Ideation">Ideation</MenuItem>
                <MenuItem value="Requirement">Requirement</MenuItem>
                <MenuItem value="Development">Development</MenuItem>
                <MenuItem value="Testing">Testing</MenuItem>
                <MenuItem value="UAT">UAT</MenuItem>
                <MenuItem value="Go live">Go live</MenuItem>
              </Select>
            </Grid>
            <Grid size={12} sx={{ paddingY: 3 }}>
              <Typography variant="h6">Milestone</Typography>
            </Grid>
            {[
              { key: "start", label: "Start Date" },
              { key: "brdSignOff", label: "BRD Signoff Date" },
              { key: "designApproval", label: "Design Approval Date" },
              { key: "uatSignOff", label: "UAT Signoff Date" },
              { key: "deployment", label: "Deployment Date" },
            ].map(({ key, label }) => (
              <Box key={key} sx={{ mb: 2, width: '100%' }}>
                <Typography variant="subtitle1" sx={{ mb: 3 }}>{label}</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Planned"
                        value={dayjs(formData[`milestone${key.charAt(0).toUpperCase() + key.slice(1)}Planned`] || null)}
                        onChange={(date) => handleDateChange(key, date, "planned")}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Actual"
                        value={dayjs(formData[`milestone${key.charAt(0).toUpperCase() + key.slice(1)}Actual`] || null)}
                        onChange={(date) => handleDateChange(key, date, "actual")}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              </Box>
            ))}
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ alignSelf: "center", paddingY: 3 }}>
        <Button variant="contained" onClick={onClose} color="error">
          Cancel
        </Button>
        <ColourButton type="submit" form="projects-form">
          Edit
        </ColourButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectForm;
