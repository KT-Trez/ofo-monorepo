import { palette } from '@ofo/ui/theme/palette';
import type { Meta } from '@storybook/react-native-web-vite';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type { Story } from 'storybook/internal/toolsets-docs';
import { Section } from '../../components/Section';
import { Swatch } from '../../components/Swatch';

const GROUPS = {
  Amber: /^amber/,
  Graphite: /^graphite/,
  Ink: /^ink/,
  Status: /^(green|red|blue)/,
} as const;

const PaletteGrid = () => (
  <View>
    {Object.entries(GROUPS).map(([title, prefix]) => (
      <Section key={title} title={title}>
        <View style={styles.grid}>
          {Object.entries(palette).reduce<ReactElement[]>((acc, [name, color]) => {
            if (prefix.test(name)) {
              acc.push(<Swatch color={color} key={name} name={name} />);
            }

            return acc;
          }, [])}
        </View>
      </Section>
    ))}
  </View>
);

const styles = StyleSheet.create(theme => ({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.lg,
  },
}));

export default {
  component: PaletteGrid,
  title: 'Theme/Colors',
} satisfies Meta<typeof PaletteGrid>;

export const Palette: Story = {
  name: 'Palette',
};
