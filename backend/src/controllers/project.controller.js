import { Project, User, ProjectFile } from "../models/index.js";

// GET all projects
const GetProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: {
        model: User,
        as: "projectManager",
        attributes: ["userId", "name", "email"],
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    res.status(200).json(projects);
  } catch (error) {
    console.log("Error fetching projects : ", error);
    res.status(500).json({ message: "Error getting projects" });
  }
};

// CREATE project (with file upload support)
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
      return res.status(400).send({ message: "Missing Required Fields!" });
    }

    const existingProject = await Project.findOne({ where: { projectName } });
    if (existingProject) {
      return res
        .status(409)
        .json({ message: "A project with this name already exists." });
    }

    const newProject = await Project.create({
      projectName,
      department,
      currentStage,
      projectPartner,
      projectManagerId: projectManager,
      milestoneStartPlanned: milestone.start.planned,
      milestoneStartActual: milestone.start.actual,
      milestoneBrdSignOffPlanned: milestone.brdSignOff.planned,
      milestoneBrdSignOffActual: milestone.brdSignOff.actual,
      milestoneDesignApprovalPlanned: milestone.designApproval.planned,
      milestoneDesignApprovalActual: milestone.designApproval.actual,
      milestoneUatSignOffPlanned: milestone.uatSignOff.planned,
      milestoneUatSignOffActual: milestone.uatSignOff.actual,
      milestoneDeploymentPlanned: milestone.deployment.planned,
      milestoneDeploymentActual: milestone.deployment.actual,
    });

    res.status(200).json({
      message: "Project Created Successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while creating project." });
  }
};

const GetProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id, {
      include: [
        {
          model: User,
          as: "projectManager",
          attributes: ["userId", "name", "email"],
        },
        {
          model: ProjectFile,
          as: "files",
          attributes: ["fileId", "filename", "contentType"],
        },
      ],
    });

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

    const deletedCount = await Project.destroy({
      where: { projectId: id },
    });

    if (deletedCount === 0) {
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

    if (updates.projectManager) {
      if (typeof updates.projectManager === 'object' && updates.projectManager !== null) {
        updates.projectManagerId = updates.projectManager.userId;
      } else {
        updates.projectManagerId = updates.projectManager;
      }
      delete updates.projectManager; 
    }

    const [updatedCount] = await Project.update(updates, {
      where: { projectId: id },
    });

    if (updatedCount === 0) {
      return res.status(404).send({ message: "Project Not Found" });
    }

    const updatedProject = await Project.findByPk(id);
    res.status(200).json({ message: "Project Updated Successfully", project: updatedProject });
  } catch (error) {
    if (error.original && error.original.message.includes('Conversion failed')) {
        return res.status(400).json({ message: "Invalid data format submitted. Please check the form fields." });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const UploadProjectFiles = async (req, res) => {
  try {
      const { id } = req.params;
      const project = await Project.findByPk(id);

      if (!project) {
          return res.status(404).json({ msg: "Project not found." });
      }

      if (!req.files || req.files.length === 0) {
          return res.status(400).json({ msg: "No files were uploaded." });
      }

      // Create a record in the ProjectFiles table for each uploaded file
      const filePromises = req.files.map(file => {
          return ProjectFile.create({
              filename: file.originalname,
              contentType: file.mimetype,
              fileData: file.buffer,
              projectId: project.projectId // Link the file to the project
          });
      });

      await Promise.all(filePromises);

      res.status(200).json({ msg: "Files uploaded successfully." });
  } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
  }
};

// NEW: Get a single project file
const GetProjectFile = async (req, res) => {
  try {
      const { projectId, fileId } = req.params;
      const file = await ProjectFile.findOne({
          where: {
              fileId: fileId,
              projectId: projectId
          }
      });

      if (!file) {
          return res.status(404).send("File not found.");
      }

      res.contentType(file.contentType);
      res.send(file.fileData);
  } catch (error) {
      console.error("Error retrieving file:", error);
      res.status(500).send("Server Error");
  }
};

// NEW: Delete a single project file
const DeleteProjectFile = async (req, res) => {
  try {
      const { projectId, fileId } = req.params;
      const deletedCount = await ProjectFile.destroy({
          where: {
              fileId: fileId,
              projectId: projectId
          }
      });

      if (deletedCount === 0) {
          return res.status(404).send("File not found.");
      }

      res.json({ msg: "File deleted successfully." });
  } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).send("Server Error");
  }
};

export {
  GetProjects,
  CreateProject,
  DeleteProject,
  GetProjectById,
  UpdateProject,
  UploadProjectFiles,
  GetProjectFile,
  DeleteProjectFile
};
