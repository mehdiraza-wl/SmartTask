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


class ProjectActivity extends Model<
  InferAttributes<ProjectActivity>,
  InferCreationAttributes<ProjectActivity>
> {

  declare id: CreationOptional<number>;

  declare project_id: number;

  declare user_id: number;

  declare action:
    | "TASK_CREATED"
    | "TASK_COMPLETED"
    | "TASK_UPDATED"
    | "MEMBER_ADDED"
    | "MEMBER_REMOVED"
    | "PROJECT_CREATED"
    | "PROJECT_UPDATED"
    | "PROJECT_ARCHIVED";

  declare description: string;


  declare project?: NonAttribute<Project>;

  declare user?: NonAttribute<User>;


  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}


ProjectActivity.init(
{
  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
  },

  project_id:{
    type:DataTypes.INTEGER,
    allowNull:false,
  },

  user_id:{
    type:DataTypes.INTEGER,
    allowNull:false,
  },

  action:{
    type:DataTypes.ENUM(
      "TASK_CREATED",
      "TASK_COMPLETED",
      "TASK_UPDATED",
      "MEMBER_ADDED",
      "MEMBER_REMOVED",
      "PROJECT_UPDATED",
      "PROJECT_ARCHIVED"
    ),
    allowNull:false,
  },

  description:{
    type:DataTypes.STRING,
    allowNull:false,
  },

  createdAt:DataTypes.DATE,
  updatedAt:DataTypes.DATE,

},
{
  sequelize,
  modelName:"ProjectActivity",
  tableName:"project_activities",
  timestamps:true,
}
);


export default ProjectActivity;