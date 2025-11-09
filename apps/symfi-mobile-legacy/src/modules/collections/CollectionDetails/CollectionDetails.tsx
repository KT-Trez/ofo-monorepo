import { Actions, AudioPlayer, List, PageHeader, useAudioPlayer } from '@components';
import { usePluralFormV3, useSelected, useSongsManager } from '@hooks';
import { CollectionModel, SongModel } from '@models';
import { type RouteProp, useRoute } from '@react-navigation/native';
import { Realm, useObject } from '@realm/react';
import type { CollectionNavigatorParams } from '@types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { useFABActions, usePageHeaderActions } from './hooks';
import { Song } from './Song';

type CollectionDetailsRouteProp = RouteProp<CollectionNavigatorParams, 'CollectionDetails'>;

export const CollectionDetails = () => {
  const {
    params: { id },
  } = useRoute<CollectionDetailsRouteProp>();

  const collectionObjectId = useMemo(() => new Realm.BSON.ObjectId(id), [id]);

  const { setCollectionId, stop } = useAudioPlayer();
  const collection = useObject(CollectionModel, collectionObjectId);
  const { isAnythingSelected, selected, toggleSelect, unselectAll } = useSelected<SongModel>();
  const { searchPhrase, songs, setSearchPhrase } = useSongsManager(collectionObjectId);
  const [isFabOpen, setIsFabOpen] = useState<boolean>(false);

  const pageHeaderActions = usePageHeaderActions({ collectionId: id, selected, unselectAll });
  const fabActions = useFABActions({ collectionId: id });

  const handleFabToggle = useCallback(() => setIsFabOpen(prevState => !prevState), []);

  const s = usePluralFormV3(songs.length);

  useEffect(() => {
    setCollectionId(collectionObjectId);

    return () => {
      setCollectionId(null);
      stop();
    };
  }, [collectionObjectId, setCollectionId, stop]);

  return (
    <PageHeader
      actions={<Actions actions={pageHeaderActions} />}
      showActions={isAnythingSelected}
      subtitle={`${songs.length} item${s}`}
      title={`Collection: ${collection?.name}`}
    >
      <AudioPlayer />

      <List.Content
        data={songs}
        Header={<List.SearchBar searchPhrase={searchPhrase} setSearchPhrase={setSearchPhrase} />}
        renderItem={({ item }) => (
          <Song
            isInSelectionMode={isAnythingSelected}
            isSelected={!!selected[item.id]}
            item={item}
            toggleSelect={toggleSelect}
          />
        )}
      />

      <FAB.Group
        actions={fabActions}
        icon="playlist-edit"
        open={isFabOpen}
        onStateChange={handleFabToggle}
        style={styles.fab}
        variant="secondary"
        visible
      />
    </PageHeader>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});
