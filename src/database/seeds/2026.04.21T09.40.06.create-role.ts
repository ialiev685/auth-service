import type { Migration } from '../migrator';

export const up: Migration = async ({ context }) => {
  await context.bulkInsert('role', [
    {
      name: 'admin',
    },
    {
      name: 'user',
    },
  ]);
};
export const down: Migration = async ({ context }) => {
  await context.bulkDelete('role', {
    name: ['admin', 'user'],
  });
};
