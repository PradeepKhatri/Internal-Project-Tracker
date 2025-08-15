import axios from "axios";

const GET_PROJECTS_API = "http://localhost:5000/api/projects";
const ADD_PROJECTS_API = "http://localhost:5000/api/create-project";
const GET_SINGLE_PROJECT = "http://localhost:5000/api/projects";
const UPDATE_PROJECT = "http://localhost:5000/api/projects";

const getProjects = async (token) => {
  try {
    const response = await axios.get(GET_PROJECTS_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch projects.";
    throw new Error(errorMessage);
  }
};

const getProjectById = async (id, token) => {
  try {
    const response = await axios.get(`${GET_SINGLE_PROJECT}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch projects.";
    throw new Error(errorMessage);
  }
};

const createProject = async (FormData, token) => {
  try {
    await axios.post(ADD_PROJECTS_API, FormData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to create project.";
    throw new Error(errorMessage);
  }
};

const updateProject = async (FormData, token, id) => {
  try {
    const response = await axios.patch(`${UPDATE_PROJECT}/${id}`, FormData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to update project details.";
    throw new Error(errorMessage);
  }
};

const deleteProject = async (id, token) => {
  try {
    const response = await axios.delete(`${UPDATE_PROJECT}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to delete project.";
    throw new Error(errorMessage);
  }
};

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
