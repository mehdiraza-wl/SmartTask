// models/ProjectInvitation.ts

import { DataTypes, Model } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute
} from "sequelize";
import sequelize from "../configs/database.js";
import Project from "./Project.js";

class ProjectInvitation extends Model<
  InferAttributes<ProjectInvitation>,
  InferCreationAttributes<ProjectInvitation>
> {
  declare id: CreationOptional<number>;

  declare project_id: number;

  declare role: "manager" | "member";

  declare invitedEmail: string;

  declare token: string;

  declare status: CreationOptional<"pending" | "accepted">;

  declare expiry: Date;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare project?: NonAttribute<Project>;
}

ProjectInvitation.init(
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

    role: {
      type: DataTypes.ENUM("manager", "member"),
      allowNull: false,
    },

    invitedEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    status: {
      type: DataTypes.ENUM("pending", "accepted"),
      allowNull: false,
      defaultValue: "pending",
    },

    expiry: {
      type: DataTypes.DATE,
      defaultValue: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "ProjectInvitation",
    tableName: "project_invitations",
    timestamps: true,
  }
);

export default ProjectInvitation;