import type { UnknownRecord } from 'type-fest';

export type ConstValues<T> = T[keyof T];

export type StringKey<T extends UnknownRecord> = keyof T & string;
