import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { getProjects } from "../api/project.service";
import { useSnackbar } from "../context/SnackbarContext";

function getMilestoneStatus(plannedDate, actualDate, today = new Date()) {
  if (!plannedDate) return null; // Ignore milestones with no planned date

  const planned = new Date(plannedDate);
  planned.setHours(0, 0, 0, 0);
  const now = new Date(today);
  now.setHours(0, 0, 0, 0);

  if (actualDate) return { status: "completed", color: "#4CAF50" };

  const futureLimit = new Date(now);
  futureLimit.setDate(now.getDate() + 20);

  const diffDays = Math.floor((now - planned) / (1000 * 60 * 60 * 24));

  // Upcoming: Approaching in 20 days
  if (planned >= now && planned <= futureLimit) {
    return { status: "upcoming", color: "#4CAF50" };
  }
  
  // Overdue: Overdue up to 15 days
  if (diffDays > 0 && diffDays <= 15) {
    return { status: "overdue", color: "#FFC107" };
  }
  
  // Pending: Overdue for more than 15 days
  if (diffDays > 15) {
    return { status: "pending", color: "#F44336" };
  }

  // Any other date (e.g., > 20 days in future, or completed) is ignored
  return null;
}

const DeadLinesPage = () => {
  const { token } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [upcomingDates, setUpcomingDates] = useState([]);
  const [overdueDates, setOverdueDates] = useState([]);
  const [pendingDates, setPendingDates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchMilestones = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const projects = await getProjects(token);
        const upcoming = [];
        const overdue = [];
        const pending = [];

        const milestoneDefinitions = [
            { name: 'Start', plannedField: 'milestoneStartPlanned', actualField: 'milestoneStartActual' },
            { name: 'BRD Sign-Off', plannedField: 'milestoneBrdSignOffPlanned', actualField: 'milestoneBrdSignOffActual' },
            { name: 'Design Approval', plannedField: 'milestoneDesignApprovalPlanned', actualField: 'milestoneDesignApprovalActual' },
            { name: 'UAT Sign-Off', plannedField: 'milestoneUatSignOffPlanned', actualField: 'milestoneUatSignOffActual' },
            { name: 'Deployment', plannedField: 'milestoneDeploymentPlanned', actualField: 'milestoneDeploymentActual' },
        ];

        projects.forEach((project) => {
          milestoneDefinitions.forEach((milestoneDef) => {
            const planned = project[milestoneDef.plannedField];
            const actual = project[milestoneDef.actualField];
            
            const result = getMilestoneStatus(planned, actual, today);

            // UPDATED: Correctly categorize into the three lists
            if (result) {
              const milestoneObj = {
                projectId: project.projectId,
                projectName: project.projectName,
                milestone: { name: milestoneDef.name, planned, actual },
                status: result.status,
                color: result.color,
                plannedDate: new Date(planned),
              };

              if (result.status === "upcoming") upcoming.push(milestoneObj);
              else if (result.status === "overdue") overdue.push(milestoneObj);
              else if (result.status === "pending") pending.push(milestoneObj);
            }
          });
        });

        // UPDATED: Sorting logic to match new statuses
        const statusOrder = { pending: 0, overdue: 1, upcoming: 2 };
        const sortByStatusAndDate = (arr) => arr.sort((a, b) => {
            if (statusOrder[a.status] !== statusOrder[b.status]) return statusOrder[a.status] - statusOrder[b.status];
            return a.plannedDate - b.plannedDate;
        });

        setUpcomingDates(sortByStatusAndDate(upcoming));
        setOverdueDates(sortByStatusAndDate(overdue));
        setPendingDates(sortByStatusAndDate(pending));

      } catch (error) {
        showSnackbar("Error fetching project deadlines!", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, [token, showSnackbar]);


  const renderMilestoneBox = (item, borderColor, showOverdueLabel = false) => (
    <Box
      key={item.projectId + item.milestone.name + item.milestone.planned}
      sx={{
        backgroundColor: item.color,
        fontSize: 13,
        color: ["amber", "red"].includes(item.status) ? "white" : "black",
        borderStyle: "solid",
        borderRadius: 2,
        padding: "4px 12px",
        mb: 1,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        borderColor,
        borderWidth: 1.5,
        minWidth: 260,
      }}
    >
      <span>
        <span>Planned </span>
        <span className="font-semibold capitalize">{item.milestone.name}</span>
        <span> Date for </span>
        <span className="underline">{item.projectName}</span>
        {showOverdueLabel && item.status === "amber" && (
          <span style={{ marginLeft: 8, fontWeight: 600, display: "block" }}>
            (Overdue)
          </span>
        )}
        {showOverdueLabel && item.status === "red" && (
          <span style={{ marginLeft: 8, fontWeight: 600, display: "block" }}>
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
  );

  return (
    <div
      className="bg-cover bg-top bg-fixed min-h-screen flex flex-col"
      style={{
        backgroundImage:
          "url('https://cdn.properties.emaar.com/wp-content/uploads/2023/09/MicrosoftTeams-image-70-e1694072306832.jpg')",
      }}
    >
      <div className="h-[100vh] w-full backdrop-blur-lg flex flex-col items-center gap-2">
        <Typography
          variant="h4"
          sx={{ m: 4, fontWeight: "bold", color: "#fff" }}
        >
          Approaching Deadlines
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              minHeight: 200,
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: { xs: "flex-start", md: "space-around" },
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 3, md: 2 },
              flexWrap: "wrap",
              maxWidth: "1200px",
              margin: "0 auto",
              px: { xs: 1, md: 2 },
              py: 5,
              overflowY: "auto",
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE 10+
              "&::-webkit-scrollbar": {
                display: "none", // Chrome, Safari
              },
            }}
          >
            {/* Upcoming Column */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                py: 2,
                px: 2,
                minWidth: { xs: "100%", sm: 300, md: 0 },
                maxWidth: { xs: "100%", md: "32%" },
                background: "rgba(255,255,255,0.08)",
                borderRadius: 2,
                boxShadow: 2,
                //   overflowY: "auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#fff", mb: 1 }}
              >
                Upcoming
              </Typography>
              {upcomingDates.length === 0 ? (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ fontWeight: 500, color: "#fff" }}
                >
                  All deadlines are up to date!
                </Typography>
              ) : (
                upcomingDates.map((item) => renderMilestoneBox(item, "#388E3C"))
              )}
            </Box>

            {/* Overdue Column */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                py: 2,
                px: 2,
                minWidth: { xs: "100%", sm: 300, md: 0 },
                maxWidth: { xs: "100%", md: "32%" },
                background: "rgba(255,255,255,0.08)",
                borderRadius: 2,
                boxShadow: 2,
                overflowY: "auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#fff", mb: 1 }}
              >
                Overdue
              </Typography>
              {overdueDates.length === 0 ? (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ fontWeight: 500, color: "#fff" }}
                >
                  No overdue deadlines!
                </Typography>
              ) : (
                overdueDates.map((item) =>
                  renderMilestoneBox(
                    item,
                    item.status === "amber"
                      ? "#FFA000"
                      : item.status === "red"
                      ? "#B71C1C"
                      : "#388E3C",
                    true
                  )
                )
              )}
            </Box>

            {/* Pending/Other Column */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                py: 2,
                px: 2,
                minWidth: { xs: "100%", sm: 300, md: 0 },
                maxWidth: { xs: "100%", md: "32%" },
                background: "rgba(255,255,255,0.08)",
                borderRadius: 2,
                boxShadow: 2,
                overflowY: "auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#fff", mb: 1 }}
              >
                Pending/Other
              </Typography>
              {pendingDates.length === 0 ? (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ fontWeight: 500, color: "#fff" }}
                >
                  No pending or unknown deadlines!
                </Typography>
              ) : (
                pendingDates.map((item) => renderMilestoneBox(item, "#9E9E9E"))
              )}
            </Box>
          </Box>
        )}
      </div>
    </div>
  );
};

export default DeadLinesPage;
