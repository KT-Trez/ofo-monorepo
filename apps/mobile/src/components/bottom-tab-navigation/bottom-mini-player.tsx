import { useTranslation } from '@ofo/i18n';
import { useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export const BottomMiniPlayer = () => {
  const router = useRouter();
  const { t } = useTranslation();

  // todo: the real mini player, shown only while something plays
  return (
    <Pressable onPress={() => router.push('/player')} role="button" style={styles.miniPlayer}>
      <Text style={styles.miniPlayerLabel}>{t('miniPlayer')}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create(theme => ({
  miniPlayer: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.radius.default,
    height: theme.size.miniPlayer,
    justifyContent: 'center',
    margin: theme.space.sm,
  },
  miniPlayerLabel: {
    ...theme.typography.variants.body,
    color: theme.colors.textSecondary,
  },
}));
