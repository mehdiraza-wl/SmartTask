import ProjectMember from "../models/ProjectMember.js";
import { AppError } from "../utils/appError.js";
import type { Request, Response, NextFunction } from 'express';

ProjectMember
export const authorizeProjectRoles =
    (roles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { projectId } = req.params;
            const userId = req.user!.id;

            const member = await ProjectMember.findOne({
                where: {
                    project_id: projectId,
                    user_id: userId,
                    status: "active",
                },
            });

            if (!member) {
                throw new AppError("You are not a member of this project.", 403);
            }

            if (!roles.includes(member.role)) {
                throw new AppError("You do not have permission to perform this action.", 403);
            }

            next();

        } catch (error) {
            next(error);
        }
    };