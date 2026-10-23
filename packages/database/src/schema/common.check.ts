import { type SQL, sql } from 'drizzle-orm';
import { type SQLiteColumn } from 'drizzle-orm/sqlite-core';

/** Column that is `0` or `1`. */
export const isBoolean = (column: SQLiteColumn): SQL => {
  return sql`${column} IN (0, 1)`;
};

/** Both columns are `NULL` or neither is. */
export const isNullSynced = (a: SQLiteColumn, b: SQLiteColumn): SQL => {
  return sql`(${a} IS NULL) = (${b} IS NULL)`;
};

/**
 * Column that holds one of the values of its `{ enum }`.
 */
export const isOneOf = (column: SQLiteColumn): SQL => {
  if (!column.enumValues) {
    throw new Error(`Column "${column.name}" has no enum values`);
  }

  return sql`${column} IN (${sql.join(column.enumValues.map(unsafeSqlText), sql`, `)})`;
};

/** Column that is a not empty text and has no leading or trailing whitespace. */
export const isTrimmed = (column: SQLiteColumn): SQL => {
  return sql`${column} <> '' AND ${column} = trim(${column})`;
};

/**
 * `'value'` as a SQL string literal inlined into the query text, with `'` escaped as `''`.
 * For DDL, ex. an enum value compared in a `CHECK`, where bound parameters don't exist
 * and a plain `${value}` would end up as a `?` placeholder.
 *
 * @remarks
 * **Unsafe**: the value bypasses parameter binding, the quote escaping is the only thing
 * standing between it and SQL injection. Pass only compile-time constants (enum values),
 * never user input or data from the database or the network. In regular queries use
 * a plain `${value}`, which drizzle binds as a parameter.
 */
export const unsafeSqlText = (value: string): SQL => {
  return sql.raw(`'${value.replaceAll("'", "''")}'`);
};
