import { useMemo } from 'react';
import { Pressable, type PressableStateCallbackType, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { ThemeColors, ThemeSizes } from '../../theme/types.ts';
import { Icon, IconWeight } from '../icon';
import {
  type ButtonProps,
  ButtonSize,
  type ButtonSizes,
  ButtonVariant,
  type ButtonVariants,
} from './types.ts';

const HEIGHT: Readonly<Record<ButtonSizes, ThemeSizes>> = { md: 'controlMd', sm: 'controlSm' };

const ICON_SIZE: Readonly<Record<ButtonSizes, number>> = { md: 20, sm: 18 };

const LABEL_COLOR: Readonly<Record<ButtonVariants, ThemeColors>> = {
  danger: 'danger',
  ghost: 'textPrimary',
  onInverse: 'accentPressed',
  primary: 'textOnAccent',
  secondary: 'textPrimary',
};

const isHovered = (state: PressableStateCallbackType) => {
  return 'hovered' in state && state.hovered === true;
};

export const Button = ({
  accessibilityLabel,
  children,
  iconEnd,
  iconStart,
  isDisabled = false,
  isFullwidth = false,
  onLongPress,
  onPress,
  size = ButtonSize.Md,
  variant = ButtonVariant.Primary,
}: ButtonProps) => {
  const { theme } = useUnistyles();
  styles.useVariants({ disabled: isDisabled, full: isFullwidth, size, variant });

  const slop = useMemo(() => {
    return Math.max(0, (theme.size.touchTarget - theme.size[HEIGHT[size]]) / 2);
  }, [theme.size, size]);

  const iconColor = theme.colors[LABEL_COLOR[variant]];

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? children}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      hitSlop={{ bottom: slop, top: slop }}
      onLongPress={onLongPress}
      onPress={onPress}
      style={state => [
        styles.container,
        isHovered(state) && styles.hovered,
        state.pressed && styles.pressed,
      ]}
    >
      {iconStart && (
        <Icon
          color={iconColor}
          name={iconStart}
          size={ICON_SIZE[size]}
          weight={IconWeight.Medium}
        />
      )}

      <Text numberOfLines={1} style={styles.label}>
        {children}
      </Text>

      {iconEnd && (
        <Icon color={iconColor} name={iconEnd} size={ICON_SIZE[size]} weight={IconWeight.Medium} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    alignItems: 'center',
    borderRadius: theme.radius.default,
    flexDirection: 'row',
    gap: theme.space.sm,
    justifyContent: 'center',
    variants: {
      disabled: {
        true: { opacity: theme.opacity.disabled },
      },
      full: {
        false: { alignSelf: 'flex-start' },
        true: { alignSelf: 'stretch' },
      },
      size: {
        md: { minHeight: theme.size.controlMd, paddingHorizontal: theme.space.lg },
        sm: { minHeight: theme.size.controlSm, paddingHorizontal: theme.space.md },
      },
      variant: {
        danger: { backgroundColor: theme.colors.dangerSubtle },
        ghost: { backgroundColor: 'transparent' },
        onInverse: { backgroundColor: 'transparent' },
        primary: { backgroundColor: theme.colors.accent },
        secondary: { backgroundColor: theme.colors.surfaceElevated },
      },
    },
  },
  hovered: {
    variants: {
      variant: {
        danger: { backgroundColor: theme.colors.dangerSubtleHover },
        ghost: { backgroundColor: theme.colors.surfaceRaised },
        onInverse: { backgroundColor: theme.colors.surfaceInverseHover },
        primary: { backgroundColor: theme.colors.accentHover },
        secondary: { backgroundColor: theme.colors.surfaceHover },
      },
    },
  },
  label: {
    variants: {
      size: {
        md: {
          ...theme.typography.variants.body,
          fontFamily: theme.typography.fontFamily.text.semibold,
        },
        sm: {
          ...theme.typography.variants.bodySm,
          fontFamily: theme.typography.fontFamily.text.semibold,
        },
      },
      variant: {
        danger: { color: theme.colors.danger },
        ghost: { color: theme.colors.textPrimary },
        onInverse: { color: theme.colors.accentPressed },
        primary: { color: theme.colors.textOnAccent },
        secondary: { color: theme.colors.textPrimary },
      },
    },
  },
  pressed: {
    transform: [{ scale: theme.motion.pressScale.button }],
    variants: {
      variant: {
        danger: {},
        ghost: { backgroundColor: theme.colors.surfaceRaised },
        onInverse: {},
        primary: { backgroundColor: theme.colors.accentPressed },
        secondary: { backgroundColor: theme.colors.surfaceHover },
      },
    },
  },
}));
