import { Paper, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getProjects } from "../api/project.service";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";
import ColourButton from "./ColourButton";

function getMilestoneStatus(plannedDate, actualDate, today = new Date()) {
  if (!plannedDate) return { status: "unknown", color: "#9E9E9E" };

  const planned = new Date(plannedDate);
  planned.setHours(0, 0, 0, 0);

  if (actualDate) {
    return { status: "completed", color: "#4CAF50" };
  }

  const now = new Date(today);
  now.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((now - planned) / (1000 * 60 * 60 * 24));

  if (now <= planned) {
    // Not yet due, within 20 days window
    return { status: "upcoming", color: "#4CAF50" };
  } else if (diffDays > 0 && diffDays <= 15) {
    // Overdue but within 15 days
    return { status: "amber", color: "#FFC107" };
  } else if (diffDays > 15) {
    // Overdue more than 15 days
    return { status: "red", color: "#F44336" };
  }
  return { status: "unknown", color: "#9E9E9E" };
}

const DeadlineList = () => {
  const { token } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [milestonesWithStatus, setMilestonesWithStatus] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMilestones = async () => {
      setLoading(true);
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const windowEnd = new Date(today);
        windowEnd.setDate(today.getDate() + 20);
        windowEnd.setHours(23, 59, 59, 999);

        const projects = await getProjects(token);

        let allMilestones = [];

        projects.forEach((project) => {
          if (!project.milestone) return;
          Object.entries(project.milestone).forEach(
            ([milestoneName, milestoneData]) => {
              const planned = milestoneData.planned;
              const actual = milestoneData.actual;
              if (!planned) return;

              const plannedDate = new Date(planned);
              plannedDate.setHours(0, 0, 0, 0);

              // Only show milestones with planned date within the next 20 days or overdue
              if (
                (plannedDate >= today && plannedDate <= windowEnd) ||
                !actual
              ) {
                const { status, color } = getMilestoneStatus(
                  planned,
                  actual,
                  today
                );
                allMilestones.push({
                  projectId: project._id,
                  projectName: project.projectName,
                  milestone: {
                    name: milestoneName,
                    planned,
                    actual,
                  },
                  status,
                  color,
                  plannedDate,
                });
              }
            }
          );
        });

        allMilestones.sort((a, b) => {
          const statusOrder = {
            red: 0,
            amber: 1,
            upcoming: 2,
            completed: 3,
            unknown: 4,
          };
          if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
          }
          return a.plannedDate - b.plannedDate;
        });

        setMilestonesWithStatus(allMilestones);
      } catch (error) {
        showSnackbar("Error fetching projects approaching deadlines!", "error");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMilestones();
    }
  }, [token, showSnackbar]);

  return (
    <Box sx={{ width: "100%" }}>
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
          height: "78vh",
        //   overflowY: "auto",
        }}
        elevation={5}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Approaching Deadlines
        </Typography>

        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          {milestonesWithStatus.length === 0 ? (
            <Typography
              color="text.secondary"
              align="center"
              sx={{ fontWeight: 500 }}
            >
              All deadlines are up to date!
            </Typography>
          ) : (
            milestonesWithStatus.slice(0, 4).map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  backgroundColor: item.color,
                  fontSize: 13,
                  color:
                    item.status === "amber" || item.status === "red"
                      ? "white"
                      : "black",
                  borderStyle: "solid",
                  borderRadius: 2,
                  padding: "4px 12px",
                  p: 1,
                  mb: 1,
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  borderColor:
                    item.status === "amber"
                      ? "#FFA000"
                      : item.status === "red"
                      ? "#B71C1C"
                      : "#388E3C",
                  borderWidth: 1.5,
                }}
              >
                <span>
                  <span>Planned </span>
                  <span className="font-semibold capitalize">
                    {item.milestone.name}
                  </span>
                  <span> Date for </span>
                  <span className="underline">{item.projectName}</span>
                  {item.status === "amber" && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontWeight: 600,
                        display: "block",
                      }}
                    >
                      (Overdue)
                    </span>
                  )}
                  {item.status === "red" && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontWeight: 600,
                        display: "block",
                      }}
                    >
                      (Overdue &gt; 15 days)
                    </span>
                  )}
                </span>
                <span className="bg-white text-black rounded px-3 py-1 font-semibold shadow transition">
                  {item.milestone.planned
                    ? new Date(item.milestone.planned).toLocaleDateString()
                    : "Unknown date"}
                </span>
              </Box>
                
              
            ))
          )}

          
        </Box>

        {milestonesWithStatus.length > 4 && (
            <ColourButton onClick={() => window.location.href = "/deadlines"}>See More...</ColourButton>
          )}

        
        
      </Paper>
    </Box>
  );
};

export default DeadlineList;
