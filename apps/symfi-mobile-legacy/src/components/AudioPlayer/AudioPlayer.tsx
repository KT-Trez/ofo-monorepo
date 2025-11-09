import Slider from '@react-native-community/slider';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { Cover } from '../Cover';
import { useAudioPlayer } from './context';

export const AudioPlayer = () => {
  const { colors, roundness } = useTheme();
  const {
    currentSong,
    isLooping,
    isPaused,
    isShuffled,
    moveTo,
    playNext,
    playPrevious,
    progress,
    stop,
    toggleLooping,
    togglePause,
    toggleShuffle,
  } = useAudioPlayer();

  if (!currentSong) {
    return null;
  }

  const isOverOneHourLong = currentSong.duration.seconds > 3600;

  return (
    <View style={[styles.container, { backgroundColor: colors.primary, borderRadius: roundness }]}>
      <View style={styles.infoContainer}>
        <Cover uri={currentSong.cover} width="30%" />

        <View style={styles.infoTextContainer}>
          <Text style={{ color: colors.onPrimary }} numberOfLines={2} variant="titleSmall">
            {currentSong?.name ?? 'N/A'}
          </Text>
          <Text numberOfLines={1} style={{ color: colors.onPrimary }} variant="bodySmall">
            {currentSong?.channel.name ?? 'Author'}
          </Text>
        </View>
      </View>

      <View style={styles.horizontalStack}>
        <IconButton
          icon="motion-play-outline"
          iconColor={isLooping ? colors.secondaryContainer : colors.onPrimary}
          onPress={toggleLooping}
          size={30}
        />

        <View style={styles.horizontalStack}>
          <IconButton
            icon="skip-previous-circle-outline"
            iconColor={colors.onPrimary}
            onPress={playPrevious}
            size={35}
          />
          <IconButton
            icon={isPaused ? 'play-circle-outline' : 'pause-circle-outline'}
            iconColor={colors.onPrimary}
            onLongPress={stop}
            onPress={togglePause}
            size={45}
          />
          <IconButton icon="skip-next-circle-outline" iconColor={colors.onPrimary} onPress={playNext} size={35} />
        </View>

        <IconButton
          icon="shuffle"
          iconColor={isShuffled ? colors.secondaryContainer : colors.onPrimary}
          onPress={toggleShuffle}
          size={30}
        />
      </View>

      <View style={styles.horizontalStack}>
        <Text style={{ color: colors.onPrimary }} variant="labelMedium">
          {new Date(progress * 1000).toISOString().substring(isOverOneHourLong ? 11 : 14, 19)}
        </Text>
        <Slider
          maximumValue={currentSong.duration.seconds}
          maximumTrackTintColor={colors.secondaryContainer}
          minimumValue={0}
          minimumTrackTintColor={colors.secondaryContainer}
          onSlidingComplete={moveTo}
          style={{ width: isOverOneHourLong ? '70%' : '75%' }}
          thumbTintColor={colors.secondaryContainer}
          value={progress}
        />
        <Text style={{ color: colors.onPrimary }} variant="labelMedium">
          {currentSong.duration.label}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    marginTop: 8,
    padding: 8,
    paddingVertical: 16,
  },
  horizontalStack: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  infoTextContainer: {
    width: '70%',
  },
});
