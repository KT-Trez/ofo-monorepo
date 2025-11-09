import { SongModel } from '@models';
import { useQuery } from '@realm/react';
import { Audio, AVPlaybackStatus, InterruptionModeAndroid } from 'expo-av';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ToastAndroid } from 'react-native';
import type { CollectionId, SongType } from 'types';
import { AudioPlayerContext } from './context';
import type { UseAudioPlayer } from './types';

type AudioPlayerProviderProps = {
  children?: ReactNode;
};

export const AudioPlayerProvider = ({ children }: AudioPlayerProviderProps) => {
  const currentSound = useRef<null | Audio.SoundObject>(null);

  const [collectionId, setCollectionId] = useState<CollectionId | null>(null);
  const [currentSong, setCurrentSong] = useState<SongType | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const queue = useRef<SongType[]>([]);

  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const isLoopingRef = useRef<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);

  // todo: sort by order
  const songs = useQuery(SongModel, songs => songs.filtered('collections.id == $0', collectionId).sorted('name'), [
    collectionId,
  ]);

  // queue handlers
  const moveTo = useCallback(async (position: number) => {
    if (!currentSound.current) {
      return;
    }

    await currentSound.current.sound.setPositionAsync(position * 1000);
  }, []);

  const play = useCallback((song: SongType) => setCurrentSong(song), []);

  const playNext = useCallback(() => {
    const currentSongIndex = queue.current.findIndex(item => item.id === currentSong?.id);
    if (currentSongIndex === -1) {
      setCurrentSong(null);
    }

    const nextSongIndex = (currentSongIndex + 1) % queue.current.length;
    setCurrentSong(queue.current[nextSongIndex]);
  }, [currentSong?.id, queue]);

  const playPrevious = useCallback(() => {
    const currentSongIndex = queue.current.findIndex(item => item.id === currentSong?.id);
    if (currentSongIndex === -1) {
      setCurrentSong(null);
    }

    const previousSongIndex = currentSongIndex - 1 < 0 ? queue.current.length - 1 : currentSongIndex - 1;
    setCurrentSong(queue.current[previousSongIndex]);
  }, [currentSong?.id, queue]);

  const stop = useCallback(() => {
    setCurrentSong(null);
    setProgress(0);
    currentSound.current?.sound.unloadAsync();
    currentSound.current = null;
  }, []);

  const toggleLooping = useCallback(() => {
    isLoopingRef.current = !isLoopingRef.current;
    setIsLooping(prevState => !prevState);
  }, []);

  const togglePause = useCallback(async () => {
    isPaused ? await currentSound.current?.sound.playAsync() : await currentSound.current?.sound.pauseAsync();
    setIsPaused(prevState => !prevState);
  }, [isPaused]);

  const toggleShuffle = useCallback(() => setIsShuffled(prevState => !prevState), []);

  // startup
  const mountStatusEvents = useCallback(
    (status: AVPlaybackStatus): void => {
      if (!status.isLoaded) {
        console.log(status.error);
        if (status.error) {
          ToastAndroid.show(status.error, ToastAndroid.SHORT);
          playNext();
        }

        return;
      }

      setIsBuffering(status.isBuffering);

      if (status.isPlaying) {
        setProgress(Math.floor(status.positionMillis / 1000));
      }

      if (status.didJustFinish && !isLoopingRef.current) {
        stop();
      } else if (status.didJustFinish) {
        playNext();
      }
    },
    [playNext, stop],
  );

  const updateCurrentSound = useCallback(async () => {
    if (currentSound.current) {
      await currentSound.current.sound.unloadAsync();
    }

    if (!currentSong) {
      return;
    }
    if (!currentSong.file) {
      return playNext();
    }

    currentSound.current = await Audio.Sound.createAsync({ uri: currentSong.file.uri }, { shouldPlay: true });
    currentSound.current.sound.setOnPlaybackStatusUpdate(mountStatusEvents);
    await currentSound.current.sound.setProgressUpdateIntervalAsync(800);

    await currentSound.current.sound.playAsync();
  }, [currentSong, mountStatusEvents, playNext]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      playThroughEarpieceAndroid: false,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
    });
  }, []);

  useEffect(() => {
    updateCurrentSound();
  }, [currentSong, updateCurrentSound]);

  useEffect(() => {
    queue.current = Array.from(songs);
  }, [songs]);

  const providerProps: UseAudioPlayer = useMemo(
    () => ({
      currentSong,
      isBuffering,
      isLooping,
      isPaused,
      isShuffled,
      moveTo,
      play,
      playNext,
      playPrevious,
      progress,
      setCollectionId,
      stop,
      toggleLooping,
      togglePause,
      toggleShuffle,
    }),
    [
      currentSong,
      isBuffering,
      isLooping,
      isPaused,
      isShuffled,
      moveTo,
      play,
      playNext,
      playPrevious,
      progress,
      stop,
      toggleLooping,
      togglePause,
      toggleShuffle,
    ],
  );

  return <AudioPlayerContext.Provider value={providerProps}>{children}</AudioPlayerContext.Provider>;
};
