import { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { TextField, TextFieldIcon } from '../text-field';
import { AutocompleteFieldAdornment } from './autocomplete-field-adornment.tsx';
import { AutocompleteFieldList } from './autocomplete-field-list.tsx';
import type { AutocompleteFieldOption, AutocompleteFieldProps } from './types.ts';

const CLOSE_DELAY_MS = 120; // time to animate selected option
const DEFAULT_MAX_ITEMS = 6;

export const AutocompleteField = ({
  accessibilityLabel,
  clearLabel,
  emptyText,
  icon = 'search',
  isLoading = false,
  maxItems = DEFAULT_MAX_ITEMS,
  onChangeText,
  onSelect,
  onSubmit,
  options,
  placeholder,
  value,
}: AutocompleteFieldProps) => {
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // on the web, pressing an option blurs the input before the press ends; the list must stay open
  const isPressingOption = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  const optionsOnScreen = useMemo(() => options.slice(0, maxItems), [options, maxItems]);

  const isExpanded = isOpen && (optionsOnScreen.length > 0 || emptyText !== undefined);

  const handleBlur = () => {
    if (!isPressingOption.current) {
      closeTimer.current = setTimeout(() => setIsOpen(false), CLOSE_DELAY_MS);
    }
  };

  const handleClear = () => {
    onChangeText('');
    setIsOpen(true);
  };

  const handleFocus = () => {
    clearTimeout(closeTimer.current);
    setIsOpen(true);
  };

  const handleOptionPressIn = () => {
    isPressingOption.current = true;
  };

  const handleOptionPressOut = () => {
    isPressingOption.current = false;
  };

  const handlePick = (option: AutocompleteFieldOption) => {
    onChangeText(option.label);
    onSelect(option);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    setIsOpen(false);
    onSubmit?.(value);
  };

  const handleTextChange = (text: string) => {
    onChangeText(text);
    setIsOpen(true);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <View aria-expanded={isExpanded} role="combobox" style={styles.root}>
      <TextField
        accessibilityLabel={accessibilityLabel}
        adornmentEnd={
          <AutocompleteFieldAdornment
            clearLabel={clearLabel}
            isLoading={isLoading}
            isVisible={value !== ''}
            onClear={handleClear}
          />
        }
        adornmentStart={<TextFieldIcon name={icon} />}
        onBlur={handleBlur}
        onChangeText={handleTextChange}
        onFocus={handleFocus}
        onSubmitEditing={handleSubmit}
        placeholder={placeholder}
        returnKeyType="search"
        value={value}
      />

      {isExpanded && (
        <AutocompleteFieldList
          emptyText={emptyText}
          onOptionPressIn={handleOptionPressIn}
          onOptionPressOut={handleOptionPressOut}
          onPick={handlePick}
          options={optionsOnScreen}
          query={value}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create(() => ({
  root: {
    zIndex: 30,
  },
}));
