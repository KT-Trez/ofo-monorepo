import type { SQLWrapper } from 'drizzle-orm';
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';

/** A `write` built with `SqliteDatabase` (insert, update, delete) that has not been run yet. */
export type AtomicQuery = SQLWrapper;

/** What a driver adapter gives the repositories. */
export type DatabaseClient = {
  /**
   * Any Drizzle SQLite database, sync or async.
   * Always `await` its queries, so the code works with both.
   */
  readonly db: BaseSQLiteDatabase<'sync' | 'async', any>;
  readonly genRandomUid: GenRandomUid;
  readonly runAtomic: RunAtomic;
};

export type GenRandomUid = () => Uid;

/**
 * Runs the writes in order: either all of them succeed or none.
 * It takes only writes, so do any reads before calling it.
 * That lets a driver run them as a transaction or send them as one batch.
 */
export type RunAtomic = (queries: readonly AtomicQuery[]) => Promise<void>;

export type Uid = `${string}-${string}-7${string}-${'8' | '9' | 'a' | 'b'}${string}-${string}`;
