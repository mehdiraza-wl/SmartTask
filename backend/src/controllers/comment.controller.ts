import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import sequelize from '../configs/database.js';
import {Task, User, TaskComment, Notification, Project} from '../models/index.js'
import { getTaskCreatorAndAssignee } from '../utils/getTaskCreaterAndAssignee.js';

export const addComment = async (req:Request, res:Response, next: NextFunction) => {
    const { projectId, taskId } = req.params;
    const { content, parent_comment_id } = req.body;

    await sequelize.transaction(async (transaction) => {

        const task = await Task.findOne({
            where: {
                id: taskId,
                project_id: projectId,
            },
            include: [{
                model: Project,
                as: "project"
            }],
            transaction,
        }) as Task

        if (parent_comment_id) {

            const parent = await TaskComment.findByPk(parent_comment_id, {
                transaction,
            });

            if (!parent) {
                throw new AppError("Parent comment not found.", 404);
            }

            if (parent.task_id !== task.id) {
                throw new AppError("Invalid parent comment.", 400);
            }

            if (parent.parent_comment_id !== null) {
                throw new AppError(
                    "Replies to replies are not allowed.",
                    400
                );
            }
        }

        const comment = await TaskComment.create(
            {
                task_id: task.id,
                user_id: Number(req.user!.id),
                parent_comment_id: parent_comment_id ?? null,
                content,
            },
            { transaction }
        );


        console.log(taskId);
        console.log(projectId);
        
        const recipients = await getTaskCreatorAndAssignee(Number(taskId), Number(req.user!.id))
            if(recipients){
                for (const userId of recipients) {
                    await Notification.create(
                        {
                            user_id: userId,
                            project_id: Number(projectId),
                            task_id: Number(taskId),
                            description: `There's a comment added on Task '${task.title}' in Project '${task.project!.title}': ${content}`,
                            notificationType: "task_comment"
                        },
                        { transaction }
                    );
                }
            }

        res.status(201).json({
            success: true,
            data: comment,
        });

    });
}

export const getComments = async (req:Request, res:Response, next: NextFunction) => {
    const { taskId } = req.params;

    const comments = await TaskComment.findAll({
        where: {
            task_id: taskId,
            parent_comment_id: null,
        },
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "username"],
            },
            {
                model: TaskComment,
                as: "replies",
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "username"],
                    },
                ],
            },
        ],
    });

    res.status(200).json({
        success: true,
        data: comments,
    });
}

export const updateComment = async (req:Request, res:Response, next: NextFunction) => {
    const { taskId, commentId } = req.params;
    const { content } = req.body;

    await sequelize.transaction(async (transaction) => {

        const comment = await TaskComment.findOne({
            where: {
                id: commentId,
                task_id: taskId,
            },
            transaction,
        });

        if (!comment) {
            throw new AppError("Comment not found.", 404);
        }

        if (comment.user_id !== Number(req.user!.id)) {
            throw new AppError(
                "You are not allowed to edit this comment.",
                403
            );
        }

        await comment.update(
            {
                content,
                edited_at: new Date(),
            },
            { transaction }
        );

        res.status(200).json({
            success: true,
            data: comment,
        });

    });
}

export const deleteComment = async (req:Request, res:Response, next: NextFunction) => {
    const { taskId, commentId } = req.params;

    await sequelize.transaction(async (transaction) => {

        const comment = await TaskComment.findOne({
            where: {
                id: commentId,
                task_id: taskId,
            },
            transaction,
        });

        if (!comment) {
            throw new AppError("Comment not found.", 404);
        }

        await comment.destroy({ transaction });

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully.",
        });
    });
}