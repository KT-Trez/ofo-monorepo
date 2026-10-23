import type { ValueOf } from 'type-fest';

export const CoverKind = {
  Custom: 'custom',
  None: 'none',
  Original: 'original',
} as const;
export type CoverKinds = ValueOf<typeof CoverKind>;

export const Source = {
  YouTube: 'youtube',
} as const;
export type Sources = ValueOf<typeof Source>;

export const COVER_KINDS = Object.freeze(Object.values(CoverKind)) as readonly [
  CoverKinds,
  ...CoverKinds[],
];

export const SOURCES = Object.freeze(Object.values(Source)) as readonly [Sources, ...Sources[]];
