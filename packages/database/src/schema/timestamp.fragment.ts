import { integer } from 'drizzle-orm/sqlite-core';

export const timestamp = (name: string) => integer(name, { mode: 'timestamp_ms' });
