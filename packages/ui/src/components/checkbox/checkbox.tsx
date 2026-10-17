import { useMemo } from 'react';
import { Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Icon, IconWeight } from '../icon';
import type { CheckboxProps } from './types.ts';

const ICON_SIZE = 18;

export const Checkbox = ({
  accessibilityLabel,
  isChecked,
  isDisabled = false,
  isIndeterminate = false,
  onChange,
}: CheckboxProps) => {
  const { theme } = useUnistyles();
  const isFilled = isChecked || isIndeterminate;
  styles.useVariants({ disabled: isDisabled, filled: isFilled });

  const slop = useMemo(() => {
    return Math.max(0, (theme.size.touchTarget - theme.size.checkbox) / 2);
  }, [theme.size]);

  return (
    <Pressable
      aria-checked={isIndeterminate ? 'mixed' : isChecked}
      aria-disabled={isDisabled}
      aria-label={accessibilityLabel}
      disabled={isDisabled}
      hitSlop={slop}
      onPress={() => onChange(isIndeterminate || !isChecked)}
      role="checkbox"
      style={styles.box}
    >
      {isFilled && (
        <Icon
          color={theme.colors.textOnAccent}
          name={isIndeterminate ? 'remove' : 'check'}
          size={ICON_SIZE}
          weight={IconWeight.Medium}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create(theme => ({
  box: {
    alignItems: 'center',
    borderRadius: theme.radius.default,
    height: theme.size.checkbox,
    justifyContent: 'center',
    variants: {
      disabled: {
        true: { opacity: theme.opacity.disabled },
      },
      filled: {
        false: { borderColor: theme.colors.textTertiary, borderWidth: 2 },
        true: { backgroundColor: theme.colors.accent },
      },
    },
    width: theme.size.checkbox,
  },
}));
