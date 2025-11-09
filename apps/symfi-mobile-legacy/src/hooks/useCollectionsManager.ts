import { CollectionModel } from '@models';
import { useQuery, useRealm } from '@realm/react';
import { useCallback, useState } from 'react';

export const useCollectionsManager = () => {
  const realm = useRealm();
  const [searchPhrase, setSearchPhrase] = useState<string>('');

  const deleteCollection = useCallback(
    (collection: CollectionModel) => {
      realm.write(() => {
        realm.delete(collection);
      });
    },
    [realm],
  );

  const collections = useQuery(
    CollectionModel,
    collections => collections.filtered('name CONTAINS[c] $0', searchPhrase).sorted('name'),
    [searchPhrase],
  );

  return {
    collections,
    deleteCollection,
    searchPhrase,
    setSearchPhrase,
  };
};
