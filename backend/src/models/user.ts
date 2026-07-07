// models/User.ts

import { DataTypes, Model } from "sequelize";
import type {InferAttributes, InferCreationAttributes, CreationOptional} from "sequelize"
import sequelize from "../configs/database.js";

class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;

  declare username: string;
  declare email: string;
  declare hashPassword: string;

  declare isVerified: CreationOptional<boolean>;

  declare resetPasswordToken: string | null;
  declare resetPasswordTokenExpiry: Date | null;

  declare role: CreationOptional<"admin" | "manager" | "member">;

  declare verificationToken: string;
  declare verificationTokenExpiry: Date;

  declare project_id: number | null;

  declare active: CreationOptional<boolean>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    hashPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    resetPasswordTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    role: {
      type: DataTypes.ENUM("admin", "manager", "member"),
      allowNull: false,
      defaultValue: "member",
    },

    verificationToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    verificationTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

export default User;