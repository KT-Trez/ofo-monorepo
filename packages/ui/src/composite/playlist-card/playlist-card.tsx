import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Cover } from '../../components/cover';
import { Icon, IconGlyph } from '../../components/icon';
import type { PlaylistCardProps } from './types.ts';

const SYNC_ICON_SIZE = 16;

export const PlaylistCard = ({
  coverSeed,
  isSelected = false,
  isSynced = false,
  onPress,
  title,
  trackCount,
  trackCountLabel,
}: PlaylistCardProps) => {
  const { theme } = useUnistyles();

  return (
    <Pressable
      aria-label={`${title}, ${trackCount} ${trackCountLabel}`}
      aria-selected={isSelected}
      onPress={onPress}
      role="button"
      style={state => [styles.card, state.pressed && styles.pressed]}
    >
      <Cover icon={IconGlyph.QueueMusic} isSelected={isSelected} seed={coverSeed} />

      <View style={styles.text}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        <View style={styles.meta}>
          {isSynced && (
            <Icon
              color={theme.colors.success}
              isFilled
              name={IconGlyph.CloudDone}
              size={SYNC_ICON_SIZE}
            />
          )}

          <Text numberOfLines={1} style={styles.caption}>
            <Text style={styles.count}>{trackCount}</Text> {trackCountLabel}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create(theme => ({
  caption: {
    ...theme.typography.variants.caption,
    color: theme.colors.textSecondary,
    flexShrink: 1,
  },
  card: {
    gap: theme.space.sm,
    minWidth: 0,
  },
  count: {
    fontFamily: theme.typography.fontFamily.number.regular,
    fontVariant: ['tabular-nums'],
    letterSpacing:
      theme.typography.variants.caption.fontSize * theme.typography.letterSpacing.number,
  },
  meta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space.xs,
  },
  pressed: {
    transform: [{ scale: theme.motion.pressScale.button }],
  },
  text: {
    gap: theme.space['2xs'],
  },
  title: {
    ...theme.typography.variants.body,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.text.bold,
    letterSpacing: theme.typography.variants.body.fontSize * -0.01,
  },
}));
