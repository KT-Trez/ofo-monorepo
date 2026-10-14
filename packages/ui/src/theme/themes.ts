import { darkColors, lightColors } from './colors';
import { darkShadows, lightShadows } from './elevation';
import { radius, size, space } from './layout';
import { motion } from './motion';
import { opacity } from './opacity';
import type { AppTheme, AppThemes } from './types.ts';
import { typography } from './typography';

const base: Readonly<Omit<AppTheme, 'colors' | 'shadows'>> = {
  motion,
  opacity,
  radius,
  size,
  space,
  typography,
};

export const darkTheme: Readonly<AppTheme> = {
  colors: darkColors,
  shadows: darkShadows,
  ...base,
};

export const lightTheme: Readonly<AppTheme> = {
  colors: lightColors,
  shadows: lightShadows,
  ...base,
};

export const themes: Readonly<AppThemes> = {
  light: lightTheme,
  dark: darkTheme,
};
