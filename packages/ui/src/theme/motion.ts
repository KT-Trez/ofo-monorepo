import type {
  CubicBezier,
  ThemeDurations,
  ThemeEasings,
  ThemeMotion,
  ThemePressScales,
} from './types.ts';

export const duration: Readonly<Record<ThemeDurations, number>> = {
  fast: 120,
  base: 200,
  slow: 320,
};

export const easing: Readonly<Record<ThemeEasings, CubicBezier>> = {
  out: [0.2, 0.8, 0.2, 1],
  inOut: [0.6, 0, 0.2, 1],
  snap: [0.3, 1.4, 0.5, 1],
};

export const pressScale: Readonly<Record<ThemePressScales, number>> = {
  button: 0.97,
  iconButton: 0.92,
};

export const motion: Readonly<ThemeMotion> = {
  duration,
  easing,
  pressScale,
};
