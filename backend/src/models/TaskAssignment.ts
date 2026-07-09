import { DataTypes, Model } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from "sequelize";

import sequelize from "../configs/database.js";

import Task from "./Task.js";
import User from "./User.js";


class TaskAssignment extends Model<
  InferAttributes<TaskAssignment>,
  InferCreationAttributes<TaskAssignment>
> {

  declare id: CreationOptional<number>;

  declare task_id: number;

  declare user_id: number;

  declare assignment_type: "owner" | "collaborator";

  declare assigned_by_user_id: number;

  // Associations

  declare task?: NonAttribute<Task>;

  declare user?: NonAttribute<User>;

  declare assignedBy?: NonAttribute<User>;


  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}



TaskAssignment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    assignment_type: {
      type: DataTypes.ENUM(
        "owner",
        "collaborator"
      ),
      allowNull: false,
      defaultValue: "collaborator",
    },

    assigned_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "TaskAssignment",
    tableName: "task_assignments",
    timestamps: true,
  }
);


export default TaskAssignment;