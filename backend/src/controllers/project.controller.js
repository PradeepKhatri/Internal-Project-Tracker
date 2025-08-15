import Project from "../models/Project.model.js";
import mongoose from "mongoose";

const GetProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).populate('projectManager');

    if (!projects || projects.length === 0) {
      res.status(200).json({ message: "No projects to display" });
    }
    res.status(200).json(projects);
  } catch (error) {
    console.log("Error fetching projects : ", error);
    res.status(500).json({ message: "Error getting projects" });
  }
};

const CreateProject = async (req, res) => {
  try {
    const {
      projectName,
      department,
      milestone,
      currentStage,
      projectManager,
      projectPartner,
    } = req.body;

    if (!projectName || !department || !milestone || !projectManager) {
      res.status(400).send({ message: "Missing Required Fields!" });
    }

    const existingProject = await Project.findOne({ projectName });
    if (existingProject) {
      return res
        .status(409)
        .json({ message: "A project with this name already exists." });
    }

    const newProject = new Project({
      projectName,
      department,
      milestone,
      currentStage,
      projectManager,
      projectPartner,
    });

    const savedProject = await newProject.save();

    res.status(200).json({
      message: "Project Created Successfully",
      project: savedProject,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error creating project:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while creating project." });
  }
};

const GetProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID format." });
    }

    if (!id) {
      return res.status(400).json({ message: "Project ID is required." });
    }

    const project = await Project.findById(id).populate(
      "projectManager",
      "name email role"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    return res.status(200).json({ project });
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while fetching project." });
  }
};

const DeleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID format." });
    }

    if (!id) {
      return res.status(400).json({ message: "Project ID is required." });
    }

    const deleteProject = await Project.findByIdAndDelete(id);

    if (!deleteProject) {
      return res.status(404).json({ message: "Project Not Found" });
    }

    return res.status(200).send({ message: "Project Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting project : ", error);
    res
      .status(500)
      .send({ message: "Internal Server Error in deleting project" });
  }
};

const UpdateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID format." });
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedProject) {
      return res.status(404).send({ message: "Project Not Found" });
    }

    res.status(200).json({
      message: "Project Updated Successfully",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export {
  GetProjects,
  CreateProject,
  DeleteProject,
  GetProjectById,
  UpdateProject,
};
