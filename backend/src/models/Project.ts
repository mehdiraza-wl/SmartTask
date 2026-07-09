import { DataTypes, Model } from "sequelize";
import type {InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute} from "sequelize";
import sequelize from "../configs/database.js";
import User from "./User.js";
import ProjectInvitation from "./ProjectInvitation.js";
import projectExternalInvitation from "./ProjectExternalInvitation.js";
import projectCategory from "./ProjectCategory.js";
import projectTags from "./ProjectTags.js";
import Task from "./Task.js";

class Project extends Model<
  InferAttributes<Project>,
  InferCreationAttributes<Project>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare category_id: number;
  declare owner_id: number;
  declare status: "planned" | "active" | "archived";
  declare startDate: Date;
  declare endDate: Date | null;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare members?: NonAttribute<User[]>;
  declare invitations?: NonAttribute<ProjectInvitation[]>;
  declare externalInvitations?: NonAttribute<projectExternalInvitation[]>;
  declare category?: NonAttribute<projectCategory>;
  declare tags?: NonAttribute<projectTags[]>;
  declare tasks?: NonAttribute<Task[]>
}
Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("planned", "active", "archived"),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Project",
    tableName: "projects",
    timestamps: true,
  }
);
export default Project;