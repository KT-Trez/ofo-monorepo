import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import { themes } from './themes';
import { type AppThemes, ThemePreference, type ThemePreferences } from './types.ts';

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
}

export const applyThemePreference = (preference: ThemePreferences) => {
  if (preference === ThemePreference.System) {
    return UnistylesRuntime.setAdaptiveThemes(true);
  }

  UnistylesRuntime.setAdaptiveThemes(false);
  UnistylesRuntime.setTheme(preference);
};

export const configureTheme = () => {
  StyleSheet.configure({ themes, settings: { adaptiveThemes: true } });
};
