import React, { useEffect, useState } from "react";
import {
  Box,
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
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";
import {
  getLatestAnnouncement,
  publishAnnouncement,
  deleteAnnouncement,
} from "../api/announcement.service";
import ColourButton from "./ColourButton";

const PublishForm = ({ open, onClose }) => {
  const [content, setContent] = useState("");
  const { user, token } = useAuth();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (token) {
      getLatestAnnouncement(token)
        .then((data) => {
          if (data) setContent(data.content);
        })
        .catch((err) => console.error(err));
    }
  }, [token]);

  const handlePublish = async () => {
    try {
      await publishAnnouncement(content, token);
      showSnackbar("Announcement published successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to publish announcement.", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAnnouncement(token);
      setContent("");
      showSnackbar("Announcement deleted successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to delete announcement.", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ alignSelf: "center", py: 4 }}>
        <Typography variant="h5" component="span" fontWeight={600}>
          Publish Announcement
        </Typography>
      </DialogTitle>

      <DialogContent>
        <form id="edit-user-form">
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Announcement Content"
              multiline
              rows={10}
              fullWidth
              value={content}
              onChange={(e) => setContent(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{
                mt: 0,
                mb: 0,
              }}
            />
          </Box>
        </form>
      </DialogContent>

      <DialogActions sx={{ alignSelf: "center", paddingY: 3 }}>
        <Button variant="contained" onClick={onClose} color="error">
          Cancel
        </Button>
        <ColourButton
          type="submit"
          form="edit-user-form"
          onClick={handlePublish}
        >
          Save
        </ColourButton>
      </DialogActions>
    </Dialog>
  );
};

export default PublishForm;
