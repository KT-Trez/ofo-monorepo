import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Icon } from '../icon';
import type { ToggleButtonProps } from './types.ts';

const ICON_SIZE = 18;

export const ToggleButton = <TValue extends string>({
  accessibilityLabel,
  isIconOnly = false,
  onChange,
  options,
  value,
}: ToggleButtonProps<TValue>) => {
  const { theme } = useUnistyles();
  styles.useVariants({ iconOnly: isIconOnly });

  const slop = useMemo(() => {
    return Math.max(0, (theme.size.touchTarget - theme.size.controlSm) / 2);
  }, [theme.size]);

  return (
    <View aria-label={accessibilityLabel} role="radiogroup" style={styles.group}>
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const color = isSelected ? theme.colors.bg : theme.colors.textPrimary;
        // a divider is hidden next to the selected segment, which is filled anyway.
        const hasDivider = index > 0 && !isSelected && options[index - 1]?.value !== value;

        return (
          <Pressable
            aria-checked={isSelected}
            aria-label={option.label}
            hitSlop={{ bottom: slop, top: slop }}
            key={option.value}
            onPress={() => onChange(option.value)}
            role="radio"
            style={[
              styles.segment,
              index > 0 && styles.divider,
              index > 0 && !hasDivider && styles.dividerHidden,
              isSelected && styles.selected,
            ]}
          >
            {option.icon && (
              <Icon color={color} isFilled={isSelected} name={option.icon} size={ICON_SIZE} />
            )}

            {!isIconOnly && (
              <Text numberOfLines={1} style={[styles.label, { color }]}>
                {option.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  divider: {
    borderLeftColor: theme.colors.borderStrong,
    borderLeftWidth: 1,
  },
  dividerHidden: {
    borderLeftColor: 'transparent',
  },
  group: {
    alignSelf: 'flex-start',
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.default,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  label: {
    ...theme.typography.variants.caption,
    fontFamily: theme.typography.fontFamily.text.semibold,
  },
  segment: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space.xs,
    justifyContent: 'center',
    // The outline adds 1 px on each side, so the group is exactly `controlSm` tall.
    minHeight: theme.size.controlSm - 2,
    variants: {
      iconOnly: {
        false: { paddingHorizontal: theme.space.md },
        true: { minWidth: theme.size.controlSm - 2 },
      },
    },
  },
  selected: {
    backgroundColor: theme.colors.textPrimary,
  },
}));
