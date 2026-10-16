import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { ThemeColors } from '../../theme/types.ts';
import { Icon, IconWeight } from '../icon';
import { BadgeColor, type BadgeColors, type BadgeProps } from './types.ts';

const ICON_SIZE = 14;

const FOREGROUND: Readonly<Record<BadgeColors, ThemeColors>> = {
  danger: 'danger',
  info: 'info',
  neutral: 'textSecondary',
  success: 'success',
};

export const Badge = ({
  accessibilityLabel,
  children,
  icon,
  isIconFilled = false,
  isNumeric = false,
  color = BadgeColor.Neutral,
}: BadgeProps) => {
  const { theme } = useUnistyles();
  const isIconOnly = children === undefined;
  styles.useVariants({ iconOnly: isIconOnly, numeric: isNumeric, tone: color });

  return (
    <View
      aria-label={accessibilityLabel}
      role={isIconOnly ? 'img' : undefined}
      style={styles.badge}
    >
      {icon && (
        <Icon
          color={theme.colors[FOREGROUND[color]]}
          isFilled={isIconFilled}
          name={icon}
          size={ICON_SIZE}
          weight={IconWeight.Medium}
        />
      )}

      {!isIconOnly && (
        <Text numberOfLines={1} style={styles.label}>
          {children}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: theme.radius.default,
    flexDirection: 'row',
    gap: theme.space.xs,
    justifyContent: 'center',
    minHeight: theme.size.badge,
    variants: {
      iconOnly: {
        false: { paddingHorizontal: theme.space.sm },
        true: { minWidth: theme.size.badge },
      },
      tone: {
        danger: { backgroundColor: theme.colors.dangerSubtle },
        info: { backgroundColor: theme.colors.infoSubtle },
        neutral: { backgroundColor: theme.colors.surfaceElevated },
        success: { backgroundColor: theme.colors.successSubtle },
      },
    },
  },
  label: {
    ...theme.typography.variants.label,
    variants: {
      numeric: {
        true: {
          fontFamily: theme.typography.fontFamily.number.bold,
          fontVariant: ['tabular-nums'],
          letterSpacing:
            theme.typography.variants.label.fontSize * theme.typography.letterSpacing.number,
        },
      },
      tone: {
        danger: { color: theme.colors.danger },
        info: { color: theme.colors.info },
        neutral: { color: theme.colors.textSecondary },
        success: { color: theme.colors.success },
      },
    },
  },
}));
