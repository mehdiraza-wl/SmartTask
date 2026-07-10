import type { Request, Response, NextFunction } from "express";
import { Project } from "../models/index.js";
import { AppError } from "../utils/appError.js";

export const validateProjectId = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params;

  if (!projectId) {
    return next();
  }

  const project = await Project.findByPk(Number(projectId));

  if (!project) {
    throw new AppError("Project not found", 404)
  }
  next();
}