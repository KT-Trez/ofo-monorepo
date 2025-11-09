import { createContext } from 'react';
import type { UseAudioPlayer } from './types';

export const AudioPlayerContext = createContext<undefined | UseAudioPlayer>(undefined);
