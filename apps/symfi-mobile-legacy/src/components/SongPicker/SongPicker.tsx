import { useSongsManager } from '@hooks';
import { CollectionModel } from '@models';
import { type RouteProp, useRoute } from '@react-navigation/native';
import { Realm, useObject } from '@realm/react';
import type { CollectionNavigatorParams } from '@types';
import { useMemo } from 'react';
import { List } from '../List';
import { Song } from './Song';

type CollectionDetailsRouteProp = RouteProp<CollectionNavigatorParams, 'SongPicker'>;

export const SongPicker = () => {
  const {
    params: { collectionId },
  } = useRoute<CollectionDetailsRouteProp>();

  const collectionObjectId = useMemo(() => new Realm.BSON.ObjectId(collectionId), [collectionId]);

  const collection = useObject(CollectionModel, collectionObjectId);
  const { searchPhrase, songs, setSearchPhrase } = useSongsManager();

  if (!collection) {
    throw new Error('Collection not found');
  }

  return (
    <List.Content
      data={songs}
      Header={<List.SearchBar searchPhrase={searchPhrase} setSearchPhrase={setSearchPhrase} />}
      renderItem={({ item }) => <Song collection={collection} item={item} />}
    />
  );
};
