import { darkColors, lightColors, type ThemeColors } from '@ofo/ui/theme/colors';
import type { Meta } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type { Story } from 'storybook/internal/toolsets-docs';
import type { KeyAsString } from 'type-fest';
import { Section } from '../../components/Section';
import { Swatch } from '../../components/Swatch';

const tokens = Object.keys(darkColors) as KeyAsString<ThemeColors>[];

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

export default {
  component: ColorsTable,
  title: 'Theme/Colors',
} satisfies Meta<typeof ColorsTable>;

export const Colors: Story = {
  name: 'Colors',
};
