import Sqlite from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { webcrypto } from 'node:crypto';
import { createRandomUidGenerator } from '../src/core/uid.ts';
import type { DatabaseClient } from '../src/types.ts';

export const createTestClient = (): DatabaseClient => {
  const sqlite = new Sqlite(':memory:');
  sqlite.pragma('foreign_keys = ON');

  const db = drizzle(sqlite);
  const genRandomUid = createRandomUidGenerator(array => webcrypto.getRandomValues(array));
  migrate(db, { migrationsFolder: new URL('../../drizzle', import.meta.url).pathname });

  return {
    db,
    genRandomUid,
    runAtomic: async queries => {
      db.transaction(tx => {
        for (const query of queries) {
          tx.run(query);
        }
      });
    },
  };
};
