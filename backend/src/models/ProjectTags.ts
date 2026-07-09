import { DataTypes, Model } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute
} from "sequelize";
import sequelize from "../configs/database.js";
import Project from "./Project.js";


class projectTags extends Model<
  InferAttributes<projectTags>,
  InferCreationAttributes<projectTags>
> {
  declare id: CreationOptional<number>;
  declare project_id: number;
  declare tag_name: string

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare project?: NonAttribute<Project>;
}
projectTags.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tag_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
},
{
    sequelize,
    modelName: "projectTags",
    tableName: "project_tags",
    timestamps: true,
})

export default projectTags