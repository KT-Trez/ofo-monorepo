import { useNavigation } from '@react-navigation/native';
import type { CollectionNavigatorProps, FABAction } from '@types';
import { useMemo } from 'react';

type UseFABActionsArgs = {
  collectionId: string;
};

export const useFABActions = ({ collectionId }: UseFABActionsArgs): FABAction[] => {
  const { navigate } = useNavigation<CollectionNavigatorProps>();

  return useMemo<FABAction[]>(
    () => [
      {
        icon: 'download',
        label: 'Download songs',
        onPress: () => navigate('SongsSearch'),
      },
      {
        icon: 'playlist-music',
        label: 'Manage songs',
        onPress: () => navigate('SongPicker', { collectionId }),
      },
    ],
    [collectionId, navigate],
  );
};
