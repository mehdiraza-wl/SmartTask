import Task from "../models/Task.js";
import TaskAssignment from "../models/TaskAssignment.js";

export const getTaskCreatorAndAssignee = async (
  taskId: number, excludeUserId?: number
): Promise<number[]> => {
  const task = await Task.findByPk(taskId, {
    attributes: ["created_by"],
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const assignments = await TaskAssignment.findAll({
    where: {
      task_id: taskId,
    },
    attributes: ["user_id"],
  });

  const userIds = new Set<number>();

  userIds.add(task.created_by);

  assignments.forEach((assignment) => {
    userIds.add(assignment.user_id);
  });
  
  if(excludeUserId)
    userIds.delete(excludeUserId)

  return [...userIds];
};

