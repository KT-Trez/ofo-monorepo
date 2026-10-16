import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { TextField, TextFieldIcon, type TextFieldProps } from '@ofo/ui/components/text-field';

const styles = StyleSheet.create(theme => ({
  column: {
    gap: theme.space.sm,
  },
  frame: {
    maxWidth: 360,
  },
}));

const TextFieldPlayground = ({
  value: valueInit,
  ...props
}: Omit<TextFieldProps, 'onChangeText'>) => {
  const [value, setValue] = useState<string>(valueInit);

  return <TextField {...props} onChangeText={setValue} value={value} />;
};

const meta = {
  args: { value: '' },
  component: TextFieldPlayground,
  decorators: [
    Story => (
      <View style={styles.frame}>
        <Story />
      </View>
    ),
  ],
  title: 'Components/TextField',
} satisfies Meta<typeof TextFieldPlayground>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithHint: Story = {
  args: { hint: 'Wielkość w MB' },
};

export const WithIcon: Story = {
  args: {
    adornmentStart: <TextFieldIcon name="search" />,
  },
};

export const WithLabel: Story = {
  args: { label: 'Tytuł' },
};

export const WithPlaceholder: Story = {
  args: { placeholder: 'np. Kasza Beat' },
};

export const Error: Story = {
  args: { error: 'Tytuł nie może być pusty', label: 'Tytuł', placeholder: 'np. Kasza Beat' },
};

export const Type: Story = {
  args: {
    autoCapitalize: 'none',
    autoComplete: 'email',
    keyboardType: 'email-address',
    label: 'E-mail',
  },
  render: () => (
    <View style={styles.column}>
      <TextFieldPlayground
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        label="E-mail"
        value=""
      />

      <TextFieldPlayground
        autoComplete="password"
        hint="Znajdziesz go w konfiguracji serwera"
        label="Token dostępu"
        secureTextEntry
        value=""
      />
    </View>
  ),
};
