import { DataTypes, Model } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import sequelize from "../configs/database.js";

import Task from "./Task.js";


class TaskDependency extends Model<
  InferAttributes<TaskDependency>,
  InferCreationAttributes<TaskDependency>
> {

  declare task_id: number;

  declare depends_on_task_id: number;


  declare task?: Task;

  declare dependsOnTask?: Task;

}


TaskDependency.init(
  {
    task_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },

    depends_on_task_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TaskDependency",
    tableName: "task_dependencies",
    timestamps: false,
  }
);


export default TaskDependency;