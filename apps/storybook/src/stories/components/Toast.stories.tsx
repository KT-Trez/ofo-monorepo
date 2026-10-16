import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { fn } from 'storybook/test';
import { IconGlyph } from '@ofo/ui/components/icon';
import { Toast } from '@ofo/ui/components/toast';

const styles = StyleSheet.create(theme => ({
  frame: {
    gap: theme.space.md,
    maxWidth: 360,
  },
}));

const meta = {
  argTypes: {
    icon: { control: 'select', options: Object.values(IconGlyph) },
  },
  args: {
    actionLabel: 'Cofnij',
    icon: 'download',
    message: 'Dodano do kolejki pobierania',
    onAction: fn(),
  },
  component: Toast,
  decorators: [
    Story => (
      <View style={styles.frame}>
        <Story />
      </View>
    ),
  ],
  title: 'Components/Toast',
} satisfies Meta<typeof Toast>;
export default meta;

type Story = StoryObj<typeof Toast>;

export const Playground: Story = {};

export const LongMessage: Story = {
  args: {
    actionLabel: 'Załóż konto',
    icon: 'cloud_off',
    message: 'Synchronizacja wymaga konta. Utwory zostaną na tym urządzeniu.',
    onAction: fn(),
  },
};

export const WithoutAction: Story = {
  // Clears the action inherited from the meta args.
  args: {
    actionLabel: undefined,
    icon: 'timer',
    message: 'Metronom: 128 BPM',
    onAction: undefined,
  },
};
