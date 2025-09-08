import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button } from "@mui/material";
import { useState } from "react";
import { uploadFile } from "../api/project.service";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ColouredButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.grey[900]),
  alignItems: "center",
  background: `linear-gradient(
      to bottom,
      ${theme.palette.grey[800]} 0%,
      ${theme.palette.grey[900]} 100%
    )`,
  padding: theme.spacing(1, 2), // vertical, horizontal padding
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius * 2, // more rounded
  textTransform: "none", // disable default uppercase
  boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.grey[700],
    transform: "translateY(-1px)",
    boxShadow: "0 5px 12px rgba(0,0,0,0.15)",
  },
  "&:active": {
    transform: "translateY(0)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
}));

const UploadFilesButton = ({ projectId, refresh }) => {
  const { token } = useAuth();

  const [uploadStatus, setUploadStatus] = useState("idle"); // 'idle', 'uploading', 'success', 'error'
  const [statusMessage, setStatusMessage] = useState("Upload files");

  const { showSnackbar } = useSnackbar();

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return; // No files selected
    }

    setUploadStatus("uploading");
    setStatusMessage("Uploading...");

    const formData = new FormData();

    // We use Promise.all to wait for all file uploads to complete
    Array.from(files).forEach((file) => {
      formData.append("projectFiles", file);
    });


    try {
      // Call the service function with all files in one request
      await uploadFile(projectId, formData, token);

      setUploadStatus("success");
      setStatusMessage("Upload successful!");
      showSnackbar("File Uploaded!");
      refresh();
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setStatusMessage(error.message || "Upload failed. Try again.");
    } finally {
      // Reset the button's state after 5 seconds
      setTimeout(() => {
        setUploadStatus("idle");
        setStatusMessage("Upload files");
      }, 3000);
    }
  };

  return (
    <ColouredButton
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      disabled={uploadStatus === "uploading"}
    >
      {statusMessage}
      <VisuallyHiddenInput type="file" onChange={handleFileChange} multiple />
    </ColouredButton>
  );
};

export default UploadFilesButton;
