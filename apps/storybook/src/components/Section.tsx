import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type SectionProps = {
  children: ReactNode;
  title: string;
};

export const Section = ({ children, title }: SectionProps) => (
  <View style={styles.section}>
    <Text style={styles.title}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create(theme => ({
  section: {
    gap: theme.space.md,
    marginBottom: theme.space['3xl'],
  },
  title: {
    ...theme.typography.variants.label,
    color: theme.colors.textTertiary,
  },
}));
