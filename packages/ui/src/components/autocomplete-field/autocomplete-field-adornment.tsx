import { Pressable } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { Icon } from '../icon';
import { AutocompleteFieldSpinner } from './autocomplete-field-spinner.tsx';
import type { AutocompleteFieldAdornmentProps } from './types.ts';

export const AutocompleteFieldAdornment = ({
  clearLabel,
  isLoading,
  isVisible,
  onClear,
}: AutocompleteFieldAdornmentProps) => {
  const { theme } = useUnistyles();

  if (isLoading) {
    return <AutocompleteFieldSpinner />;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <Pressable aria-label={clearLabel} hitSlop={theme.space.md} onPress={onClear} role="button">
      <Icon color={theme.colors.textTertiary} name="close" size={20} />
    </Pressable>
  );
};
