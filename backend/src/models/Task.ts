import { DataTypes, Model } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from "sequelize";
import sequelize from "../configs/database.js";

import Project from "./Project.js";
import User from "./User.js";
import TaskAssignment from "./TaskAssignment.js";
import TaskHistory from "./TaskHistory.js";
import TaskDependency from "./TaskDependency.js";

class Task extends Model<
  InferAttributes<Task>,
  InferCreationAttributes<Task>
> {
  declare id: CreationOptional<number>;

  declare project_id: number;
  declare created_by: number;

  declare title: string;
  declare description: string;

  declare priority: "low" | "medium" | "high";

  declare due_date: Date | null;

  declare completed_at: Date | null;

  declare status: CreationOptional<"todo" | "in-progress" | "completed">;


  // Associations
  declare project?: NonAttribute<Project>;

  declare creator?: NonAttribute<User>;

  declare assignments?: NonAttribute<TaskAssignment[]>;

  declare history?: NonAttribute<TaskHistory[]>;

  declare dependencies?: NonAttribute<TaskDependency[]>;


  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}


Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    priority: {
      type: DataTypes.ENUM(
        "low",
        "medium",
        "high"
      ),
      allowNull: false,
      defaultValue: "medium",
    },

    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "todo",
        "in-progress",
        "completed"
      ),
      allowNull: false,
      defaultValue: "todo",
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Task",
    tableName: "tasks",
    timestamps: true,
  }
);


export default Task;