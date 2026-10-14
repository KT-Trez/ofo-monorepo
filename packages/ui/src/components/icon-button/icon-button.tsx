import { useMemo } from 'react';
import { Pressable, type PressableStateCallbackType } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { ThemeColors, ThemeSizes } from '../../theme/types.ts';
import { Icon, IconWeight } from '../icon';
import {
  type IconButtonProps,
  IconButtonSize,
  type IconButtonSizes,
  IconButtonVariant,
  type IconButtonVariants,
} from './types.ts';

const BOX: Readonly<Record<IconButtonSizes, ThemeSizes>> = {
  lg: 'controlLg',
  md: 'controlMd',
  sm: 'controlSm',
  xl: 'controlXl',
};

const ICON_COLOR: Readonly<Record<IconButtonVariants, ThemeColors>> = {
  accent: 'textOnAccent',
  ghost: 'textPrimary',
  inverse: 'textInverse',
  tonal: 'textPrimary',
};

const ICON_SIZE: Readonly<Record<IconButtonSizes, number>> = { lg: 28, md: 24, sm: 20, xl: 36 };

const isHovered = (state: PressableStateCallbackType) => {
  return 'hovered' in state && state.hovered === true;
};

export const IconButton = ({
  accessibilityLabel,
  icon,
  isActive = false,
  isDisabled = false,
  isFilled,
  isRound = false,
  onLongPress,
  onPress,
  size = IconButtonSize.Md,
  variant = IconButtonVariant.Ghost,
}: IconButtonProps) => {
  const { theme } = useUnistyles();
  styles.useVariants({ disabled: isDisabled, round: isRound, size, variant });

  const slop = useMemo(() => {
    return Math.max(0, (theme.size.touchTarget - theme.size[BOX[size]]) / 2);
  }, [theme.size, size]);

  const iconColor = isActive ? theme.colors.accentText : theme.colors[ICON_COLOR[variant]];

  return (
    <Pressable
      aria-disabled={isDisabled}
      aria-label={accessibilityLabel}
      aria-selected={isActive}
      disabled={isDisabled}
      hitSlop={slop}
      onLongPress={onLongPress}
      onPress={onPress}
      role="button"
      style={state => [
        styles.container,
        isHovered(state) && styles.hovered,
        state.pressed && styles.pressed,
      ]}
    >
      <Icon
        color={iconColor}
        isFilled={isFilled ?? isActive}
        name={icon}
        size={ICON_SIZE[size]}
        weight={size === IconButtonSize.Xl ? IconWeight.Medium : IconWeight.Regular}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    alignItems: 'center',
    borderRadius: theme.radius.default,
    justifyContent: 'center',
    variants: {
      disabled: {
        true: { opacity: theme.opacity.disabled },
      },
      round: {
        true: { borderRadius: theme.radius.pill },
      },
      size: {
        lg: { height: theme.size.controlLg, width: theme.size.controlLg },
        md: { height: theme.size.controlMd, width: theme.size.controlMd },
        sm: { height: theme.size.controlSm, width: theme.size.controlSm },
        xl: { height: theme.size.controlXl, width: theme.size.controlXl },
      },
      variant: {
        accent: { backgroundColor: theme.colors.accent },
        ghost: { backgroundColor: 'transparent' },
        inverse: { backgroundColor: theme.colors.surfaceInverse },
        tonal: { backgroundColor: theme.colors.surfaceElevated },
      },
    },
  },
  hovered: {
    variants: {
      variant: {
        accent: { backgroundColor: theme.colors.accentHover },
        ghost: { backgroundColor: theme.colors.surfaceRaised },
        inverse: { backgroundColor: theme.colors.surfaceInverseHover },
        tonal: { backgroundColor: theme.colors.surfaceHover },
      },
    },
  },
  pressed: {
    transform: [{ scale: theme.motion.pressScale.iconButton }],
  },
}));
