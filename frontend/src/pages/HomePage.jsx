import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { getProjects } from "../api/project.service";
import { useAuth } from "../context/AuthContext";
import ProjectsTable from "../components/ProjectsTable";
import ColourButton from "../components/ColourButton";
import AddIcon from "@mui/icons-material/Add";
import AddProjectForm from "../components/AddProjectForm";
import { useSnackbar } from "../context/SnackbarContext";

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState('');

  const { token } = useAuth();
  const { showSnackbar} = useSnackbar();

  const openForm = () => { setIsFormOpen(true); }
  const closeForm = () => { setIsFormOpen(false); }


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (token) {
          setLoading(true);
          const projectData = await getProjects(token);
          setProjects(projectData);
        }
      } catch (err) {
        showSnackbar(err.message, 'Error');        
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  });

  return (
    <div className="p-8 flex flex-col gap-10">
      <div className="text-3xl font-medium flex justify-between px-20">
        <p>Projects</p>
        <ColourButton startIcon={<AddIcon />} onClick={openForm}> Add Project</ColourButton>

        {isFormOpen && <AddProjectForm open={isFormOpen} onClose={closeForm} />}
      </div>

      <ProjectsTable projects={projects} />  
    </div>
  );
};

export default HomePage;
