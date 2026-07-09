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


class TaskHistory extends Model<
  InferAttributes<TaskHistory>,
  InferCreationAttributes<TaskHistory>
> {

  declare id: CreationOptional<number>;

  declare task_id: number;

  declare changed_by_user_id: number;

  declare field_changed: string;

  declare old_value: string | null;

  declare new_value: string;


  declare task?: NonAttribute<Task>;

  declare changedBy?: NonAttribute<User>;


  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}


TaskHistory.init(
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

    changed_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    field_changed: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    old_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    new_value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "TaskHistory",
    tableName: "task_history",
    timestamps: true,
  }
);


export default TaskHistory;