import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { AutocompleteFieldOption } from './autocomplete-field-option.tsx';
import type { AutocompleteFieldListProps } from './types.ts';

export const AutocompleteFieldList = ({
  emptyText,
  onOptionPressIn,
  onOptionPressOut,
  onPick,
  options,
  query,
}: AutocompleteFieldListProps) => {
  const appearance = useRef(new Animated.Value(0)).current;
  const { theme } = useUnistyles();

  useEffect(() => {
    Animated.timing(appearance, {
      duration: theme.motion.duration.fast,
      easing: Easing.bezier(...theme.motion.easing.out),
      toValue: 1,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [appearance, theme.motion]);

  return (
    <Animated.View role="list" style={[styles.list, { opacity: appearance }]}>
      {options.length === 0 && <Text style={styles.empty}>{emptyText}</Text>}

      {options.map((option, index) => (
        <AutocompleteFieldOption
          key={`${option.label}-${index}`}
          onPress={() => onPick(option)}
          onPressIn={onOptionPressIn}
          onPressOut={onOptionPressOut}
          option={option}
          query={query}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create(theme => ({
  empty: {
    ...theme.typography.variants.bodySm,
    color: theme.colors.textTertiary,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
  },
  list: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.radius.default,
    boxShadow: theme.shadows.overlay,
    left: 0,
    marginTop: theme.space.xs,
    padding: theme.space.xs,
    position: 'absolute',
    right: 0,
    top: '100%',
    zIndex: 30,
  },
}));
