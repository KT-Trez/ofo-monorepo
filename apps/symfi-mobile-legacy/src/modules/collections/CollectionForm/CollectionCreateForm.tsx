import { CollectionModel } from '@models';
import { useNavigation } from '@react-navigation/native';
import { useRealm } from '@realm/react';
import type { CollectionNavigatorProps, CollectionType } from '@types';
import { useCallback } from 'react';
import { CollectionFormFields } from './CollectionFormFields';

export const CollectionCreateForm = () => {
  const { navigate } = useNavigation<CollectionNavigatorProps>();
  const realm = useRealm();

  const createCollection = useCallback(
    (coverUri: string, name: string) => {
      const collection: Partial<CollectionType> = {
        coverUri: coverUri || undefined,
        name: name || 'New Collection',
      };

      realm.write(() => {
        realm.create(CollectionModel.schema.name, collection);
      });

      navigate('CollectionPage');
    },
    [navigate, realm],
  );

  return <CollectionFormFields onSubmit={createCollection} />;
};
