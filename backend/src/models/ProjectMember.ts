import { DataTypes, Model } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute
} from "sequelize";
import sequelize from "../configs/database.js";
import Project from "./Project.js";
import User from "./User.js";
class ProjectMember extends Model<
  InferAttributes<ProjectMember>,
  InferCreationAttributes<ProjectMember>
> {
  declare project_id: number;
  declare user_id: number;

  declare role: "admin" | "manager" | "member";

  declare status: CreationOptional<"active" | "deactivated">;

  declare joined_at: CreationOptional<Date>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare project?: NonAttribute<Project>;
  declare user?: NonAttribute<User>;
}
ProjectMember.init(
  {
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

    role: {
      type: DataTypes.ENUM("admin", "manager", "member"),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("active", "deactivated"),
      allowNull: false,
      defaultValue: "active",
    },

    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "ProjectMember",
    tableName: "project_members",
    timestamps: true,
  }
);

export default ProjectMember;