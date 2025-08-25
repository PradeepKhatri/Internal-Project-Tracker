import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const COMMENT_KEY = "dashboard_comment";

const DashboardComment = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";

  const [comment, setComment] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(COMMENT_KEY) || "";
    setComment(saved);
    setInput(saved);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setComment(input);
    localStorage.setItem(COMMENT_KEY, input);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        background: "#f5f5f5",
        borderRadius: 2,
        maxWidth: 700,
        margin: "0 auto",
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Dashboard Announcement
        </Typography>
        {isSuperAdmin ? (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Announcement"
              variant="outlined"
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              multiline
              minRows={2}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={input === comment}
            >
              Save
            </Button>
          </form>
        ) : null}
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="body1"
            sx={{
              color: comment ? "text.primary" : "text.secondary",
              fontStyle: comment ? "normal" : "italic",
            }}
          >
            {comment ? comment : "No announcement posted."}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default DashboardComment;
