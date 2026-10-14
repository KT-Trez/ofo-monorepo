import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { ThemeTextVariant, type ThemeTextVariants } from '@ofo/ui/theme/types';
import { typography } from '@ofo/ui/theme/typography';
import { Section } from '../../components/Section';

const samples: Record<ThemeTextVariants, string> = {
  body: 'Odtwarzaj muzykę z YouTube bez reklam',
  bodySm: 'Dodano do kolejki',
  caption: 'Daft Punk · 12 utworów',
  captionSm: 'Nazwa widoczna w bibliotece',
  headingLg: 'Ulubione',
  headingMd: 'Dodaj do playlisty',
  headingSm: 'Utwory w playliście',
  label: 'Ostatnio dodane',
  numberBpm: '128',
  numberTime: '1:23 · −2:19 · 4.2 MB',
  titleSm: 'Synchronizacja',
};

const variants = Object.values(ThemeTextVariant);

const TypographyScale = () => (
  <Section title="Text variants">
    {variants.map(variant => (
      <View key={variant} style={styles.row}>
        <Text style={styles.meta}>
          {variant} · {typography.variants[variant].fontSize}/
          {typography.variants[variant].lineHeight}
        </Text>

        <Text style={[styles.sample, typography.variants[variant]]}>{samples[variant]}</Text>
      </View>
    ))}
  </Section>
);

const styles = StyleSheet.create(theme => ({
  meta: {
    ...theme.typography.variants.numberTime,
    color: theme.colors.textTertiary,
    width: 200,
  },
  row: {
    alignItems: 'baseline',
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: theme.space.lg,
    paddingVertical: theme.space.md,
  },
  sample: {
    color: theme.colors.textPrimary,
    flexShrink: 1,
  },
}));

const meta = {
  component: TypographyScale,
  title: 'Theme/Typography',
} satisfies Meta<typeof TypographyScale>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Typography: Story = {
  name: 'Typography',
};
