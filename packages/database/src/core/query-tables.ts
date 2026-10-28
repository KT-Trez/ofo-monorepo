import { getTableName, is } from 'drizzle-orm';
import { type SQLiteSelectConfig, SQLiteTable } from 'drizzle-orm/sqlite-core';

/** A select built with Drizzle. */
export type LiveSelect<TResult> = Promise<TResult> & {
  readonly _: { readonly config: SQLiteSelectConfig };
};

export const getQueryTables = (query: LiveSelect<unknown>): ReadonlySet<string> => {
  const { config } = query._;

  const joinTables = config.joins?.map(join => join.table) ?? [];
  const tables = [config.table, ...joinTables]
    .filter(table => is(table, SQLiteTable))
    .map(getTableName);

  return new Set(tables);
};
