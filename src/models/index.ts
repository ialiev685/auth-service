import { sequelize } from "../db";
import { DataTypes } from "sequelize";

export const UserModel = sequelize.define("User", {
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
});

export const TokenModel = sequelize.define("Token", {
  userId: {
    type: DataTypes.INTEGER,
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
});

UserModel.hasOne(TokenModel, { onDelete: "CASCADE" });
TokenModel.belongsTo(UserModel);
