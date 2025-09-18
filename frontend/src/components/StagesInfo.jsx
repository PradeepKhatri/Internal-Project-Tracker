import { useEffect, useState } from "react";
import { Paper, Typography, Box, Grid, CircularProgress } from "@mui/material";
import { getProjects } from "../api/project.service";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const STAGES = [
  "Ideation",
  "Requirement",
  "Development",
  "Testing",
  "UAT",
  "Go live",
];

const STAGE_COLORS = [
  "#D3D3D3",
  "#2196F3",
  "#FF5722",
  "#FFEB3B",
  "#9C27B0",
  "#4CAF50",
];

const StagesInfo = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stageCounts, setStageCounts] = useState({});
  const [total, setTotal] = useState(0);

  const [stage, setStage] = useState("");

  const handleStageClick = (stage) => {
    navigate("/projects", { state: { stage } });
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const projects = await getProjects(token);
        const counts = {};
        STAGES.forEach((stage) => {
          counts[stage] = 0;
        });
        projects.forEach((project) => {
          if (
            project.currentStage &&
            counts.hasOwnProperty(project.currentStage)
          ) {
            counts[project.currentStage]++;
          }
        });
        setStageCounts(counts);
        setTotal(projects.length);
      } catch (err) {
        setStageCounts({});
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProjects();
  }, [token]);

  return (
    <Box sx={{ width: "100%", height: "80%" }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", rowGap: 3 }}>
          {/* Total Projects Box */}
          <Paper
            sx={{
              py: 3,
              backgroundColor: "rgba(355, 355, 355, 0.60)",
              backdropFilter: "blur(30px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 2,
              transition: "transform 0.18s cubic-bezier(.4,2,.6,1)",
              "&:hover": {
                transform: "translateY(-1px) ",
                boxShadow: 5,
              },
            }}
            elevation={4}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 1, color: "text.secondary" }}
            >
              Total Projects
            </Typography>
            <Typography
              variant="h3"
              sx={{ color: "grey.900", fontWeight: "bold" }}
            >
              {total}
            </Typography>
          </Paper>

          {/* Stage Boxes: 2 in a row */}
          <Grid container spacing={3}>
            {STAGES.map((stage, idx) => (
              <Grid size={4} key={stage}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: 2,
                    backgroundColor: "rgba(355, 355, 355, 0.60)",
                    backdropFilter: "blur(30px)",
                    transition: "transform 0.18s cubic-bezier(.4,2,.6,1)",
                    "&:hover": {
                      transform: "translateY(-1px) ",
                      boxShadow: 5,
                    },
                  }}
                  onClick={() => handleStageClick(stage)}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", color: "text.secondary" }}
                  >
                    {stage}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "grey.900", fontWeight: "bold" }}
                  >
                    {stageCounts[stage] || 0}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default StagesInfo;
