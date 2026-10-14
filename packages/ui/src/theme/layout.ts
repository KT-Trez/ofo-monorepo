import type { ThemeRadii, ThemeSizes, ThemeSpaces } from './types.ts';

export const radius: Readonly<Record<ThemeRadii, number>> = {
  default: 8,
  pill: 999,
};

export const space: Readonly<Record<ThemeSpaces, number>> = {
  none: 0,
  '2xs': 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 56,
  screenInset: 16,
};

export const size: Readonly<Record<ThemeSizes, number>> = {
  topBar: 56,
  bottomNav: 68,
  miniPlayer: 60,
  row: 60,
  coverRow: 44,
  controlSm: 36,
  controlMd: 44,
  controlLg: 56,
  field: 48,
  badge: 20,
};
