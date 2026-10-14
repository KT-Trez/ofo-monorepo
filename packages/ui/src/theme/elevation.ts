import type { ThemeShadows } from './types.ts';

export const darkShadows: Readonly<Record<ThemeShadows, string>> = {
  raised: '0 1px 2px rgba(0,0,0,0.18)',
  overlay: '0 6px 20px rgba(0,0,0,0.28)',
  sheet: '0 -12px 40px rgba(0,0,0,0.40)',
  accent: '0 8px 24px rgba(255,176,32,0.30)',
};

export const lightShadows: Readonly<Record<ThemeShadows, string>> = {
  raised: '0 1px 2px rgba(40,30,15,0.08)',
  overlay: '0 6px 20px rgba(40,30,15,0.10)',
  sheet: '0 -12px 40px rgba(40,30,15,0.16)',
  accent: '0 8px 24px rgba(255,176,32,0.30)',
};
