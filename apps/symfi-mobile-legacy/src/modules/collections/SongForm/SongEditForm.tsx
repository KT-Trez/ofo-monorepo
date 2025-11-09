import { CoverInput, PageHeader, useCoverInput } from '@components';
import { SongModel } from '@models';
import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useObject, useRealm } from '@realm/react';
import type { CollectionNavigatorParams, CollectionNavigatorProps } from '@types';
import * as FileSystem from 'expo-file-system';
import { PermissionStatus, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';

type SongEditFormRouteProp = RouteProp<CollectionNavigatorParams, 'SongEditForm'>;

export const SongEditForm = () => {
  const {
    params: { collectionId, songId },
  } = useRoute<SongEditFormRouteProp>();

  const { navigate } = useNavigation<CollectionNavigatorProps>();
  const song = useObject(SongModel, songId);
  const realm = useRealm();
  const [channel, setChannel] = useState<string>(song?.channel.name || '');
  const [coverUri, setCoverUri] = useState<string>(song?.cover || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(song?.name || '');
  const [published, setPublished] = useState<string>(song?.published || '');
  const [views, setViews] = useState<string>(song?.views.label || '');
  const { roundness } = useTheme();

  const { editCover, removeCover } = useCoverInput(coverUri, setCoverUri);

  const fetchOriginalCover = useCallback(async () => {
    if (!song) {
      return;
    }

    // todo: move to useImagePicker
    const { status } = await requestMediaLibraryPermissionsAsync();
    if (status !== PermissionStatus.GRANTED) {
      return ToastAndroid.showWithGravity('No permission to select photo.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
    }

    setIsLoading(true);

    const { uri } = await FileSystem.downloadAsync(
      song.thumbnail,
      `${FileSystem.documentDirectory}/assets/${song.id}-cover.png`,
    );

    setCoverUri(uri);
    setIsLoading(false);
  }, [song]);

  const submit = useCallback(() => {
    if (!song) {
      return;
    }

    realm.write(() => {
      song.channel.name = channel;
      song.cover = coverUri || undefined;
      song.name = name;
      song.published = published;
      song.views.label = views;
    });

    navigate('CollectionDetails', { id: collectionId });
  }, [channel, collectionId, coverUri, name, navigate, published, song, views]);

  return (
    <PageHeader subtitle={song?.name} title="Edit Song">
      <View style={styles.container}>
        <TextInput
          label="Author"
          mode="outlined"
          onChangeText={setChannel}
          placeholder="Enter Author"
          style={styles.input}
          value={channel}
        />
        <TextInput
          label="Published"
          mode="outlined"
          onChangeText={setPublished}
          placeholder="Enter Published"
          style={styles.input}
          value={published}
        />
        <TextInput
          label="Title"
          mode="outlined"
          onChangeText={setName}
          placeholder="Enter Title"
          style={styles.input}
          value={name}
        />
        <TextInput
          label="Views"
          mode="outlined"
          onChangeText={setViews}
          placeholder="Enter Views"
          style={styles.input}
          value={views}
        />

        <CoverInput coverUri={coverUri} gutterBottom onEdit={editCover} onRemove={removeCover}>
          <Button
            disabled={!!coverUri || isLoading}
            icon="download"
            loading={isLoading}
            mode="contained"
            onPress={fetchOriginalCover}
            style={styles.button}
          >
            Original
          </Button>
        </CoverInput>

        <Button icon="content-save" mode="outlined" onPress={submit} style={{ borderRadius: roundness }}>
          Save
        </Button>
      </View>
    </PageHeader>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 130,
  },
  container: {
    margin: 8,
  },
  input: {
    marginBottom: 8,
  },
});
