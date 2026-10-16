import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Platform, Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { SwitchProps } from './types.ts';

export const Switch = ({
  accessibilityLabel,
  isChecked,
  isDisabled = false,
  onChange,
}: SwitchProps) => {
  const position = useRef(new Animated.Value(isChecked ? 1 : 0)).current;
  const { theme } = useUnistyles();
  styles.useVariants({ checked: isChecked, disabled: isDisabled });

  useEffect(() => {
    Animated.timing(position, {
      duration: theme.motion.duration.base,
      easing: Easing.bezier(...theme.motion.easing.snap),
      toValue: isChecked ? 1 : 0,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [isChecked, position, theme.motion]);

  const travel = theme.size.switchWidth - theme.size.switchHeight;

  const slop = useMemo(() => {
    return Math.max(0, (theme.size.touchTarget - theme.size.switchHeight) / 2);
  }, [theme.size]);

  return (
    <Pressable
      aria-checked={isChecked}
      aria-disabled={isDisabled}
      aria-label={accessibilityLabel}
      disabled={isDisabled}
      hitSlop={slop}
      onPress={() => onChange(!isChecked)}
      role="switch"
      style={styles.track}
    >
      <Animated.View
        style={{
          transform: [
            { translateX: position.interpolate({ inputRange: [0, 1], outputRange: [0, travel] }) },
          ],
        }}
      >
        <View style={styles.thumb} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create(theme => ({
  thumb: {
    borderRadius: theme.radius.pill,
    height: theme.size.switchThumb,
    variants: {
      checked: {
        false: { backgroundColor: theme.colors.textPrimary },
        true: { backgroundColor: theme.colors.textOnAccent },
      },
    },
    width: theme.size.switchThumb,
  },
  track: {
    borderRadius: theme.radius.pill,
    height: theme.size.switchHeight,
    justifyContent: 'center',
    paddingHorizontal: (theme.size.switchHeight - theme.size.switchThumb) / 2,
    variants: {
      checked: {
        false: { backgroundColor: theme.colors.surfaceHover },
        true: { backgroundColor: theme.colors.accent },
      },
      disabled: {
        true: { opacity: theme.opacity.disabled },
      },
    },
    width: theme.size.switchWidth,
  },
}));
