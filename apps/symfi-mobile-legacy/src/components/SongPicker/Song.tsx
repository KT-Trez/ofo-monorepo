import { CollectionModel, SongModel } from '@models';
import { useRealm } from '@realm/react';
import { useCallback, useMemo } from 'react';
import { SongCard } from '../SongCard';

type SongProps = {
  collection: CollectionModel;
  item: SongModel;
};

export const Song = ({ collection, item }: SongProps) => {
  const realm = useRealm();

  const collectionIndex = useMemo<number>(
    () => item.collections.findIndex(item => item.id.toHexString() === collection.id.toHexString()),
    [collection, item],
  );

  const size = useMemo<string>(
    () => `${Math.round(((item.file?.size ?? 0) / 1024 / 1024) * 100) / 100}MB`,
    [item.file?.size],
  );

  const isAdded = collectionIndex !== -1;

  const handlePress = useCallback(() => {
    realm.write(() => {
      if (isAdded) {
        item.collections.splice(collectionIndex, 1);
      } else {
        item.collections.push(collection);
      }
    });
  }, [collection, collectionIndex, isAdded, item.collections, realm]);

  return (
    <SongCard bottomLabel={size} isHighlighted={isAdded} imageUri={item.cover} item={item} onPress={handlePress} />
  );
};
