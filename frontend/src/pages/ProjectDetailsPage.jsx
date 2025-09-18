import React from "react";
import {
  Box,
  Button,
  Typography,
  Backdrop,
  CircularProgress,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogActions,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
} from "@mui/material";
import ColourButton from "../components/ColourButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  deleteFile,
  deleteProject,
  downloadFile,
  getFileUrl,
  getProjectById,
} from "../api/project.service";
import { useAuth } from "../context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import EditProjectForm from "../components/EditProjectForm";
import { useSnackbar } from "../context/SnackbarContext";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFilesButton from "../components/UploadFilesButton";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

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

  const [fileStates, setFileStates] = useState({});

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

  const handleFileClick = async (file) => {
    setFileStates((prev) => ({
      ...prev,
      [file.fileId]: { loading: true, error: false },
    }));
    try {
      const fileBlob = await downloadFile(
        project.projectId,
        file.fileId,
        token
      );
      const fileURL = URL.createObjectURL(fileBlob);
      window.open(fileURL, "_blank");
      setFileStates((prev) => ({
        ...prev,
        [file.fileId]: { loading: false, error: false },
      }));
    } catch (error) {
      console.error(error);
      setFileStates((prev) => ({
        ...prev,
        [file.fileId]: { loading: false, error: true },
      }));
    }
  };

  const handleDeleteFile = async (file) => {
    setFileStates((prev) => ({
      ...prev,
      [file.fileId]: { loading: true, error: false },
    }));
    try {
      await deleteFile(project.projectId, file.fileId, token);
      setProject((prev) => ({
        ...prev,
        files: prev.files.filter((f) => f.fileId !== file.fileId),
      }));
      setFileStates((prev) => ({
        ...prev,
        [file.fileId]: { loading: false, error: false },
      }));
      showSnackbar("File deleted", "success");
    } catch (error) {
      setFileStates((prev) => ({
        ...prev,
        [file.fileId]: { loading: false, error: true },
      }));
      showSnackbar(error?.message || "Failed to delete file.", "error");
    }
  };

  const handleUploadSuccess = async () => {
    try {
      const receivedData = await getProjectById(id, token);
      setProject(receivedData.project);
    } catch (error) {
      console.error("Failed to refresh project after upload", error);
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

  const milestones = [
    {
      label: "Start",
      plannedDate: project.milestoneStartPlanned,
      actualDate: project.milestoneStartActual,
    },
    {
      label: "BRD Sign-Off",
      plannedDate: project.milestoneBrdSignOffPlanned,
      actualDate: project.milestoneBrdSignOffActual,
    },
    {
      label: "Design Approval",
      plannedDate: project.milestoneDesignApprovalPlanned,
      actualDate: project.milestoneDesignApprovalActual,
    },
    {
      label: "UAT Sign-Off",
      plannedDate: project.milestoneUatSignOffPlanned,
      actualDate: project.milestoneUatSignOffActual,
    },
    {
      label: "Deployment",
      plannedDate: project.milestoneDeploymentPlanned,
      actualDate: project.milestoneDeploymentActual,
    },
  ];

  // UPDATED: Filter out new ID fields
  const filteredDetails = Object.entries(project).filter(
    ([key]) =>
      ![
        "projectId",
        "projectManagerId", // Exclude the raw ID
        "createdAt",
        "updatedAt",
        "milestoneStartPlanned",
        "milestoneStartActual",
        "milestoneBrdSignOffPlanned",
        "milestoneBrdSignOffActual",
        "milestoneDesignApprovalPlanned",
        "milestoneDesignApprovalActual",
        "milestoneUatSignOffPlanned",
        "milestoneUatSignOffActual",
        "milestoneDeploymentPlanned",
        "milestoneDeploymentActual",
        "projectName",
        "files",
      ].includes(key)
  );

  return (
    <div
      className="bg-cover bg-top bg-fixed min-h-screen flex flex-col"
      style={{
        backgroundImage:
          "url('https://cdn.properties.emaar.com/wp-content/uploads/2023/09/MicrosoftTeams-image-70-e1694072306832.jpg')",
      }}
    >
      <div
        className="flex flex-col"
        style={{
          padding: "40px 0",
          minHeight: "100vh",
          width: "100%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 10 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ColourButton
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              width: "fit-content",
              background: "rgba(33,33,33,0.85)",
              color: "#fff",
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: 2,
              mb: 2,
              "&:hover": {
                background: "#333",
                color: "#fff",
              },
            }}
          >
            Back
          </ColourButton>

          <Box
            sx={{
              px: { xs: 0, md: 10 },
              pt: 6,
              backgroundColor: "rgba(355, 355, 355, 0.50)",
              backdropFilter: "blur(50px)",
              borderRadius: 3,
              boxShadow: 2,
              mb: 4,
              transition: "background 0.2s",
            }}
          >
            {project && (
              <Stepper
                activeStep={Math.max(
                  0,
                  steps.indexOf(project.currentStage || "")
                )}
                alternativeLabel
                sx={{
                  pt: 5,
                  pb: 3,
                  mb: 2,
                }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel
                      StepIconProps={{
                        sx: {
                          "&.Mui-active": { color: "#388E3C" },
                          "&.Mui-completed": { color: "#388E3C" },
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}

            {/* Project Name */}
            <Typography
              component="h1"
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#212121",
                mb: 2,
                letterSpacing: 0.5,
                textShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {project.projectName}
            </Typography>

            {/* General Details */}
            <Grid
              container
              spacing={2}
              sx={{
                py: 5,
                px: { xs: 0, md: 0 },
              }}
            >
              {filteredDetails.map(([key, value]) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
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
                      bgcolor: "rgba(255,255,255,0.85)",
                      borderRadius: 2,
                      width: "100%",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      border: "1.5px solid #e0e0e0",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "rgba(245,245,245,0.95)",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        borderColor: "#bdbdbd",
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: "bold",
                        color: "text.secondary",
                        letterSpacing: 0.5,
                        textTransform: "capitalize",
                      }}
                    >
                      {fieldLabels[key] || key}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#212121",
                        fontWeight: 500,
                        mt: 0.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {typeof value === "object" && value !== null
                        ? value?.name || JSON.stringify(value)
                        : String(value)}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Uploaded Files */}
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                pt: 2,
                pb: 1,
                fontWeight: 700,
                color: "#212121",
                letterSpacing: 0.5,
                textShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              Uploaded Files:
            </Typography>

            {project.files && project.files.length > 0 ? (
              <List
                sx={{ bgcolor: "background.paper", borderRadius: "8px", mt: 2 }}
              >
                {project.files.map((file) => (
                  <ListItem
                    key={file._id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteFile(file)}
                        disabled={fileStates[file._id]?.loading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                    disablePadding
                  >
                    <ListItemButton
                      onClick={() => handleFileClick(file)}
                      disabled={fileStates[file._id]?.loading}
                    >
                      <ListItemIcon>
                        {fileStates[file._id]?.loading ? (
                          <CircularProgress size={24} />
                        ) : (
                          <PictureAsPdfIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={file.filename}
                        secondary={
                          fileStates[file._id]?.error ? "Download failed" : ""
                        }
                        secondaryTypographyProps={{ color: "error" }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography sx={{ mt: 2, color: "text.secondary" }}>
                No files have been uploaded for this project yet.
              </Typography>
            )}

            {/* Milestones */}
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                pt: 5,
                pb: 2,
                fontWeight: 700,
                color: "#212121",
                letterSpacing: 0.5,
                textShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              Milestones:
            </Typography>

            {milestones.map((milestone) => (
              <Box key={milestone.label} sx={{ mb: 2 }}>
                <Typography variant="h6">{milestone.label}:</Typography>
                <Grid sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, width: { xs: "100%", sm: "20%" } }}
                  >
                    <Typography variant="caption">Planned</Typography>
                    <Typography variant="body1">
                      {milestone.plannedDate
                        ? new Date(milestone.plannedDate).toLocaleDateString()
                        : "-"}
                    </Typography>
                  </Paper>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, width: { xs: "100%", sm: "20%" } }}
                  >
                    <Typography variant="caption">Actual</Typography>
                    <Typography variant="body1">
                      {milestone.actualDate
                        ? new Date(milestone.actualDate).toLocaleDateString()
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

              <UploadFilesButton projectId={id} refresh={handleUploadSuccess} />

              <Button
                variant="outlined"
                color="error"
                sx={{
                  borderWidth: 2,
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  background: "rgba(255,255,255,0.85)",
                  boxShadow: 1,
                  "&:hover": {
                    backgroundColor: "error.main",
                    color: "white",
                  },
                }}
                startIcon={<DeleteIcon />}
                onClick={handleDeleteDialogueOpen}
              >
                Delete
              </Button>
            </Box>
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
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "rgba(255,255,255,0.98)",
            boxShadow: 4,
            px: 2,
            py: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#d32f2f",
            fontSize: 22,
            letterSpacing: 0.5,
            pb: 0,
          }}
        >{`Delete Project - ${project.projectName}?`}</DialogTitle>
        <Typography
          sx={{ px: 3, color: "text.secondary", fontSize: 15, pt: 1 }}
        >
          This action cannot be undone.
        </Typography>
        <DialogActions sx={{ alignSelf: "center", py: 3 }}>
          <ColourButton
            onClick={handleDeleteDialogueClose}
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              background: "#212121",
              color: "#fff",
              px: 3,
              py: 1.2,
              boxShadow: 2,
              "&:hover": {
                background: "#333",
                color: "#fff",
              },
            }}
          >
            Cancel
          </ColourButton>
          <Button
            variant="contained"
            onClick={handleDeleteProject}
            color="error"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              py: 1.2,
              boxShadow: 2,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectDetailsPage;
