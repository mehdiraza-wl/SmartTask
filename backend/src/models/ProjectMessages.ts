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

class ProjectMessage extends Model<
  InferAttributes<ProjectMessage>,
  InferCreationAttributes<ProjectMessage>
> {
  declare id: CreationOptional<number>;

  declare project_id: number;

  declare sender_id: number;

  declare content: string;

  declare readonly createdAt: CreationOptional<Date>;

  declare project?: NonAttribute<Project>;

  declare sender?: NonAttribute<User>;
}

ProjectMessage.init(
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

    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "ProjectMessage",
    tableName: "project_messages",
    updatedAt: false,
  }
);

export default ProjectMessage;