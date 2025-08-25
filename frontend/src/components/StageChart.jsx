import { useEffect, useState } from "react";
import { Paper, Typography, CircularProgress, Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { getProjects } from "../api/project.service";
import { useAuth } from "../context/AuthContext";

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

const StageChart = () => {
  const { token } = useAuth();
  const [stageCounts, setStageCounts] = useState({});
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        setStageCounts({});
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProjects();
  }, [token]);

  const pieData = STAGES.map((stage, idx) => ({
    id: idx,
    value: stageCounts[stage] || 0,
    label: stage,
    color: STAGE_COLORS[idx],
  })).filter((d) => d.value > 0);

  return (
    <div className="w-1/2">
      <Paper
        sx={{
          py: 5,
          minWidth: 420,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        elevation={5}
      >
        <Typography variant="h5 " sx={{ mb: 4, fontWeight: "bold" }}>
          Projects by Stage
        </Typography>
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
        ) : pieData.length === 0 ? (
          <Typography >No project data available.</Typography>
        ) : (
          <PieChart
            series={[
              {
                data: pieData,
                color: (d) => d.data.color,
                highlightScope: { fade: "global", highlight: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
              },
            ]}
            width={320}
            height={320}
            legend={{ hidden: false }}
          />
        )}
      </Paper>
    </div>
  );
};

export default StageChart;
