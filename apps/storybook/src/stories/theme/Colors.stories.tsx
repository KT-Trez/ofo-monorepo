import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { darkColors, lightColors } from '@ofo/ui/theme/colors';
import { ThemeColor } from '@ofo/ui/theme/types';
import { Section } from '../../components/Section';
import { Swatch } from '../../components/Swatch';

const tokens = Object.values(ThemeColor);

const ColorsTable = () => (
  <Section title="Color tokens">
    <View style={styles.row}>
      <Text style={[styles.header, styles.token]}>Token</Text>
      <Text style={[styles.header, styles.column]}>Light</Text>
      <Text style={[styles.header, styles.column]}>Dark</Text>
    </View>

    {tokens.map(token => (
      <View key={token} style={styles.row}>
        <Text style={[styles.tokenName, styles.token]}>{token}</Text>
        <View style={styles.column}>
          <Swatch color={lightColors[token]} name="light" />
        </View>
        <View style={styles.column}>
          <Swatch color={darkColors[token]} name="dark" />
        </View>
      </View>
    ))}
  </Section>
);

const styles = StyleSheet.create(theme => ({
  column: {
    width: 260,
  },
  header: {
    ...theme.typography.variants.label,
    color: theme.colors.textTertiary,
  },
  row: {
    alignItems: 'center',
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: theme.space.lg,
    paddingVertical: theme.space.sm,
  },
  token: {
    width: 180,
  },
  tokenName: {
    ...theme.typography.variants.body,
    color: theme.colors.textPrimary,
  },
}));

const meta = {
  component: ColorsTable,
  title: 'Theme/Colors',
} satisfies Meta<typeof ColorsTable>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  name: 'Colors',
};
