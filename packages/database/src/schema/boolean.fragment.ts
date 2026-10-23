import { integer } from 'drizzle-orm/sqlite-core';

export const boolean = (name: string) => integer(name, { mode: 'boolean' });
