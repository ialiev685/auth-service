import { DataTypes } from 'sequelize';
import type { Migration } from '../migrator';

export const up: Migration = async ({ context }) => {
  await context.createTable('role', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      unique: true,
    },
  });
};
export const down: Migration = async ({ context }) => {
  await context.dropTable('role');
};
