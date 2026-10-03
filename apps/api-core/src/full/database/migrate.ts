import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'node:path';
import postgres from 'postgres';

const url = process.env.DATABASE_URL;

if (!url) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const client = postgres(url, { max: 1, prepare: false });
const database = drizzle(client);

try {
  console.log('Migrations running');

  await migrate(database, {
    migrationsFolder: path.resolve(process.env.MIGRATIONS_DIR ?? 'drizzle'),
  });

  console.log('Migrations applied');
} catch (error) {
  console.error('Migration failed', error);
  process.exitCode = 1;
} finally {
  await client.end({ timeout: 5 });
}
