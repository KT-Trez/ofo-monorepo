import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';

type SectionProps = {
  children: ReactNode;
  hasDivider?: boolean;
  title: string;
};

export const Section = ({ children, hasDivider = false, title }: SectionProps) => {
  return (
    <View>
      {hasDivider && <Divider />}
      <Text style={styles.title} variant="titleMedium">
        {title}
      </Text>
      <View style={styles.container}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 8,
  },
  title: {
    paddingHorizontal: 8,
    paddingTop: 16,
  },
});
