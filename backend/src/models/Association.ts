import User from "./User.js";
import Project from "./Project.js";
import ProjectInvitation from "./ProjectInvitation.js";
import ProjectMember from "./ProjectMember.js";
import RefreshToken from "./RefreshToken.js";
import ProjectTags from "./ProjectTags.js";
import ProjectExternalInvitation from "./ProjectExternalInvitation.js";
import ProjectCategory from "./ProjectCategory.js";
import sequelize from "../configs/database.js";
import Task from "./Task.js";
import TaskAssignment from "./TaskAssignment.js";
import TaskHistory from "./TaskHistory.js";
import TaskDependency from "./TaskDependency.js";
import TaskComment from "./TaskComment.js";
import ProjectActivity from "./ProjectActivityLog.js";



User.hasMany(RefreshToken, {
    foreignKey: "user_id",
    as: "refreshTokens"
})

RefreshToken.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
})

User.belongsToMany(Project, {
  through: ProjectMember,
  as: "projects",
});

Project.belongsToMany(User, {
  through: ProjectMember,
  as: "members",
});

ProjectMember.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(ProjectMember, {
  foreignKey: "user_id",
  as: "projectMemberships",
});

ProjectMember.belongsTo(Project, {
  foreignKey: "project_id",
  as: "project",
});

Project.hasMany(ProjectMember, {
  foreignKey: "project_id",
  as: "projectMembers", //
});

Project.hasMany(ProjectInvitation, {
  foreignKey: "project_id",
  as: "invitations",
});

ProjectInvitation.belongsTo(Project, {
  foreignKey: "project_id",
  as: "project",
});


Project.hasMany(ProjectExternalInvitation, {
  foreignKey: "project_id",
  as: "externalInvitations",
});

ProjectExternalInvitation.belongsTo(Project, {
  foreignKey: "project_id",
  as: "project",
});

Project.hasMany(ProjectTags, {
  foreignKey: "project_id",
  as: "tags",
});

ProjectTags.belongsTo(Project, {
  foreignKey: "project_id",
  as: "project",
});

Project.belongsTo(ProjectCategory, {
  foreignKey: "category_id",
  as: "category",
});

ProjectCategory.hasMany(Project, {
  foreignKey: "category_id",
  as: "projects",
});

Project.hasMany(Task, {
  foreignKey: "project_id",
  as: "tasks",
});

Task.belongsTo(Project, {
  foreignKey: "project_id",
  as: "project",
});

Task.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

User.hasMany(Task, {
  foreignKey: "created_by",
  as: "createdTasks",
});


Task.hasMany(TaskAssignment, {
  foreignKey: "task_id",
  as: "assignments",
});

TaskAssignment.belongsTo(Task, {
  foreignKey: "task_id",
  as: "task",
});


TaskAssignment.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(TaskAssignment, {
  foreignKey: "user_id",
  as: "taskAssignments",
});

TaskAssignment.belongsTo(User, {
  foreignKey: "assigned_by_user_id",
  as: "assignedBy",
});

User.hasMany(TaskAssignment, {
  foreignKey: "assigned_by_user_id",
  as: "assignedTasks",
});

Task.hasMany(TaskHistory, {
  foreignKey: "task_id",
  as: "history",
});

TaskHistory.belongsTo(Task, {
  foreignKey: "task_id",
  as: "task",
});

TaskHistory.belongsTo(User, {
  foreignKey: "changed_by_user_id",
  as: "changedBy",
});

User.hasMany(TaskHistory, {
  foreignKey: "changed_by_user_id",
  as: "taskHistory",
});


Task.belongsToMany(Task, {
  through: TaskDependency,
  foreignKey: "task_id",
  otherKey: "depends_on_task_id",
  as: "dependencies",
});

Task.belongsToMany(Task, {
  through: TaskDependency,
  foreignKey: "depends_on_task_id",
  otherKey: "task_id",
  as: "blockedTasks",
});

TaskDependency.belongsTo(Task, {
    foreignKey: "task_id",
    as: "task",
});

TaskDependency.belongsTo(Task, {
    foreignKey: "depends_on_task_id",
    as: "dependsOnTask",
});

Task.hasMany(TaskDependency, {
    foreignKey: "task_id",
    as: "taskDependencies",
});

Task.hasMany(TaskDependency, {
    foreignKey: "depends_on_task_id",
    as: "dependentTasks",
});

Task.hasMany(TaskComment,{
  foreignKey:"task_id",
  as:"comments",
});

TaskComment.belongsTo(Task,{
  foreignKey:"task_id",
  as:"task",
});

User.hasMany(TaskComment,{
  foreignKey:"user_id",
  as:"comments",
});

TaskComment.belongsTo(User,{
  foreignKey:"user_id",
  as:"user",
});

TaskComment.belongsTo(TaskComment,{
  foreignKey:"parent_comment_id",
  as:"parent",
});


TaskComment.hasMany(TaskComment,{
  foreignKey:"parent_comment_id",
  as:"replies",
});


Project.hasMany(ProjectActivity,{
  foreignKey:"project_id",
  as:"activities",
});


ProjectActivity.belongsTo(Project,{
  foreignKey:"project_id",
  as:"project",
});


User.hasMany(ProjectActivity,{
  foreignKey:"user_id",
  as:"projectActivities",
});


ProjectActivity.belongsTo(User,{
  foreignKey:"user_id",
  as:"user",
});

