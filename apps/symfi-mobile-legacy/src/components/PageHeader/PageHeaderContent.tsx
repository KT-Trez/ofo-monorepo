import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type PageHeaderContentProps = {
  subtitle?: string;
  title: string;
};

export const PageHeaderContent = ({ subtitle, title }: PageHeaderContentProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.view}>
      <Text style={[{ color: colors.onPrimary }, styles.title]}>{title}</Text>
      {subtitle && <Text style={[{ color: colors.onPrimary }, styles.subtitle]}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  view: {
    display: 'flex',
  },
});
