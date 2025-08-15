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
import { createProject } from "../api/project.service";
import { useSnackbar } from "../context/SnackbarContext";

const AddProjectForm = ({ open, onClose, editMode, initialData }) => {
  const { token } = useAuth();

  const [managers, setManagers] = useState([]);
  const { showSnackbar } = useSnackbar();

  const emptyFormState = {
    projectName: "",
    department: "",
    projectManager: "",
    projectPartner: "",
    currentStage: "Ideation",
    milestone: {
      start: { planned: null, actual: null },
      brdSignOff: { planned: null, actual: null },
      designApproval: { planned: null, actual: null },
      uatSignOff: { planned: null, actual: null },
      deployment: { planned: null, actual: null },
    },
  };

  const [formData, setFormData] = useState(emptyFormState);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (milestoneKey, date, dateType) => {
    setFormData((prev) => ({
      ...prev,
      milestone: {
        ...prev.milestone,
        [milestoneKey]: {
          ...prev.milestone[milestoneKey],

          [dateType]: date ? dayjs(date).toDate() : null,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProject(formData, token);
      showSnackbar("Project created successfully!", "success");
      onClose();
    } catch (error) {
      console.error(error);
      showSnackbar(error.message, "error");
    }
  };

  const handleCancel = async (e) => {
    onClose();
    setFormData(emptyFormState);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const receivedData = await getUsers(token);
        setManagers(receivedData);
        console.log(managers);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="span">
          Add New Project
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
                value={formData.projectManager}
                onChange={handleChange}
              >
                {managers
                  .filter(
                    (manager) =>
                      manager.role === "admin" || manager.role === "superadmin"
                  )
                  .map((manager) => (
                    <MenuItem key={manager._id} value={manager._id}>
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
              <Box key={key} sx={{ mb: 1 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  {label}
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container spacing={2}>
                    <Grid xs={6}>
                      <DatePicker
                        label="Planned"
                        value={
                          formData.milestone[key]?.planned
                            ? dayjs(formData.milestone[key].planned)
                            : null
                        }
                        onChange={(date) =>
                          handleDateChange(key, date, "planned")
                        }
                        slotProps={{ textField: { fullWidth: true } }} // makes picker full width in its grid cell
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <DatePicker
                        label="Actual"
                        value={
                          formData.milestone[key]?.actual
                            ? dayjs(formData.milestone[key].actual)
                            : null
                        }
                        onChange={(date) =>
                          handleDateChange(key, date, "actual")
                        }
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Button
            variant="outlined"
            color="error"
            sx={{
              borderWidth: 2,
              "&:hover": { backgroundColor: "error.main", color: "white" },
            }}
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <ColourButton  type="submit" form="projects-form">
            Submit
          </ColourButton>
          
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectForm;
