import { CollectionModel, SongModel } from '@models';
import { useQuery, useRealm } from '@realm/react';
import { documentDirectory, StorageAccessFramework, writeAsStringAsync } from 'expo-file-system';
import { useCallback, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { FlatSetting, Section } from '../components';
import { useResources } from '../hooks';

export const MusicSection = () => {
  const migratedCollections = useQuery(CollectionModel);
  const migratedSongs = useQuery(SongModel);
  const realm = useRealm();
  const { playlists, migrateResources, songs } = useResources();
  const [isMigrating, setIsMigrating] = useState<boolean>(false);

  const isDisabled = migratedCollections.length >= playlists.length && migratedSongs.length >= songs.length;

  const createBackups = useCallback(async () => {
    const resources = await migrateResources(playlists, songs);

    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync(documentDirectory);
    if (!permissions.granted) {
      // noinspection ExceptionCaughtLocallyJS
      throw new Error('Failed to get directory permissions');
    }

    const backupCollectionsUri = await StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      'symfi.collections-backup.json',
      'application/json',
    );
    const backupSongsUri = await StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      'symfi.songs-backup.json',
      'application/json',
    );

    const migratedCollectionsUri = await StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      'symfi.collections-migration.json',
      'application/json',
    );
    const migratedSongsUri = await StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      'symfi.songs-migration.json',
      'application/json',
    );

    const migratedCollections = Array.from(resources.migratedCollections);
    const migratedSongs = Array.from(resources.migratedSongs);

    await Promise.all([
      writeAsStringAsync(backupCollectionsUri, JSON.stringify(playlists, null, 2)),
      writeAsStringAsync(backupSongsUri, JSON.stringify(songs, null, 2)),
      writeAsStringAsync(migratedCollectionsUri, JSON.stringify(migratedCollections, null, 2)),
      writeAsStringAsync(migratedSongsUri, JSON.stringify(migratedSongs, null, 2)),
    ]);

    return { migratedCollections, migratedSongs, resources };
  }, [migrateResources, playlists, songs]);

  const migrateSchema = useCallback(async () => {
    setIsMigrating(true);

    try {
      const { resources } = await createBackups();

      const collectionsByModel = new Map<string, CollectionModel>();

      realm.write(() => {
        realm.deleteAll();

        for (const [collectionId, collection] of resources.collectionsMap.entries()) {
          const createdCollection = realm.create(CollectionModel.schema.name, collection, true);
          collectionsByModel.set(collectionId, createdCollection as CollectionModel);
        }
        for (const song of migratedSongs) {
          const createdSong = realm.create(SongModel.schema.name, song, true);
          const collections = Array.from(resources.collectionsPerSongMap.get(song.id) || []);
          createdSong.collections = collections.reduce<CollectionModel[]>((acc, collectionId) => {
            const collection = collectionsByModel.get(collectionId);
            if (collection) {
              acc.push(collection);
            }

            return acc;
          }, []);
        }
      });

      ToastAndroid.showWithGravity('Successfully migrated the schema.', ToastAndroid.SHORT, ToastAndroid.CENTER);
    } catch (err) {
      console.log(err);
      ToastAndroid.showWithGravity(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        `Failed to migrate the schema: ${err.message}`,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    } finally {
      setIsMigrating(false);
    }
  }, [createBackups, realm, migratedSongs]);

  const migrateSchemaByForce = useCallback(async () => {
    setIsMigrating(true);

    try {
      const { migratedCollections, migratedSongs } = await createBackups();

      realm.write(() => {
        realm.deleteAll();

        for (const collection of migratedCollections) {
          realm.create(CollectionModel.schema.name, collection, true);
        }
        for (const song of migratedSongs) {
          realm.create(SongModel.schema.name, song, true);
        }
      });

      ToastAndroid.showWithGravity('Successfully migrated the schema.', ToastAndroid.SHORT, ToastAndroid.CENTER);
    } catch (err) {
      console.log(err);
      ToastAndroid.showWithGravity(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        `Failed to migrate the schema: ${err.message}`,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    } finally {
      setIsMigrating(false);
    }
  }, [createBackups, realm]);

  return (
    <Section title="Music">
      <FlatSetting
        description="Migrate the schema of your Collections and Songs to the latest version."
        isDisabled={isDisabled}
        isLoading={isMigrating}
        onPress={migrateSchema}
        title="Migrate to v2.0.0"
      />
      <FlatSetting
        description="Same as above, but will force the migration and skip migration of the Collections content."
        isDisabled={isDisabled}
        isLoading={isMigrating}
        onPress={migrateSchemaByForce}
        title="Migrate to v2.0.0 --force"
      />
    </Section>
  );
};
