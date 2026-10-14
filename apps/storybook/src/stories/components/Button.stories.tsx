import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { fn } from 'storybook/test';
import { Button, ButtonSize, ButtonVariant } from '@ofo/ui/components/button';
import { IconGlyph } from '@ofo/ui/components/icon';

const styles = StyleSheet.create(theme => ({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.md,
  },
}));

const meta = {
  argTypes: {
    iconEnd: { control: 'select', options: Object.values(IconGlyph) },
    iconStart: { control: 'select', options: Object.values(IconGlyph) },
    size: { control: 'inline-radio', options: Object.values(ButtonSize) },
    variant: { control: 'inline-radio', options: Object.values(ButtonVariant) },
  },
  args: {
    children: 'Pobierz',
    isDisabled: false,
    isFullwidth: false,
    onPress: fn(),
    size: ButtonSize.Md,
    variant: ButtonVariant.Primary,
  },
  component: Button,
  title: 'Components/Button',
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: args => (
    <View style={styles.row}>
      {Object.values(ButtonVariant).map(variant => (
        <Button {...args} key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </View>
  ),
};

export const Sizes: Story = {
  render: args => (
    <View style={styles.row}>
      {Object.values(ButtonSize).map(size => (
        <Button {...args} key={size} size={size} />
      ))}
    </View>
  ),
};

export const Disabled: Story = {
  args: { isDisabled: true },
};

export const FullWidth: Story = {
  args: { isFullwidth: true },
};

export const WithIcon: Story = {
  args: { iconStart: 'download' },
};
