import { Sequelize } from 'sequelize';

const isDockerMode = process.env.RUNNING_IN_DOCKER === 'true';

export const sequelize = new Sequelize({
  host: isDockerMode ? 'db' : 'localhost',
  username: process.env.DB_USERNAME ?? '',
  password: process.env.DB_PASSWORD ?? '',
  port: isDockerMode ? 5432 : 5433,
  database: process.env.DB_NAME ?? '',
  dialect: 'postgres',
  logging: false,
});
