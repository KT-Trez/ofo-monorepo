import { type ActionsList, useConfirmDialog } from '@components';
import { SongModel } from '@models';
import { useNavigation } from '@react-navigation/native';
import { useRealm } from '@realm/react';
import type { CollectionNavigatorProps } from '@types';
import { useCallback, useMemo } from 'react';

type UsePageHeaderActionsArgs = {
  collectionId: string;
  selected: Record<string, SongModel>;
  unselectAll: () => void;
};

export const usePageHeaderActions = ({ collectionId, selected, unselectAll }: UsePageHeaderActionsArgs) => {
  const { close, open } = useConfirmDialog();
  const { navigate } = useNavigation<CollectionNavigatorProps>();
  const realm = useRealm();

  const selectedIds = useMemo<string[]>(() => Object.keys(selected), [selected]);

  const handleDelete = useCallback(() => {
    open({
      items: Object.values(selected).map(song => song.name),
      itemText: 'song',
      onConfirm: () => {
        realm.write(() => {
          for (const songId in selected) {
            realm.delete(selected[songId]);
          }
        });
        close();
        unselectAll();
      },
      title: 'Delete',
    });
  }, [close, open, realm, selected, unselectAll]);

  const handleEdit = useCallback(() => {
    if (selectedIds.length !== 1) {
      return;
    }

    const songId = selectedIds.at(0)!;

    navigate('SongEditForm', { collectionId, songId });
    unselectAll();
  }, [collectionId, navigate, selectedIds, unselectAll]);

  return useMemo<ActionsList>(
    () => [
      [
        {
          icon: 'close',
          onPress: unselectAll,
        },
      ],
      [
        // {
        //   icon: 'delete',
        //   onPress: handleDelete,
        // },
        {
          isHidden: selectedIds.length !== 1,
          icon: 'pencil',
          onPress: handleEdit,
        },
      ],
    ],
    [handleEdit, selectedIds.length, unselectAll],
  );
};
