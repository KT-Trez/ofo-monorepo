import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import { Button, ButtonVariant } from '@ofo/ui/components/button';
import { IconGlyph } from '@ofo/ui/components/icon';

export default () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>OFO</Text>
        <Button iconStart={IconGlyph.Download} variant={ButtonVariant.Primary}>
          Pobierz
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
  },
  content: {
    gap: theme.space.lg,
    padding: theme.space['2xl'],
  },
  title: {
    ...theme.typography.variants.headingLg,
    color: theme.colors.textPrimary,
  },
}));
