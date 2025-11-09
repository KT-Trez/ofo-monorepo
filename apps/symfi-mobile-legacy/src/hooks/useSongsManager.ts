import { SongModel } from '@models';
import { useQuery, useRealm } from '@realm/react';
import type { CollectionId } from '@types';
import { useCallback, useState } from 'react';

export const useSongsManager = (collectionId?: CollectionId) => {
  const realm = useRealm();
  const [searchPhrase, setSearchPhrase] = useState<string>('');

  const queryString = collectionId ? 'collections.id == $0 AND name CONTAINS[c] $1' : 'name CONTAINS[c] $1';

  const deleteSong = useCallback(
    (song: SongModel) => {
      realm.write(() => {
        realm.delete(song);
      });
    },
    [realm],
  );

  const songs = useQuery(SongModel, songs => songs.filtered(queryString, collectionId, searchPhrase).sorted('name'), [
    collectionId,
    searchPhrase,
  ]);

  return {
    deleteSong,
    searchPhrase,
    songs,
    setSearchPhrase,
  };
};
