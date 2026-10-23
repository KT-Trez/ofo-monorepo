import type { ValueOf } from 'type-fest';

export const PlaylistSortMode = {
  CustomAsc: 'custom_asc',
  CustomDesc: 'custom_desc',
  NameAsc: 'name_asc',
  NameDesc: 'name_desc',
} as const;
export type PlaylistSortModes = ValueOf<typeof PlaylistSortMode>;

export const PLAYLIST_SORT_MODES = Object.freeze(Object.values(PlaylistSortMode)) as readonly [
  PlaylistSortModes,
  ...PlaylistSortModes[],
];
