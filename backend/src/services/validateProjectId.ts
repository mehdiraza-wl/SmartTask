import type { Request, Response, NextFunction } from "express";
import { Project, ProjectMember } from "../models/index.js";
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

  const existingMember= await ProjectMember.findOne({
    where: {
      project_id: projectId,
      user_id: Number(req.user!.id),
      status: "active"
    }
  })
  if(!existingMember)
    throw new AppError("You are not part of this project.", 403)
  next();
}