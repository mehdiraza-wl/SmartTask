import type { Request, Response, NextFunction } from "express";
import { Project, Task } from "../models/index.js";
import { AppError } from "../utils/appError.js";

export const validateTaskId = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId,taskId } = req.params;

  if (!taskId) {
    return next();
  }
  const task = await Task.findOne({
      where: {
          id: taskId,
          project_id: projectId,
      },
  });

  if (!task) {
      throw new AppError("Task not found.", 404);
  }

  next();
}