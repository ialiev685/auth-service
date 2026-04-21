import { sequelize } from '../db';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import { DataTypes, Model } from 'sequelize';

export class RoleModel extends Model<
  InferAttributes<RoleModel>,
  InferCreationAttributes<RoleModel>
> {
  declare id: CreationOptional<number>;
  declare name: 'user' | 'admin';
}

RoleModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.ENUM('user', 'admin'),
      unique: true,
      allowNull: false,
      validate: {
        isIn: [['user', 'admin']],
      },
    },
  },
  { sequelize, modelName: 'Role', tableName: 'role', timestamps: false },
);

export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare password: string;
  declare roleId: ForeignKey<number>;
  declare isActivate: CreationOptional<boolean>;
  declare activationLink: string | null;
  declare resetPasswordToken: string | null;
  declare resetPasswordExpired: number | null;
  declare role?: RoleModel;
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
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'role',
        key: 'id',
      },
      field: 'role_id',
    },
    isActivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_activate',
    },
    activationLink: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'activation_link',
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'reset_password_token',
    },
    resetPasswordExpired: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'reset_password_expired',
    },
  },
  { sequelize, modelName: 'User', tableName: 'user' },
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
        key: 'id',
      },
      field: 'user_id',
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'refresh_token',
    },
  },
  {
    sequelize,
    modelName: 'Token',
    tableName: 'token',
  },
);
RoleModel.hasMany(UserModel, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
  foreignKey: 'roleId',
  as: 'users',
});
UserModel.belongsTo(RoleModel, { foreignKey: 'roleId', as: 'role' });
UserModel.hasOne(TokenModel, {
  onDelete: 'CASCADE',
  foreignKey: 'userId',
});
TokenModel.belongsTo(UserModel, { foreignKey: 'userId' });
