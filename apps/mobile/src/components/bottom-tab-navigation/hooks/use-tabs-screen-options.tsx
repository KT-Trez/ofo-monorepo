import { PlatformPressable } from 'expo-router/react-navigation';
import type { BottomTabBarButtonProps, BottomTabNavigationOptions } from 'expo-router/tabs';
import { useMemo } from 'react';
import { Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { BOTTOM_TAB_PILL_HEIGHT, BOTTOM_TAB_PILL_WIDTH } from '../constants.ts';

export const useTabsScreenOptions = () => {
  const { theme } = useUnistyles();

  const options = useMemo<BottomTabNavigationOptions>(() => {
    const buttonStyle = { gap: theme.space.xs, justifyContent: 'center', padding: 0 } as const;

    return {
      tabBarButton: ({ style, ...props }: BottomTabBarButtonProps) => (
        <PlatformPressable {...props} style={[style, buttonStyle]} />
      ),
      tabBarIconStyle: {
        height: BOTTOM_TAB_PILL_HEIGHT,
        width: BOTTOM_TAB_PILL_WIDTH,
      },
      tabBarLabel: ({ children, focused }) => (
        <Text style={[styles.label, focused ? styles.labelSelected : undefined]}>{children}</Text>
      ),
      tabBarLabelPosition: 'below-icon',
      tabBarStyle: {
        borderTopWidth: 1,
        elevation: 0,
        height: theme.size.bottomNav,
        paddingBottom: theme.space.xs,
      },
    };
  }, [theme]);

  return {
    options,
  };
};

const styles = StyleSheet.create(theme => ({
  label: {
    ...theme.typography.variants.captionSm,
    color: theme.colors.textTertiary,
    fontFamily: theme.typography.fontFamily.text.medium,
    fontSize: theme.typography.fontSize.label,
    userSelect: 'none',
  },
  labelSelected: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.text.bold,
  },
}));
