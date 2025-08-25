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
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { lighten } from "@mui/system";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { getProjects } from "../api/project.service";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

const ProjectsTable = ({ projects, stage }) => {
  const stageColors = {
    Ideation: "#D3D3D3",
    Requirement: "#2196F3",
    Development: "#FF5722",
    Testing: "#FFEB3B",
    UAT: "#9C27B0",
    "Go live": "#4CAF50",
  };

  const [stageFilter, setStageFilter] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setStageFilter(e.target.value);
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

  // First filter by search, then by stage (if selected)
  const filteredProjects = projects
    .filter((project) => {
      const searchLower = search.toLowerCase();
      return (
        (project.projectName &&
          project.projectName.toLowerCase().includes(searchLower)) ||
        (project.projectManager &&
          project.projectManager.name &&
          project.projectManager.name.toLowerCase().includes(searchLower)) ||
        (project.department &&
          project.department.toLowerCase().includes(searchLower)) ||
        (project.projectPartner &&
          project.projectPartner.toLowerCase().includes(searchLower))
      );
    })
    .filter((project) => {
      if (!stageFilter) return true;
      return project.currentStage === stageFilter;
    });

  useEffect(() => {
    if (stage) {
      console.log("check");
      setStageFilter(stage);
    }
  }, []);

  return (
    <div className="px-20">
      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          borderRadius: 2,
          justifyContent: { xs: "stretch", sm: "flex-end" },
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search projects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flex: 1,
            minWidth: { xs: "100%", sm: 220 },
            maxWidth: 350,
            height: 48,
            borderRadius: 2,
            backgroundColor: "rgba(355, 355, 355, 0.60)",
            backdropFilter: "blur(30px)",
            "& .MuiInputBase-root": {
              height: 48,
              // boxSizing: "border-box",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        {/* <InputLabel id="select-stage-id">Select Stage</InputLabel> */}
        <Select
          name="stageFilter"
          labelId="select-stage-id"
          id="stageFilter"
          value={stageFilter}
          onChange={handleChange}
          // label="Select Stage"
          displayEmpty
          sx={{
            flex: 1,
            minWidth: { xs: "100%", sm: 220 },
            maxWidth: 350,
            height: 48,
            backgroundColor: "rgba(355, 355, 355, 0.60)",
            backdropFilter: "blur(30px)",
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              height: "48px",
              boxSizing: "border-box",
            },
          }}
        >
          <MenuItem value="">
            <p>All Stages</p>
          </MenuItem>
          <MenuItem value="Ideation">Ideation</MenuItem>
          <MenuItem value="Requirement">Requirement</MenuItem>
          <MenuItem value="Development">Development</MenuItem>
          <MenuItem value="Testing">Testing</MenuItem>
          <MenuItem value="UAT">UAT</MenuItem>
          <MenuItem value="Go live">Go live</MenuItem>
        </Select>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          overflow: "hidden",
          backgroundColor: "rgba(355, 355, 355, 0.60)",
            backdropFilter: "blur(70px)",
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
            {filteredProjects.map((project, index) => (
              <TableRow
                key={project._id}
                sx={{
                  // backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa",
                  
                  transition: "background-color 0.2s ease",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ py: 1.5, fontSize: 15 }}
                >
                  {project.projectName}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ py: 1.5, fontSize: 15 }}
                >
                  {project.projectManager && project.projectManager.name
                    ? project.projectManager.name
                    : "N/A"}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ py: 1.5, fontSize: 15 }}
                >
                  {project.department}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ py: 1.5, fontSize: 15 }}
                >
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
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ py: 1.5, fontSize: 15 }}
                >
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
