import express from "express";
import {
  CreateProject,
  GetProjectById,
  GetProjects,
  DeleteProject,
  UpdateProject,
} from "../controllers/project.controller.js";

const router = express.Router();

router.get("/projects", GetProjects);

router.post("/create-project", CreateProject);

router.get("/projects/:id", GetProjectById);

router.delete("/projects/:id", DeleteProject);

router.patch("/projects/:id", UpdateProject);

export default router;
