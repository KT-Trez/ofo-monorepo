import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { getRandomValues } from 'expo-crypto';
import { addDatabaseChangeListener, type SQLiteDatabase } from 'expo-sqlite';
import migrations from '../../drizzle/migrations.js';
import { createRandomUidGenerator } from '../core/uid.ts';
import { DownloadRepository } from '../repositories/download.repository.ts';
import type { DatabaseClient } from '../types.ts';

export type ExpoDatabaseClient = DatabaseClient & {
  readonly db: ExpoSQLiteDatabase;
};

/**
 * Wraps a connection opened by the app.
 * Open it with `enableChangeListener: true`, otherwise `useLiveQuery` does not refresh.
 */
export const createDatabaseClient = (sqlite: SQLiteDatabase): ExpoDatabaseClient => {
  // off by default in SQLite, per connection; `ON DELETE CASCADE` needs it
  sqlite.execSync('PRAGMA foreign_keys = ON');

  const db = drizzle(sqlite);
  const genRandomUid = createRandomUidGenerator(getRandomValues);

  return {
    db,
    genRandomUid,
    // expo-sqlite is synchronous, so the transaction holds the connection until every query has run
    runAtomic: async queries => {
      db.transaction(tx => {
        for (const query of queries) {
          tx.run(query);
        }
      });
    },
    watchTables: listener => {
      const subscription = addDatabaseChangeListener(({ tableName }) => listener(tableName));

      return () => subscription.remove();
    },
  };
};

export const prepareDatabase = async (client: ExpoDatabaseClient) => {
  await migrate(client.db, migrations);
  await new DownloadRepository(client).failInterrupted();
};
