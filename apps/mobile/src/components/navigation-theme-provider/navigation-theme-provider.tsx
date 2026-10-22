import { ThemeProvider } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { useNavigationTheme } from './hooks/use-navigation-theme.ts';

export const NavigationThemeProvider = ({ children }: PropsWithChildren) => {
  const { navigationTheme } = useNavigationTheme();

  return <ThemeProvider value={navigationTheme}>{children}</ThemeProvider>;
};
