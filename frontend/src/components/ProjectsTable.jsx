import {
  Box,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  tableCellClasses,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
} from "@mui/material";
import { lighten } from "@mui/system";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { getProjects } from "../api/project.service";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

const ProjectsTable = ({ projects }) => {
  const stageColors = {
    Ideation: "#D3D3D3",
    Requirement: "#2196F3",
    Development: "#FF5722",
    Testing: "#FFEB3B",
    UAT: "#9C27B0",
    "Go live": "#4CAF50",
  };

  const [selectedStages, setSelectedStages] = useState({});
  const navigate = useNavigate();

  const handleStageChange = (projectId, event) => {
    setSelectedStages({
      ...selectedStages,
      [projectId]: event.target.value,
    });
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
    },
  }));

  return (
    <div className="px-20">
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ alignItems: "center" }}>
              <StyledTableCell sx={{ fontWeight: "bold", fontSize: 17 }}>
                Project Name
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: "bold", fontSize: 17 }}>
                Manager
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: "bold", fontSize: 17 }}>
                Department
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: "bold", fontSize: 17 }}>
                Status
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: "bold", fontSize: 17 }}>
                Partner
              </StyledTableCell>
              <StyledTableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {projects.map((project, index) => (
              <TableRow
                key={project._id}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa",
                  transition: "background-color 0.2s ease",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row" sx={{ py: 1.5, fontSize: 15 }}>
                  {project.projectName}
                </TableCell>
                <TableCell component="th" scope="row" sx={{ py: 1.5, fontSize: 15 }}>
                  {project.projectManager && project.projectManager.name
                    ? project.projectManager.name
                    : "N/A"}
                </TableCell>
                <TableCell component="th" scope="row" sx={{ py: 1.5, fontSize: 15 }}>
                  {project.department}
                </TableCell>
                <TableCell component="th" scope="row" sx={{ py: 1.5, fontSize: 15 }}>
                  <Chip
                    variant="outlined"
                    label={project.currentStage}
                    sx={{
                      backgroundColor: lighten(
                        stageColors[project.currentStage] || "gray",
                        0.9
                      ),
                      color: stageColors[project.currentStage] || "gray",
                      borderColor: stageColors[project.currentStage] || "gray",
                      borderWidth: 1.5,
                      borderStyle: "solid",
                      padding: "4px 12px",
                    }}
                  />
                </TableCell>
                <TableCell component="th" scope="row" sx={{ py: 1.5, fontSize: 15 }}>
                  {project.projectPartner}
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" gap={2}>
                    <IconButton
                      component={RouterLink}
                      to={`/project-details/${project._id}`}
                      sx={{
                        backgroundColor: "#212121",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#333",
                        },
                      }}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProjectsTable;
