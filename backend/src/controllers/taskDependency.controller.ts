import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import sequelize from '../configs/database.js';
import Task from '../models/Task.js';
import TaskDependency from '../models/TaskDependency.js';
import TaskHistory from '../models/TaskHistory.js';

export const assignTaskDependency = async (req:Request, res:Response, next: NextFunction) =>  {
    const { taskId } = req.params;
    const { depends_on_task_id } = req.body;

    if (Number(taskId) === Number(depends_on_task_id)) {
        throw new AppError("A task cannot depend on itself.", 400);
    }

    const task = await Task.findByPk(Number(taskId));
    const dependencyTask = await Task.findByPk(Number(depends_on_task_id));

    if (!task || !dependencyTask) {
        throw new AppError("Task not found.", 404);
    }

    if (task.project_id !== dependencyTask.project_id) {
        throw new AppError(
            "Tasks from different projects cannot have dependencies.",
            400
        );
    }
    const existingDependency = await TaskDependency.findOne({
        where: {
            task_id: Number(taskId),
            depends_on_task_id: Number(depends_on_task_id),
        },
    });

    if (existingDependency) {
        throw new AppError("Dependency already exists!!", 409);
    }
    await sequelize.transaction(async (transaction) => {
        await TaskDependency.create(
            {
                task_id: Number(taskId),
                depends_on_task_id,
            },
            { transaction }
        );

        await TaskHistory.create(
            {
                task_id: Number(taskId),
                changed_by_user_id: Number(req.user!.id),
                field_changed: "dependency",
                old_value: null,
                new_value: String(depends_on_task_id),
            },
            { transaction }
        );
    });

    res.status(201).json({
        success: true,
        message: "Task dependency assigned successfully.",
    });
}

export const getTaskDependency = async (req:Request, res:Response, next: NextFunction) =>  {
    const {taskId} = req.params

    const dependencies = await TaskDependency.findAll({
        where: {
            task_id: Number(taskId),
        },
        include: [
            {
                model: Task,
                as: "dependsOnTask",
                attributes: ["id", "title", "status", "priority"],
            },
        ],
    });

    res.status(200).json({
        success: true,
        data: dependencies,
    });    
}

export const deleteTaskDependency = async (req:Request, res:Response, next: NextFunction) =>  {
    const { taskId, dependencyId } = req.params;

    const dependency = await TaskDependency.findOne({
        where: {
            task_id: Number(taskId),
            depends_on_task_id: Number(dependencyId),
        },
    });

    if (!dependency) {
        throw new AppError("Task dependency not found.", 404);
    }

    await sequelize.transaction(async (transaction) => {
        await dependency.destroy({ transaction });

        await TaskHistory.create(
            {
                task_id: Number(taskId),
                changed_by_user_id: Number(req.user!.id),
                field_changed: "dependency",
                old_value: String(dependencyId),
                new_value: "DEPENDENCY_REMOVED",
            },
            { transaction }
        );
    });

    res.status(200).json({
        success: true,
        message: "Task dependency removed successfully.",
    });
}