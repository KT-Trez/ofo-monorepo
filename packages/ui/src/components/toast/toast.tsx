import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Button, ButtonSize, ButtonVariant } from '../button';
import { Icon } from '../icon';
import type { ToastProps } from './types.ts';

const ICON_SIZE = 20;

const TOAST_ENTER_OFFSET = 12;

export const Toast = ({ actionLabel, icon, message, onAction }: ToastProps) => {
  const appearance = useRef(new Animated.Value(0)).current;
  const { theme } = useUnistyles();

  useEffect(() => {
    Animated.timing(appearance, {
      duration: theme.motion.duration.base,
      easing: Easing.bezier(...theme.motion.easing.out),
      toValue: 1,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [appearance, theme.motion]);

  return (
    <Animated.View
      style={{
        opacity: appearance,
        transform: [
          {
            translateY: appearance.interpolate({
              inputRange: [0, 1],
              outputRange: [TOAST_ENTER_OFFSET, 0],
            }),
          },
        ],
      }}
    >
      <View role="status" style={styles.toast}>
        {icon && <Icon color={theme.colors.accent} isFilled name={icon} size={ICON_SIZE} />}

        <Text style={styles.message}>{message}</Text>

        {actionLabel && (
          // Button aligns itself to the start; the wrapper is centred in the row instead.
          <View style={styles.action}>
            <Button onPress={onAction} size={ButtonSize.Sm} variant={ButtonVariant.OnInverse}>
              {actionLabel}
            </Button>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create(theme => ({
  action: {
    alignSelf: 'center',
  },
  message: {
    ...theme.typography.variants.bodySm,
    color: theme.colors.textInverse,
    flex: 1,
    fontFamily: theme.typography.fontFamily.text.medium,
    // With the toast's own padding, multi-line text keeps 8 px from the edge.
    paddingVertical: theme.space.xs,
  },
  toast: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceInverse,
    borderRadius: theme.radius.default,
    boxShadow: theme.shadows.overlay,
    flexDirection: 'row',
    gap: theme.space.sm,
    minHeight: theme.size.field,
    paddingLeft: theme.space.md,
    paddingRight: theme.space.xs,
    // The small action button is 36 px tall, so the toast stays at its 48 px minimum.
    paddingVertical: theme.space.xs,
  },
}));
