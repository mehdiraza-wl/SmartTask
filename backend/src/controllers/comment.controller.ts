import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import sequelize from '../configs/database.js';
import {Task, User, TaskComment} from '../models/index.js'

export const addComment = async (req:Request, res:Response, next: NextFunction) => {
    const { projectId, taskId } = req.params;
    const { content, parent_comment_id } = req.body;

    await sequelize.transaction(async (transaction) => {

        const task = await Task.findOne({
            where: {
                id: taskId,
                project_id: projectId,
            },
            transaction,
        });

        if (!task) {
            throw new AppError("Task not found.", 404);
        }

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

        res.status(201).json({
            success: true,
            data: comment,
        });

    });
}

export const getComments = async (req:Request, res:Response, next: NextFunction) => {
const { projectId, taskId } = req.params;

    const task = await Task.findOne({
        where: {
            id: taskId,
            project_id: projectId,
        },
    });

    if (!task) {
        throw new AppError("Task not found.", 404);
    }

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
    const { projectId, taskId, commentId } = req.params;
    const { content } = req.body;

    await sequelize.transaction(async (transaction) => {

        const task = await Task.findOne({
            where: {
                id: taskId,
                project_id: projectId,
            },
            transaction,
        });

        if (!task) {
            throw new AppError("Task not found.", 404);
        }

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