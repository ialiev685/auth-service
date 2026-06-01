import type { Migration } from '../migrator';
import bcrypt from 'bcrypt';

const ADMIN_NAME = process.env.ADMIN_NAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export const up: Migration = async ({ context }) => {
  const role = await context.sequelize.query(
    `SELECT id, name FROM role WHERE name = 'admin' LIMIT 1`,
    { plain: true },
  );

  if (role?.id) {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD ?? '', 10);

    await context.bulkInsert('user', [
      {
        email: ADMIN_NAME,
        password: hashedPassword,
        role_id: role.id,
        is_activate: true,
      },
    ]);
  }
};
export const down: Migration = async ({ context }) => {
  await context.bulkDelete('user', {
    email: ADMIN_NAME,
  });
};
