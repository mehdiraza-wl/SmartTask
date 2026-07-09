import { DataTypes, Model } from "sequelize";
import type {InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute} from "sequelize";
import sequelize from "../configs/database.js";
import Project from "./Project.js";
class projectExternalInvitation extends Model<InferAttributes<projectExternalInvitation>,
  InferCreationAttributes<projectExternalInvitation>
>{
    declare token: string;
    declare project_id: number;
    declare expiry: Date
    
    declare readonly createdAt: CreationOptional<Date>;
    declare readonly updatedAt: CreationOptional<Date>;
    declare project?: NonAttribute<Project>;
}

projectExternalInvitation.init({
    token: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expiry: {
        type: DataTypes.DATE,
        defaultValue: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) //7 days expiry
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
},{
    sequelize,
    modelName: "projectExternalInvitation",
    tableName: "project_external_invitations",
    timestamps: true,
})

export default projectExternalInvitation