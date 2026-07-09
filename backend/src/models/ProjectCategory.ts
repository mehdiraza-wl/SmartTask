import { DataTypes, Model } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute
} from "sequelize";
import sequelize from "../configs/database.js";
import Project from "./Project.js";
class projectCategory extends Model<
  InferAttributes<projectCategory>,
  InferCreationAttributes<projectCategory>
> {
  declare id: CreationOptional<number>;
  declare category_name: string;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare projects?: NonAttribute<Project[]>;
}
projectCategory.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
},
{
    sequelize,
    modelName: "projectCategory",
    tableName: "project_category",
    timestamps: true,
})

export default projectCategory