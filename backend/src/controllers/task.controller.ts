import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import sequelize from '../configs/database.js';
import {Task, Project, TaskAssignment, ProjectMember, TaskHistory} from '../models/index.js'


export const createTask = async (req:Request, res:Response, next: NextFunction) => {
    const { projectId } = req.params;
    console.log(projectId);
    
    await sequelize.transaction(async (transaction) => {
        const project = await Project.findByPk(Number(projectId), { transaction });

        if (!project) {
            throw new AppError("Project not found.", 404);
        }

        const { title, description, status, priority, due_date } = req.body;

        const task = await Task.create(
            {
                project_id: Number(projectId),
                title,
                description,
                status,
                priority,
                created_by: Number(req.user!.id),
                due_date,
            },
            { transaction }
        );

        await TaskHistory.create(
            {
                task_id: task.id,
                changed_by_user_id: Number(req.user!.id),
                field_changed: "created",
                old_value: null,
                new_value: "Task created",
            },
            { transaction }
        );

        res.status(201).json({
            success: true,
            message: "Task created successfully.",
            data: task,
        });
    });
}

export const assignTask = async (req:Request, res:Response, next: NextFunction) => {
    const { projectId, taskId } = req.params;
    const { userId, assignment_type } = req.body;

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

        const member = await ProjectMember.findOne({
            where: {
                project_id: projectId,
                user_id: userId,
                status: "active",
            },
            transaction,
        });

        if (!member) {
            throw new AppError("User is not an active member of this project.", 400);
        }

        const assignment = await TaskAssignment.create(
            {
                task_id: Number(taskId),
                user_id: Number(userId),
                assignment_type,
                assigned_by_user_id: Number(req.user!.id),
            },
            { transaction }
        );

        await TaskHistory.create(
            {
                task_id: task.id,
                changed_by_user_id: Number(req.user!.id),
                field_changed: "assignment_added",
                old_value: null,
                new_value: JSON.stringify({
                    userId,
                    assignment_type,
                }),
            },
            { transaction }
        );

        res.status(201).json({
            success: true,
            message: "Task assigned successfully.",
            data: assignment,
        });
    });
}


export const removeTaskAssignment = async (req:Request, res:Response, next: NextFunction) =>  {
    const { projectId, taskId, userId } = req.params;

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

        const assignment = await TaskAssignment.findOne({
            where: {
                task_id: taskId,
                user_id: userId,
            },
            transaction,
        });

        if (!assignment) {
            throw new AppError("Assignment not found.", 404);
        }

        await TaskHistory.create(
            {
                task_id: task.id,
                changed_by_user_id: Number(req.user!.id),
                field_changed: "assignment_removed",
                old_value: JSON.stringify({
                    userId: assignment.user_id,
                    assignment_type: assignment.assignment_type,
                }),
                new_value: "",
            },
            { transaction }
        );

        await assignment.destroy({ transaction });

        res.status(200).json({
            success: true,
            message: "Assignment removed successfully.",
        });
    });
}
