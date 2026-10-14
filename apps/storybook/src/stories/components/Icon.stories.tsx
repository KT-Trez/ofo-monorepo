import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Icon, IconGlyph, IconWeight } from '@ofo/ui/components/icon';

const GLYPHS = Object.values(IconGlyph);

const styles = StyleSheet.create(theme => ({
  cell: {
    alignItems: 'center',
    gap: theme.space.xs,
    width: 96,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.lg,
  },
  name: {
    ...theme.typography.variants.captionSm,
    color: theme.colors.textSecondary,
  },
}));

const meta = {
  argTypes: {
    isFilled: { control: 'boolean' },
    name: { control: 'select', options: Object.values(IconGlyph) },
    size: { control: { max: 48, min: 12, step: 2, type: 'range' } },
    weight: { control: 'inline-radio', options: Object.values(IconWeight) },
  },
  args: {
    isFilled: false,
    name: 'download',
    size: 24,
    weight: IconWeight.Regular,
  },
  component: Icon,
  title: 'Components/Icon',
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Filled: Story = {
  render: args => (
    <View style={styles.grid}>
      {GLYPHS.map(name => (
        <View key={name} style={styles.cell}>
          <Icon {...args} isFilled name={name} />
          <Text style={styles.name}>{name}</Text>
        </View>
      ))}
    </View>
  ),
};

export const Glyphs: Story = {
  render: args => (
    <View style={styles.grid}>
      {GLYPHS.map(name => (
        <View key={name} style={styles.cell}>
          <Icon {...args} name={name} />
          <Text style={styles.name}>{name}</Text>
        </View>
      ))}
    </View>
  ),
};
