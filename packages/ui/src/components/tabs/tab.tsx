import { Pressable, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Icon } from '../icon';
import type { TabProps } from './types.ts';

const ICON_SIZE = 18;

export const Tab = <TValue extends string>({
  isFullwidth,
  isIconOnly,
  isSelected,
  onChange,
  onLayout,
  option,
  size,
}: TabProps<TValue>) => {
  const { theme } = useUnistyles();
  styles.useVariants({ full: isFullwidth, size });

  const color = isSelected ? theme.colors.textPrimary : theme.colors.textSecondary;

  return (
    <Pressable
      aria-label={option.label}
      aria-selected={isSelected}
      key={option.value}
      onLayout={event => onLayout(event, isSelected, option)}
      onPress={() => onChange(option.value)}
      role="tab"
      style={[styles.segment, isIconOnly && styles.segmentIconOnly]}
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
};

const styles = StyleSheet.create(theme => ({
  label: {
    userSelect: 'none',
    variants: {
      size: {
        md: {
          ...theme.typography.variants.bodySm,
          fontFamily: theme.typography.fontFamily.text.semibold,
        },
        sm: {
          ...theme.typography.variants.caption,
          fontFamily: theme.typography.fontFamily.text.semibold,
        },
      },
    },
  },
  segment: {
    alignItems: 'center',
    borderRadius: theme.radius.default,
    flexDirection: 'row',
    gap: theme.space.xs,
    justifyContent: 'center',
    paddingHorizontal: theme.space.md,
    variants: {
      full: {
        true: { flex: 1 },
      },
    },
  },
  segmentIconOnly: {
    paddingHorizontal: theme.space.sm,
  },
}));
