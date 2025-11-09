import { useContext } from 'react';
import { AudioPlayerContext } from './context';
import type { UseAudioPlayer } from './types';

export const useAudioPlayer = (): UseAudioPlayer => {
  const actions = useContext(AudioPlayerContext);
  if (!actions) {
    throw Error('Missing provider. Hook useAudioPlayer must be used inside AudioPlayerContext.');
  }

  return actions;
};
