import { CollectionModel } from '@models';
import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Realm, useObject, useRealm } from '@realm/react';
import type { CollectionNavigatorParams, CollectionNavigatorProps } from '@types';
import { useCallback, useMemo } from 'react';
import { CollectionFormFields } from './CollectionFormFields';

type CollectionEditFormRouteProp = RouteProp<CollectionNavigatorParams, 'CollectionEditForm'>;

export const CollectionEditForm = () => {
  const {
    params: { id },
  } = useRoute<CollectionEditFormRouteProp>();

  const collectionObjectId = useMemo(() => new Realm.BSON.ObjectId(id), [id]);

  const { navigate } = useNavigation<CollectionNavigatorProps>();
  const collection = useObject(CollectionModel, collectionObjectId);
  const realm = useRealm();

  const editCollection = useCallback(
    (coverUri: string, name: string) => {
      if (!collection) {
        return;
      }

      realm.write(() => {
        collection.coverUri = coverUri || undefined;
        collection.name = name;
      });

      navigate('CollectionPage');
    },
    [collection, navigate, realm],
  );

  return (
    <CollectionFormFields
      collectionName={collection?.name}
      initialCoverUri={collection?.coverUri}
      initialName={collection?.name}
      isEdit
      onSubmit={editCollection}
    />
  );
};
