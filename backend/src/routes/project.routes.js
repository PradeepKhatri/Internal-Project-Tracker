import express from "express";
import {
  CreateProject,
  GetProjectById,
  GetProjects,
  DeleteProject,
  UpdateProject,
} from "../controllers/project.controller.js";
import { authenticate } from "../middlewares/user.middleware.js";
import { adminMiddleware, superadminMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/projects", authenticate,  GetProjects);

router.post("/create-project", authenticate, superadminMiddleware, CreateProject);

router.get("/projects/:id", authenticate, GetProjectById);

router.delete("/projects/:id", authenticate, superadminMiddleware, DeleteProject);

router.patch("/projects/:id", authenticate, adminMiddleware, UpdateProject);

export default router;
