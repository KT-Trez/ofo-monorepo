import type { ReactNode } from 'react';
import type { TextInputProps } from 'react-native';

type TextInputPassThroughProps = Pick<
  TextInputProps,
  | 'autoCapitalize'
  | 'autoComplete'
  | 'autoFocus'
  | 'keyboardType'
  | 'onSubmitEditing'
  | 'returnKeyType'
  | 'secureTextEntry'
>;

export type TextFieldProps = TextInputPassThroughProps & {
  accessibilityLabel?: string;
  adornmentEnd?: ReactNode;
  adornmentStart?: ReactNode;
  error?: string;
  hint?: string;
  label?: string;
  onBlur?: () => void;
  onChangeText: (value: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  value: string;
};

/** The label and text input inside the field; internal to TextField. */
export type TextFieldInputProps = TextInputPassThroughProps & {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  isFocused: boolean;
  isInvalid: boolean;
  label?: string;
  onBlur: () => void;
  onChangeText: (value: string) => void;
  onFocus: () => void;
  placeholder?: string;
  value: string;
};
