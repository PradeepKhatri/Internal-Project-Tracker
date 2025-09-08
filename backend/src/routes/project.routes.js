import express from "express";
import {
  CreateProject,
  GetProjectById,
  GetProjects,
  DeleteProject,
  UpdateProject,
} from "../controllers/project.controller.js";
import { authenticate } from "../middlewares/user.middleware.js";
import {
  adminMiddleware,
  superadminMiddleware,
} from "../middlewares/role.middleware.js";
import Project from "../models/Project.model.js";
import multer from "multer";
import mongoose from "mongoose";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 16 * 1024 * 1024 }, // 16 MB limit
});

router.get(
  "/projects/:projectId/files/:fileId",
  authenticate,
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId);

      if (!project) {
        return res.status(404).send("Project not found.");
      }

      // Mongoose's .id() method is the perfect tool for finding a subdocument in an array
      const file = project.files.id(req.params.fileId);

      if (!file) {
        return res.status(404).send("File not found within the project.");
      }

      // Set the Content-Type header based on the stored MIME type (e.g., 'application/pdf')
      res.contentType(file.contentType);

      // Send the raw binary data (Buffer) as the response
      res.send(file.data);
    } catch (error) {
      console.error("Error retrieving file:", error);
      res.status(500).send("Server Error");
    }
  }
);

router.post(
  "/projects/:id/upload",
  authenticate,
  upload.array("projectFiles", 10),
  async (req, res) => {
    console.log("--- UPLOAD ROUTE HANDLER REACHED ---");
    try {
      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({ msg: "Project not found." });
      }

      // Check if req.files exists and has files
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ msg: "No files were uploaded." });
      }

      // Loop through all the files in req.files array
      req.files.forEach((file) => {
        const newFile = {
          filename: file.originalname,
          contentType: file.mimetype,
          data: file.buffer,
        };
        project.files.push(newFile);
      });

      // Save the project once after adding all new files
      await project.save();

      res
        .status(200)
        .json({
          msg: "Files uploaded and added to project successfully.",
          project,
        });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

router.delete(
  "/projects/:projectId/files/:fileId",
  authenticate,
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId);

      if (!project) {
        return res.status(404).send("Project not found.");
      }

      // Mongoose's .id() method is the perfect tool for finding a subdocument in an array
      const file = project.files.id(req.params.fileId);

      console.log("File id:", file);

      const updatedProject = await Project.findByIdAndUpdate(
        project,
        { $pull: { files: { _id: file } } },
        // { $pull: { files: { _id: new mongoose.Types.ObjectId(fileId) } } },
        { new: true }
      );

      if (!updatedProject) {
        return res.status(404).json({ msg: "Project not found." });
      }

      res.json({ msg: "File deleted successfully.", updatedProject });
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).send("Server Error");
    }
  }
);

// Get all projects
router.get("/projects", authenticate, GetProjects);

// Create a new project
router.post("/projects", authenticate, superadminMiddleware, CreateProject);

// Get a project by ID
router.get("/projects/:id", authenticate, GetProjectById);

// Delete a project by ID
router.delete(
  "/projects/:id",
  authenticate,
  superadminMiddleware,
  DeleteProject
);

// Update a project by ID
router.patch("/projects/:id", authenticate, adminMiddleware, UpdateProject);

export default router;
