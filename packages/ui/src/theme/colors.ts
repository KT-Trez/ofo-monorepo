import { palette as p } from './palette';
import type { ThemeColors } from './types.ts';

export const darkColors: Readonly<Record<ThemeColors, string>> = {
  bg: p.graphite900,
  surfaceBase: p.graphite850,
  surfaceRaised: p.graphite800,
  surfaceElevated: p.graphite750,
  surfaceHover: p.graphite700,
  surfaceInverse: p.graphite50,

  border: p.graphite750,
  borderStrong: p.graphite700,

  textPrimary: p.ink100,
  textSecondary: p.graphite400,
  textTertiary: p.graphite500,
  textInverse: p.graphite900,
  textOnAccent: p.inkOnAmber,
  textOnMedia: p.ink100,

  accent: p.amber400,
  accentHover: p.amber300,
  accentPressed: p.amber500,
  accentText: p.amber400,
  accentSubtle: 'rgba(255,176,32,0.14)',

  success: p.green400,
  successSubtle: 'rgba(61,214,140,0.14)',
  danger: p.red400,
  dangerSubtle: 'rgba(255,107,94,0.14)',
  dangerSubtleHover: 'rgba(255,107,94,0.22)',
  info: p.blue400,
  infoSubtle: 'rgba(94,176,255,0.14)',

  scrim: 'rgba(8,7,6,0.64)',
  progressTrack: p.graphite700,
  overlayCover: 'rgba(14,13,11,0.55)',
  overlaySelected: 'rgba(0,0,0,0.5)',
  overlayControl: 'rgba(14,13,11,0.62)',
};

export const lightColors: Readonly<Record<ThemeColors, string>> = {
  bg: p.graphite50,
  surfaceBase: p.graphite0,
  surfaceRaised: p.graphite100,
  surfaceElevated: p.graphite150,
  surfaceHover: p.graphite200,
  surfaceInverse: p.graphite850,

  border: p.graphite200,
  borderStrong: p.graphite300,

  textPrimary: p.ink900,
  textSecondary: p.graphite600,
  textTertiary: p.graphite550,
  textInverse: p.ink100,
  textOnAccent: p.inkOnAmber,
  textOnMedia: p.ink100,

  accent: p.amber400,
  accentHover: p.amber300,
  accentPressed: p.amber500,
  accentText: p.amber700,
  accentSubtle: 'rgba(255,176,32,0.18)',

  success: p.green600,
  successSubtle: 'rgba(30,158,94,0.12)',
  danger: p.red600,
  dangerSubtle: 'rgba(210,58,46,0.10)',
  dangerSubtleHover: 'rgba(210,58,46,0.16)',
  info: p.blue600,
  infoSubtle: 'rgba(31,116,209,0.10)',

  scrim: 'rgba(22,19,15,0.40)',
  progressTrack: p.graphite200,
  overlayCover: 'rgba(14,13,11,0.55)',
  overlaySelected: 'rgba(0,0,0,0.5)',
  overlayControl: 'rgba(14,13,11,0.62)',
};
