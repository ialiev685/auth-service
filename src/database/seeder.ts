import { SequelizeStorage, Umzug } from 'umzug';
import { sequelize } from './sequelize-db';

const showFormattedInfoLog = (message: Record<string, unknown>) => {
  const formattedOptions = Object.entries(message).map((option) => {
    const [key, value] = option;

    if (typeof value === 'string') {
      const formattedValue = value
        .replace(/migrating/gi, 'seeding')
        .replace(/migrated/gi, 'seeded')
        .replace(/migrations?/gi, 'seeeds');
      return [key, formattedValue];
    }

    return option;
  });

  console.log(Object.fromEntries(formattedOptions));
};

export const seed = new Umzug({
  migrations: {
    glob: ['seeds/*.js', { cwd: __dirname }],
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
    tableName: 'SequelizeSeeds',
  }),
  logger: {
    info: showFormattedInfoLog,
    warn: console.log,
    error: console.log,
    debug: console.log,
  },
});

export type Migration = typeof seed._types.migration;
