import { type ReactNode, useEffect } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type { ThemePreferences } from '@ofo/ui/theme/types';
import { applyThemePreference, configureTheme } from '@ofo/ui/theme/unistyles';

configureTheme();

type PreviewFrameProps = {
  children: ReactNode;
  preference: ThemePreferences;
};

export const PreviewFrame = ({ children, preference }: PreviewFrameProps) => {
  useEffect(() => {
    applyThemePreference(preference);
  }, [preference]);

  return <View style={styles.frame}>{children}</View>;
};

const styles = StyleSheet.create(theme => ({
  frame: {
    backgroundColor: theme.colors.bg,
    flexGrow: 1,
    minHeight: '100%',
    padding: theme.space['2xl'],
  },
}));
