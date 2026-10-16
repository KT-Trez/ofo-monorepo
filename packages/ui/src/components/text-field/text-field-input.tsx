import { Text, TextInput, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { TextFieldInputProps } from './types.ts';

export const TextFieldInput = ({ isFocused, isInvalid, label, ...props }: TextFieldInputProps) => {
  const { theme } = useUnistyles();
  styles.useVariants({ focused: isFocused, invalid: isInvalid });

  return (
    <View style={styles.area}>
      {label !== undefined && (
        <Text aria-hidden numberOfLines={1} style={styles.label}>
          {label}
        </Text>
      )}

      <TextInput
        {...props}
        placeholderTextColor={theme.colors.textTertiary}
        selectionColor={theme.colors.accent}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  area: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    ...theme.typography.variants.body,
    color: theme.colors.textPrimary,
    outlineStyle: 'solid',
    outlineWidth: 0,
    padding: 0,
  },
  label: {
    ...theme.typography.variants.captionSm,
    color: theme.colors.textTertiary,
    fontFamily: theme.typography.fontFamily.text.semibold,
    variants: {
      focused: {
        true: { color: theme.colors.accentText },
      },
      // after `focused`, so an error stays red while editing.
      invalid: {
        true: { color: theme.colors.danger },
      },
    },
  },
}));
