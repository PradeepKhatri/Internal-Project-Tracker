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

// Kept the same colors
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
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const projects = await getProjects(token);
        
        // REWRITTEN: More concise logic using .reduce() to count stages
        const counts = projects.reduce((acc, project) => {
          if (project.currentStage && STAGES.includes(project.currentStage)) {
            acc[project.currentStage] = (acc[project.currentStage] || 0) + 1;
          }
          return acc;
        }, {});

        const chartData = STAGES.map((stage, idx) => ({
          id: idx,
          value: counts[stage] || 0,
          label: stage,
          color: STAGE_COLORS[idx],
        })).filter((d) => d.value > 0);

        setPieData(chartData);
      } catch (err) {
        console.error("Failed to fetch project stages:", err);
        setPieData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [token]);

  return (
    <Paper
      sx={{
        py: 3,
        px: { xs: 2, md: 3 },
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "rgba(355, 355, 355, 0.60)",
        backdropFilter: "blur(30px)",
        height: "100%", 
      }}
      elevation={5}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Projects by Stage
      </Typography>
      {loading ? (
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </Box>
      ) :  (
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
          height={400} 
          legend={{
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: 0,
          }}
          sx={{
            width: '100% !important',
          }}
        />
      )}
    </Paper>
  );
};

export default StageChart;