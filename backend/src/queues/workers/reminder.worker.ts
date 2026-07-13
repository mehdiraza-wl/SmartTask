import { Op } from "sequelize";
import Task from "../../models/Task.js";
import reminderQueue from "../reminder.queue.js";
import { getTaskCreatorAndAssignee } from "../../utils/getTaskCreaterAndAssignee.js";
import {Project} from "../../models/index.js";
import {Notification} from "../../models/index.js";

reminderQueue.process("daily-task-reminder", async(job) => {
    const today = new Date();

    const twoDaysLater = new Date();
    twoDaysLater.setDate(today.getDate() + 2);
    
    const tasks = await Task.findAll({
    where: {
        status: {
        [Op.ne]: "completed",
        },
        due_date: {
        [Op.between]: [today, twoDaysLater],
        },
    },
    include: [{
        model: Project,
        as: "project"
    }],
        raw: true,
        nest: true
    });
    for(const task of tasks) {
        const userIds=await getTaskCreatorAndAssignee(task.id)
        for(const userId of userIds){
            await Notification.create({
                user_id: userId,
                project_id: task.project_id,
                task_id: task.id,
                description: `Reminder: Task ${task.title} in Project '${task.project!.title}' due date is ${task.due_date!.toLocaleDateString("en-GB")}`,
                notificationType: "task_status"
            })
        }
    }
})