import { Cover } from '@ofo/ui/components/cover';
import { IconGlyph } from '@ofo/ui/components/icon';
import type { Decorator, Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const SEEDS = Array.from(
  { length: 12 },
  (_, index) => `3d4e-8a00-${(index + 1).toString(16).padStart(4, '0')}`,
);

const WIDTHS = [64, 120, 164, 240, 360];

const styles = StyleSheet.create(theme => ({
  cell: {
    gap: theme.space.xs,
    width: 120,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.md,
  },
  label: {
    ...theme.typography.variants.captionSm,
    color: theme.colors.textSecondary,
  },
  single: {
    width: 164,
  },
  sizes: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.md,
  },
}));

const withCoverWidth: Decorator = Story => (
  <View style={styles.single}>
    <Story />
  </View>
);

const meta = {
  argTypes: {
    icon: { control: 'select', options: Object.values(IconGlyph) },
  },
  args: {
    icon: IconGlyph.QueueMusic,
    isSelected: false,
    seed: SEEDS[0]!,
  },
  component: Cover,
  decorators: [withCoverWidth],
  title: 'Components/Cover',
} satisfies Meta<typeof Cover>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Selected: Story = { args: { isSelected: true } };

export const Seeds: Story = {
  decorators: [],
  render: args => (
    <View style={styles.grid}>
      {SEEDS.map(seed => (
        <View key={seed} style={styles.cell}>
          <Cover {...args} seed={seed} />
          <Text style={styles.label}>{seed}</Text>
        </View>
      ))}
    </View>
  ),
};

export const Sizes: Story = {
  decorators: [],
  render: args => (
    <View style={styles.sizes}>
      {WIDTHS.map(width => (
        <View key={width} style={[styles.cell, { width }]}>
          <Cover {...args} />
          <Text style={styles.label}>{width}px</Text>
        </View>
      ))}
    </View>
  ),
};
