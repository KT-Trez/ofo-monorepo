import { type ActionsList, useConfirmDialog } from '@components';
import { useImagePickerV2 } from '@hooks';
import { CollectionModel } from '@models';
import { useNavigation } from '@react-navigation/native';
import { useRealm } from '@realm/react';
import type { CollectionNavigatorProps } from '@types';
import { useCallback, useMemo } from 'react';

type UsePageHeaderActionsArgs = {
  selected: Record<string, CollectionModel>;
  unselectAll: () => void;
};

export const usePageHeaderActions = ({ selected, unselectAll }: UsePageHeaderActionsArgs) => {
  const { close, open } = useConfirmDialog();
  const { removeImage } = useImagePickerV2();
  const { navigate } = useNavigation<CollectionNavigatorProps>();
  const realm = useRealm();

  const selectedIds = useMemo<string[]>(() => Object.keys(selected), [selected]);

  const handleEdit = useCallback(() => {
    if (selectedIds.length !== 1) {
      return;
    }

    const collectionId = selectedIds.at(0)!;

    navigate('CollectionEditForm', { id: collectionId });
    unselectAll();
  }, [navigate, selectedIds, unselectAll]);

  const handleDelete = useCallback(() => {
    open({
      items: Object.values(selected).map(collection => collection.name),
      itemText: 'collection',
      onConfirm: () => {
        for (const collectionId in selected) {
          const { coverUri } = selected[collectionId];
          coverUri && removeImage(coverUri);
        }

        realm.write(() => {
          for (const collectionId in selected) {
            realm.delete(selected[collectionId]);
          }
        });

        close();
        unselectAll();
      },
      title: 'Delete',
    });
  }, [close, open, realm, removeImage, selected, unselectAll]);

  return useMemo<ActionsList>(
    () => [
      [
        {
          icon: 'close',
          onPress: unselectAll,
        },
      ],
      [
        {
          isHidden: selectedIds.length !== 1,
          icon: 'pencil',
          onPress: handleEdit,
        },
        {
          icon: 'delete',
          onPress: handleDelete,
        },
      ],
    ],
    [handleDelete, handleEdit, selectedIds.length, unselectAll],
  );
};
