import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';
import { useMemo } from 'react';
import { useUnistyles } from 'react-native-unistyles';

export const useNavigationTheme = () => {
  const { theme, rt } = useUnistyles();

  const navigationTheme = useMemo<Theme>(() => {
    const base = rt.themeName === 'dark' ? DarkTheme : DefaultTheme;

    return {
      ...base,
      colors: {
        background: theme.colors.bg,
        border: theme.colors.border,
        card: theme.colors.surfaceBase,
        notification: theme.colors.danger,
        primary: theme.colors.accent,
        text: theme.colors.textPrimary,
      },
    };
  }, [rt.themeName, theme]);

  return {
    navigationTheme,
  };
};
