import { escapeRegExp } from 'es-toolkit';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type { AutocompleteFieldHighlightProps } from './types.ts';

export const AutocompleteFieldHighlight = ({ label, query }: AutocompleteFieldHighlightProps) => {
  const needle = query.trim();
  const match = needle ? new RegExp(escapeRegExp(needle), 'i').exec(label) : null;

  if (!match) {
    return label;
  }

  const start = match.index;
  const end = start + match[0].length;

  return (
    <>
      {label.slice(0, start)}
      <Text style={styles.match}>{label.slice(start, end)}</Text>
      {label.slice(end)}
    </>
  );
};

const styles = StyleSheet.create(theme => ({
  match: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.text.bold,
  },
}));
