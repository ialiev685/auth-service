import { sequelize } from "../db";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { DataTypes, Model } from "sequelize";

export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare password: string;
  declare role: CreationOptional<"user" | "admin">;
  declare isActivate: CreationOptional<boolean>;
  declare activationLink: string | null;
  declare resetPasswordToken: string | null;
  declare resetPasswordExpired: number | null;
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    isActivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    activationLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpired: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  { sequelize, modelName: "User" },
);

export class TokenModel extends Model<
  InferAttributes<TokenModel>,
  InferCreationAttributes<TokenModel>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare refreshToken: string;
}

TokenModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Token",
  },
);

UserModel.hasOne(TokenModel, {
  onDelete: "CASCADE",
  foreignKey: "userId",
});
TokenModel.belongsTo(UserModel, { foreignKey: "userId" });
