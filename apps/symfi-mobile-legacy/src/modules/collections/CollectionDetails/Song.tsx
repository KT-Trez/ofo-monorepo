import { SongCard, useAudioPlayer } from '@components';
import { SongModel } from '@models';
import { useCallback, useMemo } from 'react';

type SongProps = {
  isInSelectionMode: boolean;
  isSelected: boolean;
  item: SongModel;
  toggleSelect: (id: string, item: SongModel) => void;
};

export const Song = ({ isInSelectionMode, isSelected, item, toggleSelect }: SongProps) => {
  const { currentSong, play } = useAudioPlayer();

  const size = useMemo<string>(
    () => `${Math.round(((item.file?.size ?? 0) / 1024 / 1024) * 100) / 100}MB`,
    [item.file?.size],
  );

  const handleLongPress = useCallback(() => {
    toggleSelect(item.id, item);
  }, [item, toggleSelect]);

  const handlePress = useCallback(() => {
    isInSelectionMode ? toggleSelect(item.id, item) : play(item);
  }, [isInSelectionMode, item, play, toggleSelect]);

  return (
    <SongCard
      bottomLabel={size}
      isHighlighted={currentSong?.id === item.id}
      isSelected={isSelected}
      imageUri={item.cover}
      item={item}
      onLongPress={handleLongPress}
      onPress={handlePress}
    />
  );
};
