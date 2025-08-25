import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Divider,
  Backdrop,
  CircularProgress,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import ColourButton from "../components/ColourButton";
import Slide from "@mui/material/Slide";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteProject, getProjectById } from "../api/project.service";
import { useAuth } from "../context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import AddProjectForm from "../components/AddProjectForm";
import EditProjectForm from "../components/EditProjectForm";
import { useSnackbar } from "../context/SnackbarContext";
import DeleteIcon from "@mui/icons-material/Delete";

const ProjectDetailsPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { user, token } = useAuth();
  const [project, setProject] = useState(null);

  const { showSnackbar } = useSnackbar();

  const steps = [
    "Ideation",
    "Requirement",
    "Development",
    "Testing",
    "UAT",
    "Go live",
  ];

  const fieldLabels = {
    projectManager: "Project Manager",
    projectPartner: "Project Partner",
    department: "Department",
    currentStage: "Current Stage",
  };

  const handleBack = () => {
    setLoading(true);
    navigate(-1);
  };

  const [loading, setLoading] = useState(true);

  const [editFormOpen, setEditFormOpen] = useState(false);

  const [deleteDialogueOpen, setDeleteDialogueOpen] = useState(false);

  const handleEditOpen = () => {
    if (!user || user.role === "viewer") {
      showSnackbar(
        "You do not have permission to perform this action.",
        "error"
      );
      return;
    }
    setEditFormOpen(true);
  };
  const handleEditClose = () => setEditFormOpen(false);

  const handleDeleteDialogueOpen = () => {
    if (!user || user.role !== "superadmin") {
      showSnackbar(
        "You do not have permission to perform this action.",
        "error"
      );
      return;
    }
    setDeleteDialogueOpen(true);
  };
  const handleDeleteDialogueClose = () => setDeleteDialogueOpen(false);

  const handleEditCloseAndRefresh = async () => {
    setEditFormOpen(false);
    setLoading(true);
    try {
      const receivedData = await getProjectById(id, token);
      setProject(receivedData.project);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    setLoading(true);
    try {
      await deleteProject(id, token);
      setLoading(false);
      navigate("/projects");
      showSnackbar("Project deleted", "success");
    } catch (error) {
      setLoading(false);
      showSnackbar(error?.message || "Failed to delete project.", "error");
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const receivedData = await getProjectById(id, token);
        setProject(receivedData.project);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, token]);

  if (loading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const filteredDetails = Object.entries(project).filter(
    ([key]) =>
      ![
        "id",
        "_id",
        "createdAt",
        "updatedAt",
        "__v",
        "milestone",
        "projectName",
      ].includes(key)
  );

  const milestones = Object.entries(project.milestone || {});

  return (
    <>
      <div className="px-10 pt-5 flex flex-col gap-10 ">
        <ColourButton
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ width: "fit-content" }}
        >
          Back
        </ColourButton>

        {project && (
          <Stepper
            activeStep={Math.max(0, steps.indexOf(project.currentStage || ""))}
            alternativeLabel
            sx={{ py: 2 }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      "&.Mui-active": { color: "success .main" },
                      "&.Mui-completed": { color: "success.main" },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        <Box sx={{ paddingX: 10, paddingTop: 6 }}>
          {/* Project Name */}
          <Typography component="h1" variant="h3">
            {project.projectName}
          </Typography>

          {/* General Details */}
          <Grid container spacing={2} sx={{ py: 5 }}>
            {filteredDetails.map(([key, value]) => (
              <Grid
                size={6}
                key={key}
                sx={{
                  display: "flex",
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: "#f9fafb",
                    borderRadius: 2,
                    width: "80%",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "grey.100",
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", color: "text.secondary" }}
                  >
                    {fieldLabels[key] || key}
                  </Typography>
                  <Typography variant="body1">
                    {typeof value === "object" && value !== null
                      ? value?.name || JSON.stringify(value)
                      : String(value)}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Milestones */}
          <Typography variant="h4" gutterBottom sx={{ pt: 5, pb: 2 }}>
            Milestones:
          </Typography>

          {milestones.map(([key, data]) => (
            <Box key={key} sx={{ mb: 2 }}>
              {/* Milestone Label */}
              <Typography
                variant="h6"
                sx={{
                  textTransform: "capitalize",
                  mb: 1,
                  fontWeight: "bold",
                }}
              >
                {key}:
              </Typography>

              {/* Dates Row */}
              <Grid sx={{ display: "flex", gap: 2 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: "#f9fafb",
                    borderRadius: 2,
                    width: "20%",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", color: "text.secondary" }}
                  >
                    Planned
                  </Typography>
                  <Typography variant="body1">
                    {data.planned
                      ? new Date(data.planned).toLocaleDateString()
                      : "-"}
                  </Typography>
                </Paper>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: "#f9fafb",
                    borderRadius: 2,
                    width: "20%",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", color: "text.secondary" }}
                  >
                    Actual
                  </Typography>
                  <Typography variant="body1">
                    {data.actual
                      ? new Date(data.actual).toLocaleDateString()
                      : "-"}
                  </Typography>
                </Paper>
              </Grid>
            </Box>
          ))}

          <Box
            sx={{
              alignSelf: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              py: 7,
            }}
          >
            <ColourButton startIcon={<EditIcon />} onClick={handleEditOpen}>
              Edit
            </ColourButton>
            <Button
              variant="outlined"
              color="error"
              sx={{
                borderWidth: 2,
                "&:hover": { backgroundColor: "error.main", color: "white" },
              }}
              startIcon={<DeleteIcon />}
              onClick={handleDeleteDialogueOpen}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </div>

      {editFormOpen && (
        <EditProjectForm
          open={editFormOpen}
          onClose={handleEditCloseAndRefresh}
          initialData={project}
          projectId={id}
        />
      )}

      <Dialog
        open={deleteDialogueOpen}
        keepMounted
        onClose={handleDeleteDialogueClose}
      >
        <DialogTitle>{`Delete Project - ${project.projectName}?`}</DialogTitle>
        <Typography sx={{ px: 3, color: "text.secondary", fontSize: 14 }}>
          This action cannot be undone.
        </Typography>
        <DialogActions sx={{ alignSelf: "center", py: 3 }}>
          <ColourButton onClick={handleDeleteDialogueClose}>
            Cancel
          </ColourButton>
          <Button
            variant="contained"
            onClick={handleDeleteProject}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProjectDetailsPage;
