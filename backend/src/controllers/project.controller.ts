import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import Project from '../models/Project.js';
import sequelize from '../configs/database.js';
import { ProjectCategory, ProjectInvitation, ProjectMember, ProjectTags, User, ProjectExternalInvitation } from '../models/index.js';
import ProjectActivity from '../models/ProjectActivityLog.js';
import projectTags from '../models/ProjectTags.js';
import Task from '../models/Task.js';

export const getAllProjects = async (req:Request, res:Response, next: NextFunction) => {
    const userId = req.user!.id;

    const memberships = await ProjectMember.findAll({
        where: {
            user_id: userId,
            status: "active",
        },
        attributes: ["role"],
        include: [
            {
                model: Project,
                as: "project",
                required: true,
                include: [
                    {
                        model: ProjectCategory,
                        as: "category",
                        attributes: ["id", "category_name"],
                    },
                    {
                        model: projectTags,
                        as: "tags",
                        attributes: ["id", "tag_name"],
                    },
                ],
            },
        ],
    });

    const projects = memberships
        .filter((membership) => {
            const project = membership.project!;

            // Admins can see archived projects
            if (membership.role === "admin") {
                return true;
            }

            // Others cannot
            return project.status !== "archived";
        })
        .map((membership) => ({
            ...membership.project!.toJSON(),
            role: membership.role,
        }));

    res.status(200).json({
        success: true,
        projects,
    });
}

export const getProject = async (req:Request, res:Response, next: NextFunction) => {
    const { projectId } = req.params;

    const project = await Project.findByPk(Number(projectId), {
        include: [
            {
                model: Task,
                as: "tasks",
            },
        ],
    });

    res.status(200).json({
        success: true,
        data: project,
    });
}

export const getProjectMembers = async (req:Request, res:Response, next: NextFunction) => {
    const { projectId } = req.params;
    const members = await ProjectMember.findAll({
        where: {
            project_id: projectId,
        },
        attributes: ["status", "role", "joined_at"],
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "username", "email"],
            },
        ],
        order: [
            ["role", "ASC"],
            ["joined_at", "ASC"],
        ],
    });
    res.status(200).json({
        members,
    });
}

export const updateProject = async (req:Request, res:Response, next: NextFunction) => {
    const {projectId} = req.params
    const {status} = req.body
    await sequelize.transaction(async (transaction) => {
        await Project.update(
            { status },
            {
                where: {
                    id: projectId,
                },
                transaction,
            }
        );

        await ProjectActivity.create(
            {
                project_id: Number(projectId),
                user_id: Number(req.user!.id),
                action: "PROJECT_UPDATED",
                description: `Project status updated to "${status}".`,
            },
            { transaction }
        );
    });

    res.status(200).json({
        success: true,
        message: "Project updated successfully.",
    });
}

export const updateProjectMember = async (req:Request, res:Response, next: NextFunction) => {
    const { projectId, userId } = req.params;
    const { role, status } = req.body;

    const member = await ProjectMember.findOne({
        where: {
            project_id: projectId,
            user_id: userId,
        },
    });

    if (!member) {
        throw new AppError("Project member not found.", 404);
    }

    await sequelize.transaction(async (transaction) => {
    await member.update(
        {
            role,
            status,
        },
        { transaction }
    );

    await ProjectActivity.create(
        {
            project_id: Number(projectId),
            user_id: Number(req.user!.id),
            action: "MEMBER_UPDATED",
            description: `Updated member ${userId} with role '${role}' and status '${status}'`,
        },
        { transaction }
    );
});

    res.status(200).json({
        message: "Project member updated successfully.",
        member,
    });
}

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    const {
        title,
        description,
        category_id,
        status,
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
                owner_id: Number(req.user!.id),
                title,
                description,
                category_id,
                status,
            },
            { transaction }
        );
        
        await ProjectMember.create(
            {
                project_id: project.id,
                user_id: Number(req.user!.id),
                role: "admin",
                status: "active",
                joined_at: new Date(),
            },
            { transaction }
        );

        await ProjectActivity.create(
            {
                project_id: project.id,
                user_id: Number(req.user!.id),
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
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
        const { projectId } = req.params;

        const project = await Project.findByPk(Number(projectId)) as Project;

        await sequelize.transaction(async (transaction) => {
        await project.update(
            {
                status: "archived",
            },
            { transaction }
        );

        await ProjectActivity.create(
            {
                project_id: project.id,
                user_id: Number(req.user!.id),
                action: "PROJECT_ARCHIVED",
                description: `Archived project "${project.title}".`,
            },
            { transaction }
        );
    });

    res.status(200).json({
        success: true,
        message: "Project archived successfully.",
    });

};

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

export const getExternalProjectView = async (req:Request, res:Response, next: NextFunction) => {
    const token = req.params.token as string
    if(!token)
        throw new AppError("No token provided", 404)
    const project_external_invitations=await ProjectExternalInvitation.findByPk(token)
    if(!project_external_invitations)
    throw new AppError("Invalid Token", 400)
    const {project_id} = project_external_invitations.dataValues;
    
    const project = await Project.findByPk(Number(project_id), {
        include: [
            {
                model: Task,
                as: "tasks",
            },
        ],
    });

    if (!project) {
        res.status(404).json({
            success: false,
            message: "Project not found",
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: project,
    });
}
