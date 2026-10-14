import {
  applyThemePreference,
  configureTheme,
  type ThemePreference,
} from '@ofo/ui/theme/unistyles';
import { type ReactNode, useEffect } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

configureTheme();

type PreviewFrameProps = {
  children: ReactNode;
  preference: ThemePreference;
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
