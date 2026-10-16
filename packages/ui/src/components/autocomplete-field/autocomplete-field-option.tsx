import { Pressable, type PressableStateCallbackType, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Icon } from '../icon';
import { AutocompleteFieldHighlight } from './autocomplete-field-highlight.tsx';
import type { AutocompleteFieldOptionProps } from './types.ts';

const isHighlighted = (state: PressableStateCallbackType) => {
  return state.pressed || ('hovered' in state && state.hovered === true);
};

export const AutocompleteFieldOption = ({
  onPress,
  onPressIn,
  onPressOut,
  option,
  query,
}: AutocompleteFieldOptionProps) => {
  const { theme } = useUnistyles();

  return (
    <Pressable
      aria-label={option.label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      role="option"
      style={state => [styles.option, isHighlighted(state) && styles.highlighted]}
    >
      <Icon color={theme.colors.textTertiary} name={option.icon ?? 'search'} size={20} />

      <Text numberOfLines={1} style={styles.label}>
        <AutocompleteFieldHighlight label={option.label} query={query} />
      </Text>

      {option.hint && <Text style={styles.meta}>{option.hint}</Text>}

      <Icon color={theme.colors.textTertiary} name="north_west" size={18} />
    </Pressable>
  );
};

const styles = StyleSheet.create(theme => ({
  highlighted: {
    backgroundColor: theme.colors.surfaceHover,
  },
  label: {
    ...theme.typography.variants.body,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  meta: {
    ...theme.typography.variants.captionSm,
    color: theme.colors.textTertiary,
  },
  option: {
    alignItems: 'center',
    borderRadius: theme.radius.default,
    flexDirection: 'row',
    gap: theme.space.sm,
    minHeight: theme.size.controlMd,
    paddingHorizontal: theme.space.sm,
  },
}));
