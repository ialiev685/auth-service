import { Umzug, SequelizeStorage } from 'umzug';
import { sequelize } from './sequelize-db';

export const migrator = new Umzug({
  migrations: { glob: ['migrations/*.{js,ts}', { cwd: __dirname }] },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export type Migration = typeof migrator._types.migration;
