import { DataTypes, Model } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from "sequelize";

import sequelize from "../configs/database.js";


class Notification extends Model<
  InferAttributes<Notification>,
  InferCreationAttributes<Notification>
> {

  declare id: CreationOptional<number>;

  declare user_id: number;
  
  declare task_id: number;

  declare project_id: number;

  declare description: string;

  declare isRead: CreationOptional<boolean>;


  // associations

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}


Notification.init(
{
  id:{
    type: DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
  },

  user_id:{
    type:DataTypes.INTEGER,
    allowNull:false,
  },

  task_id:{
    type:DataTypes.INTEGER,
    allowNull:false,
  },

  project_id:{
    type:DataTypes.INTEGER,
    allowNull:false,
  },

  description:{
    type:DataTypes.TEXT,
    allowNull:false,
  },

  isRead:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue: false
  },

  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,

},
{
 sequelize,
 modelName:"Notification",
 tableName:"notification",
 timestamps:true,
}
);


export default Notification;