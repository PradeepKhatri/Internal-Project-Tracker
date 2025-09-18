import { useState, useEffect } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { getLatestAnnouncement, deleteAnnouncement } from "../api/announcement.service";
import { useSnackbar } from "../context/SnackbarContext";
import CampaignIcon from "@mui/icons-material/Campaign";
import ColourButton from "./ColourButton";
import PublishForm from "./PublishForm";

const Announcement = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const openAnnouncementForm = () => {
    setIsFormOpen(true);
  };
  const closeAnnouncementForm = () => {
    setIsFormOpen(false);
  };

  const fetchAnnouncement = async () => {
    setLoading(true);
    try {
      if (token) {
        const data = await getLatestAnnouncement(token);
        setAnnouncement(data);
      }
    } catch (err) {
      console.error("Failed to fetch announcement", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncement();
    // eslint-disable-next-line
  }, [token]);

  const handleDelete = async () => {
    if (!token) return;
    try {
      await deleteAnnouncement(token);
      setAnnouncement(null);
      showSnackbar("Announcement deleted successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to delete announcement.", "error");
    }
  };

  if (loading) {
    return null;
  }

  if (!announcement && user.role === 'superadmin') {
    return (
      <div className="flex flex-col gap-5">
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <ColourButton
            onClick={openAnnouncementForm}
            sx={{ minWidth: "unset", px: 2 }}
          >
            New Announcement
          </ColourButton>
        </Box>
        {isFormOpen && (
          <PublishForm open={isFormOpen} onClose={closeAnnouncementForm} />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Paper
        sx={{
          py: 3,
          px: 6,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "rgba(355, 355, 355, 0.60)",
          backdropFilter: "blur(30px)",
        }}
        elevation={5}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <CampaignIcon sx={{ mr: 1.5, color: "black" }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
            Announcement
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
            width: "100%",
            fontSize: { xs: 16, sm: 18 },
            px: { xs: 1, sm: 2, md: 4 },
          }}
        >
          {announcement.content}
        </Typography>
      </Paper>
      {user && user.role === 'superadmin' && (
         <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1, gap: 2 }}>
         <Button variant="contained" onClick={handleDelete} color="error" sx={{
               fontWeight: 600,
               borderRadius: 2,
               px: 3,
               py: 1.2,
               boxShadow: 2,
             }}>
           Delete
         </Button>
         <ColourButton
           onClick={openAnnouncementForm}
           sx={{ minWidth: "unset", px: 2 }}
         >
           New Announcement
         </ColourButton>
       </Box>
      )}
     
      {isFormOpen && (
        <PublishForm
          open={isFormOpen}
          onClose={() => {
            closeAnnouncementForm();
            fetchAnnouncement();
          }}
        />
      )}
    </div>
  );
};

export default Announcement;
