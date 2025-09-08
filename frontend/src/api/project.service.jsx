import axios from "axios";

const PROJECTS_API = "http://localhost:5000/api/projects";
const ADD_PROJECTS_API = "http://localhost:5000/api/create-project";
const GET_SINGLE_PROJECT = "http://localhost:5000/api/projects";


const uploadFile = async (id, formData, token) => {
  try {
    console.log("Inside Service: ", formData);
    const response = await axios.post(`${PROJECTS_API}/${id}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("After API call:", response);

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.msg ||
      "An unexpected error occurred during file upload.";
    throw new Error(errorMessage);
  }
};

const downloadFile = async (projectId, fileId, token) => {
  try {
    const response = await axios.get(`${PROJECTS_API}/${projectId}/files/${fileId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // This tells axios to handle the binary file data correctly
    });
    return response.data; // This will be the file blob
  } catch (error) {
    console.error("Error downloading file:", error);
    throw new Error("Could not download the file.");
  }
};

const deleteFile = async (projectId, fileId, token) => {
  try {
    console.log(fileId)
    const response = await axios.delete(`${PROJECTS_API}/${projectId}/files/${fileId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error(error.response?.data?.msg || "Could not delete the file.");
  }
};

const getFileUrl = async (id, fileId, token) => {
  // return `${UPLOAD_FILE}/${id}/files/${fileId}`;
  try {
    const response = await axios.get(`${UPLOAD_FILE}/${id}/files/${fileId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch document.";
    throw new Error(errorMessage);
  }
};

const getProjects = async (token) => {
  try {
    const response = await axios.get(PROJECTS_API, {
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
    const response = await axios.patch(`${PROJECTS_API}/${id}`, FormData, {
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
    const response = await axios.delete(`${PROJECTS_API}/${id}`, {
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
  uploadFile,
  downloadFile,
  deleteFile,
  getFileUrl
};
