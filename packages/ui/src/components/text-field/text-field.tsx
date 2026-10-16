import { useState } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { TextFieldInput } from './text-field-input.tsx';
import type { TextFieldProps } from './types.ts';

export const TextField = ({
  accessibilityLabel,
  adornmentEnd,
  adornmentStart,
  error,
  hint,
  label,
  onBlur,
  onFocus,
  ...inputProps
}: TextFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const isInvalid = error !== undefined;
  const message = error ?? hint;
  styles.useVariants({ focused: isFocused, invalid: isInvalid, labelled: label !== undefined });

  return (
    <View style={styles.root}>
      <View style={styles.field}>
        {adornmentStart}

        <TextFieldInput
          {...inputProps}
          accessibilityHint={message}
          accessibilityLabel={label ?? accessibilityLabel ?? inputProps.placeholder}
          isFocused={isFocused}
          isInvalid={isInvalid}
          label={label}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
        />

        {adornmentEnd}
      </View>

      {message !== undefined && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  field: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: 'transparent',
    borderRadius: theme.radius.default,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: theme.space.sm,
    paddingHorizontal: theme.space.md,
    variants: {
      focused: {
        true: { borderColor: theme.colors.accent },
      },
      // after `focused`, so an error stays red while editing.
      invalid: {
        true: { borderColor: theme.colors.danger },
      },
      labelled: {
        false: { minHeight: theme.size.field },
        true: { minHeight: theme.size.fieldLabelled },
      },
    },
  },
  message: {
    ...theme.typography.variants.captionSm,
    paddingLeft: theme.space.md,
    variants: {
      invalid: {
        false: { color: theme.colors.textTertiary },
        true: { color: theme.colors.danger },
      },
    },
  },
  root: {
    gap: theme.space.xs,
  },
}));
