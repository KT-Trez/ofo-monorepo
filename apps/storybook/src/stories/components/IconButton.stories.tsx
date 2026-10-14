import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { fn } from 'storybook/test';
import { IconGlyph } from '@ofo/ui/components/icon';
import { IconButton, IconButtonSize, IconButtonVariant } from '@ofo/ui/components/icon-button';

const styles = StyleSheet.create(theme => ({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.md,
  },
}));

/** Smallest to largest; the enum keys are sorted alphabetically. */
const SIZES = [IconButtonSize.Sm, IconButtonSize.Md, IconButtonSize.Lg, IconButtonSize.Xl];

const meta = {
  argTypes: {
    icon: { control: 'select', options: Object.values(IconGlyph) },
    size: { control: 'inline-radio', options: SIZES },
    variant: { control: 'inline-radio', options: Object.values(IconButtonVariant) },
  },
  args: {
    accessibilityLabel: 'Więcej',
    icon: 'more_vert',
    isActive: false,
    isDisabled: false,
    isRound: false,
    onPress: fn(),
    size: IconButtonSize.Md,
    variant: IconButtonVariant.Ghost,
  },
  component: IconButton,
  title: 'Components/IconButton',
} satisfies Meta<typeof IconButton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: args => (
    <View style={styles.row}>
      {Object.values(IconButtonVariant).map(variant => (
        <IconButton {...args} key={variant} variant={variant} />
      ))}
    </View>
  ),
};

export const Sizes: Story = {
  render: args => (
    <View style={styles.row}>
      {SIZES.map(size => (
        <IconButton {...args} key={size} size={size} />
      ))}
    </View>
  ),
};

/** Player transport: previous and next are `lg`, play is `xl`, accent and round. */
export const PlayerControls: Story = {
  render: args => (
    <View style={styles.row}>
      <IconButton
        {...args}
        accessibilityLabel="Poprzedni"
        icon="skip_previous"
        isFilled
        size={IconButtonSize.Lg}
      />
      <IconButton
        {...args}
        accessibilityLabel="Odtwórz"
        icon="play_arrow"
        isFilled
        isRound
        size={IconButtonSize.Xl}
        variant={IconButtonVariant.Accent}
      />
      <IconButton
        {...args}
        accessibilityLabel="Następny"
        icon="skip_next"
        isFilled
        size={IconButtonSize.Lg}
      />
    </View>
  ),
};

/** Toggles such as autoplay and the metronome: amber, filled glyph when on. */
export const Active: Story = {
  args: { accessibilityLabel: 'Metronom', icon: 'timer', isActive: true },
};

export const Disabled: Story = {
  args: { isDisabled: true },
};
