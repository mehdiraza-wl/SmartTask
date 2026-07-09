import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import Project from '../models/Project.js';
import sequelize from '../configs/database.js';
import { ProjectCategory, ProjectInvitation, ProjectMember, ProjectTags, User } from '../models/index.js';
import ProjectActivity from '../models/ProjectActivityLog.js';
import crypto from 'node:crypto';
import emailQueue from '../queues/email.queue.js';
import { Op } from 'sequelize';
import { use } from 'passport';

export const getAllProjects = (req:Request, res:Response, next: NextFunction) => {
    
}

export const getProject = (req:Request, res:Response, next: NextFunction) => {
}

export const getProjectMembers = (req:Request, res:Response, next: NextFunction) => {
}
export const updateProjectMember = (req:Request, res:Response, next: NextFunction) => {
}

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            title,
            description,
            category_id,
            status,
            owner_id,
            tags
        } = req.body;

        const project = await sequelize.transaction(async (transaction) => {

            const category = await ProjectCategory.findByPk(category_id, {
                transaction,
            });

            if (!category) {
                throw new AppError("Project category not found.", 500);
            }

            const project = await Project.create(
                {
                    owner_id,
                    title,
                    description,
                    category_id,
                    status,
                    start_date: new Date(),
                },
                { transaction }
            );

            await ProjectMember.create(
                {
                    project_id: project.id,
                    user_id: owner_id,
                    role: "admin",
                    status: "active",
                    joined_at: new Date(),
                },
                { transaction }
            );

            await ProjectActivity.create(
                {
                    project_id: project.id,
                    user_id: owner_id,
                    action: "PROJECT_CREATED",
                    description: `Created project "${project.title}"`,
                },
                { transaction }
            );

            if (tags?.length) {
            await ProjectTags.bulkCreate(
                tags.map((tag: string) => ({
                    project_id: project.id,
                    tag_name: tag.trim(),
                })),
                { transaction }
                );
            }

            return project;
        });

        res.status(201).json({
            message: "Project created successfully.",
            project,
        });

    } catch (error) {
        next(error);
    }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
        const { projectId } = req.params;

        const project = await Project.findByPk(Number(projectId));

        if (!project) {
            throw new AppError("Project not found.", 404);
        }

        await project.update({
            status: "archived",
        });

        res.status(200).json({
            success: true,
            message: "Project archived successfully.",
        });

};

export const sendProjectInvitation = async (req:Request, res:Response, next: NextFunction) => {
    const {project_id, invitedEmail, role} = req.body
    const existing = await ProjectInvitation.findOne({
        where: {
            project_id,
            invitedEmail,
            status: "pending",
            expiry: {
                [Op.gt]: new Date(),
            },
        },
    });
    if (existing) 
        throw new AppError("Invitation already sent.", 409);
    
    const inviteToken=crypto.randomBytes(20).toString("hex")
    const expiry=new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) //7 days expiry
    const projectInvitation=await ProjectInvitation.create({
        project_id,
        token: inviteToken,
        invitedEmail,
        role,
        expiry
    })
    await emailQueue.add({
        email: invitedEmail,
        subject: "Verification Code",
        message: `You can join the project using link: ${process.env.CLIENT_URL}/project/invite/${inviteToken}`,
});
    
}

export const acceptInvite = async (req:Request, res:Response, next: NextFunction) => {
        const { token } = req.params;
        const userId = req.user!.id;
        const userEmail = (await User.findByPk(userId, {
            attributes: ['email'],
            }))?.email;
        await sequelize.transaction(async (transaction) => {

            const invitation = await ProjectInvitation.findOne({
                where: { token },
                transaction,
            });

            if (!invitation) {
                throw new AppError("Invitation not found.", 404);
            }

            if (invitation.status !== "pending") {
                throw new AppError("Invitation has already been used.", 400);
            }

            if (invitation.expiry < new Date()) {
                throw new AppError("Invitation has expired.", 400);
            }

            if (invitation.invitedEmail !== userEmail) {
                throw new AppError("This invitation belongs to another account.", 403);
            }

            const existingMember = await ProjectMember.findOne({
                where: {
                    project_id: invitation.project_id,
                    user_id: userId,
                },
                transaction,
            });

            if (existingMember) {
                throw new AppError(
                    "You are already a member of this project.", 409
                );
            }

            await ProjectMember.create(
                {
                    project_id: invitation.project_id,
                    user_id: Number(userId),
                    role: invitation.role,
                    status: "active",
                    joined_at: new Date(),
                },
                { transaction }
            );

            await invitation.update(
                {
                    status: "accepted",
                },
                { transaction }
            );

            await ProjectActivity.create(
                {
                    project_id: invitation.project_id,
                    user_id: Number(userId),
                    action: "MEMBER_ADDED",
                    description: `${userEmail} joined the project.`,
                },
                { transaction }
            );
        });

        res.status(200).json({
            message: "Project joined successfully.",
        });
}

export const sendExternalInvitation = (req:Request, res:Response, next: NextFunction) => {
}

export const sendExternalProjectView = (req:Request, res:Response, next: NextFunction) => {
}

export const updateProject = (req:Request, res:Response, next: NextFunction) => {
}


export const removeProjectMember = (req:Request, res:Response, next: NextFunction) => {
}



