import express from "express";
import {
  CreateProject,
  GetProjectById,
  GetProjects,
  DeleteProject,
  UpdateProject,
  UploadProjectFiles,
  GetProjectFile,
  DeleteProjectFile
} from "../controllers/project.controller.js";
import { authenticate } from "../middlewares/user.middleware.js";
import {
  adminMiddleware,
  superadminMiddleware,
} from "../middlewares/role.middleware.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit
});


router.post("/projects/:id/upload", authenticate, upload.array("projectFiles", 10), UploadProjectFiles);
router.get("/projects/:projectId/files/:fileId", authenticate, GetProjectFile);
router.delete("/projects/:projectId/files/:fileId", authenticate, DeleteProjectFile);


router.get("/projects", authenticate, GetProjects);
router.post("/projects", authenticate, superadminMiddleware, CreateProject);
router.get("/projects/:id", authenticate, GetProjectById);
router.delete("/projects/:id", authenticate, superadminMiddleware, DeleteProject);
router.patch("/projects/:id", authenticate, adminMiddleware, UpdateProject);

export default router;
