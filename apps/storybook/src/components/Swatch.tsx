import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type SwatchProps = {
  color: string;
  name: string;
};

export const Swatch = ({ color, name }: SwatchProps) => (
  <View style={styles.swatch}>
    <View style={[styles.chip, { backgroundColor: color }]} />
    <View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.value}>{color}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create(theme => ({
  chip: {
    borderColor: theme.colors.border,
    borderRadius: theme.radius.default,
    borderWidth: 1,
    height: theme.size.controlMd,
    width: theme.size.controlMd,
  },
  name: {
    ...theme.typography.variants.body,
    color: theme.colors.textPrimary,
  },
  swatch: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space.md,
    width: 240,
  },
  value: {
    ...theme.typography.variants.numberTime,
    color: theme.colors.textSecondary,
  },
}));
