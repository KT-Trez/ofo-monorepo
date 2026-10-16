import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { fn } from 'storybook/test';
import {
  AutocompleteField,
  type AutocompleteFieldOption,
} from '@ofo/ui/components/autocomplete-field';

const styles = StyleSheet.create(theme => ({
  frame: {
    maxWidth: 360,
    minHeight: 360, // room for the list under the field.
    paddingTop: theme.space.sm,
  },
}));

const RECENT_OPTIONS_LIST: AutocompleteFieldOption[] = [
  { icon: 'history', label: 'kasza beat' },
  { icon: 'history', label: 'muzyka do biegania 170 bpm' },
  { icon: 'history', label: 'mira sound' },
];

const SUGGESTIONS_LIST: string[] = [
  'kasza beat',
  'kasza beat nocny bieg',
  'kasza beat live',
  'muzyka do biegania 170 bpm',
  'mira sound',
  'brzask pod górę',
];

const suggest = (query: string): AutocompleteFieldOption[] => {
  const text = query.trim().toLowerCase();

  if (!text) {
    return RECENT_OPTIONS_LIST;
  }

  return SUGGESTIONS_LIST.filter(suggestion => suggestion.includes(text)).map(label => ({ label }));
};

type AutocompletePlaygroundProps = {
  isLoading: boolean;
  onSelect: (option: AutocompleteFieldOption) => void;
  value: string;
};

const AutocompletePlayground = ({
  isLoading,
  onSelect,
  value: valueInit,
}: AutocompletePlaygroundProps) => {
  const [query, setQuery] = useState<string>(valueInit);

  return (
    <AutocompleteField
      clearLabel="Wyczyść"
      emptyText="Brak podpowiedzi"
      isLoading={isLoading}
      onChangeText={setQuery}
      onSelect={onSelect}
      options={suggest(query)}
      placeholder="Szukaj w zapisanych"
      value={query}
    />
  );
};

const meta = {
  args: { isLoading: false, onSelect: fn(), value: '' },
  component: AutocompletePlayground,
  decorators: [
    Story => (
      <View style={styles.frame}>
        <Story />
      </View>
    ),
  ],
  title: 'Components/AutocompleteField',
} satisfies Meta<typeof AutocompletePlayground>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithClearButton: Story = {
  args: { value: 'kasza' },
};

export const WithLoader: Story = {
  args: { isLoading: true, value: 'kasza' },
};

export const WithNoSuggestions: Story = {
  args: { value: 'xyz' },
};
