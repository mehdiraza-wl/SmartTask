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


class TaskComment extends Model<
  InferAttributes<TaskComment>,
  InferCreationAttributes<TaskComment>
> {

  declare id: CreationOptional<number>;

  declare task_id: number;

  declare user_id: number;

  declare parent_comment_id: number | null;

  declare content: string;

  declare edited_at: Date | null;


  // associations

  declare task?: NonAttribute<Task>;

  declare user?: NonAttribute<User>;

  declare parent?: NonAttribute<TaskComment>;

  declare replies?: NonAttribute<TaskComment[]>;


  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}


TaskComment.init(
{
  id:{
    type: DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
  },

  task_id:{
    type:DataTypes.INTEGER,
    allowNull:false,
  },

  user_id:{
    type:DataTypes.INTEGER,
    allowNull:false,
  },

  parent_comment_id:{
    type:DataTypes.INTEGER,
    allowNull:true,
  },

  content:{
    type:DataTypes.TEXT,
    allowNull:false,
  },

  edited_at:{
    type:DataTypes.DATE,
    allowNull:true,
  },

  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,

},
{
 sequelize,
 modelName:"TaskComment",
 tableName:"task_comments",
 timestamps:true,
}
);


export default TaskComment;