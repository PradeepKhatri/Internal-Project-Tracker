import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { getProjects } from "../api/project.service";
import { useAuth } from "../context/AuthContext";
import ProjectsTable from "../components/ProjectsTable";
import ColourButton from "../components/ColourButton";
import AddIcon from "@mui/icons-material/Add";
import AddProjectForm from "../components/AddProjectForm";
import { useSnackbar } from "../context/SnackbarContext";
import { Backdrop, CircularProgress } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useLocation } from "react-router-dom";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState("");

  const { token, user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const location = useLocation();

  const openForm = () => {
    if (!user || user.role !== "superadmin") {
      showSnackbar(
        "You do not have permission to perform this action.",
        "error"
      );
      return;
    }
    setIsFormOpen(true);
  };
  const closeForm = () => {
    fetchProjects();
    setIsFormOpen(false);
  };

  const fetchProjects = async () => {
    try {
      if (token) {
        setLoading(true);
        const projectData = await getProjects(token);
        setProjects(projectData);
      }
    } catch (err) {
      showSnackbar(err.message, "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    

    fetchProjects();
  }, []);

  return (
    <div
      className="bg-cover bg-top bg-fixed min-h-screen flex flex-col gap-10 px-3 sm:px-6 md:px-10 lg:px-20 py-6 sm:py-8 md:py-10"
      style={{
        backgroundImage:
          "url('https://cdn.properties.emaar.com/wp-content/uploads/2023/09/MicrosoftTeams-image-70-e1694072306832.jpg')",
      }}
    >
      {/* <div className="p-8 flex flex-col gap-10"> */}
      <div className="text-3xl font-medium flex lg:justify-between xl:justify-between sm:justify-around">
        <div className="flex items-center gap-3">
          <ColourButton
            startIcon={<HomeIcon />}
            onClick={() => (window.location.href = "/dashboard")}
            sx={{
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              paddingLeft: 3.5,
            }}
            aria-label="Go to Home"
          />
          <span className="text-3xl font-semibold text-gray-800">Projects</span>
        </div>
        <ColourButton startIcon={<AddIcon />} onClick={openForm}>
          {" "}
          Add Project
        </ColourButton>

        {isFormOpen && <AddProjectForm open={isFormOpen} onClose={closeForm} />}
      </div>

      <ProjectsTable projects={projects} stage={location.state?.stage} />
    </div>
  );
};

export default ProjectsPage;
