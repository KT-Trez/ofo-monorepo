import type { IconName } from '../icon';

export type AutocompleteFieldAdornmentProps = {
  clearLabel: string;
  isVisible: boolean;
  isLoading: boolean;
  onClear: () => void;
};

export type AutocompleteFieldHighlightProps = {
  label: string;
  query: string;
};

export type AutocompleteFieldListProps = {
  emptyText?: string;
  onOptionPressIn: () => void;
  onOptionPressOut: () => void;
  onPick: (option: AutocompleteFieldOption) => void;
  options: readonly AutocompleteFieldOption[];
  query: string;
};

export type AutocompleteFieldOption = {
  hint?: string;
  icon?: IconName;
  label: string;
};

export type AutocompleteFieldOptionProps = {
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  option: AutocompleteFieldOption;
  query: string;
};

export type AutocompleteFieldProps = {
  accessibilityLabel?: string;
  clearLabel: string;
  emptyText?: string;
  icon?: IconName;
  isLoading?: boolean;
  maxItems?: number;
  onChangeText: (value: string) => void;
  onSelect: (option: AutocompleteFieldOption) => void;
  onSubmit?: (value: string) => void;
  options: readonly AutocompleteFieldOption[];
  placeholder?: string;
  value: string;
};
