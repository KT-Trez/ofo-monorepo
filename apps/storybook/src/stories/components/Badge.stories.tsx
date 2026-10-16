import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Badge, BadgeColor } from '@ofo/ui/components/badge';
import { IconGlyph } from '@ofo/ui/components/icon';

const styles = StyleSheet.create(theme => ({
  column: {
    gap: theme.space.sm,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.sm,
  },
}));

const meta = {
  argTypes: {
    color: { control: 'inline-radio', options: Object.values(BadgeColor) },
    icon: { control: 'select', options: Object.values(IconGlyph) },
  },
  args: {
    children: 'Offline',
    color: BadgeColor.Neutral,
    icon: 'cloud_off',
  },
  component: Badge,
  title: 'Components/Badge',
} satisfies Meta<typeof Badge>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Colors: Story = {
  render: () => (
    <View style={styles.row}>
      {Object.values(BadgeColor).map(color => (
        <Badge color={color} key={color} icon="stop_circle">
          {color}
        </Badge>
      ))}
    </View>
  ),
};

export const WithFilledIcon: Story = { args: { isIconFilled: true } };

export const WithNoLabel: Story = {
  args: { accessibilityLabel: 'Icon only badge', children: undefined },
};

export const WithNumericText: Story = {
  args: { children: '42%', icon: 'downloading', isNumeric: true },
};
