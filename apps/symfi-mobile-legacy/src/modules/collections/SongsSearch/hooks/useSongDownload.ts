import { DEFAULT_API_ORIGIN } from '@config';
import { ConfigItemModel, FileModel, SongModel } from '@models';
import { useObject, useRealm } from '@realm/react';
import { useQueryClient } from '@tanstack/react-query';
import type { ApiSuccess, File, SongTypeApi } from '@types';
import { ConfigItemsKeys, ensureDirExists, QueryKeys } from '@utils';
import * as FileSystem from 'expo-file-system';
import { useCallback } from 'react';
import { ToastAndroid } from 'react-native';

export const useSongDownload = () => {
  const apiOrigin = useObject(ConfigItemModel, ConfigItemsKeys.API_ORIGIN);
  const realm = useRealm();
  const queryClient = useQueryClient();

  const origin = apiOrigin?.value || DEFAULT_API_ORIGIN;

  return useCallback(
    async (song: SongTypeApi) => {
      // check if song already exists
      const songIndex = realm.objects(SongModel.schema.name).findIndex(({ id }) => id === song.id);
      if (songIndex !== -1) {
        return ToastAndroid.showWithGravity('Song already downloaded.', ToastAndroid.SHORT, ToastAndroid.CENTER);
      }

      //get download url
      const { meta } = await queryClient.fetchQuery<ApiSuccess<string>>({
        queryFn: () => fetch(new URL(`/v3/song/download?id=${song.id}`, origin)).then(res => res.json()),
        queryKey: [QueryKeys.DOWNLOAD_URL, song.id],
      });

      console.log(meta);

      // ensure directory
      const dirUri = `${FileSystem.documentDirectory}music`;
      await ensureDirExists(dirUri);

      // download song
      const { uri } = await FileSystem.downloadAsync(meta, `${dirUri}/${song.id}.webm`);
      const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });
      if (!fileInfo.exists) {
        return ToastAndroid.showWithGravity('Failed to download a song.', ToastAndroid.SHORT, ToastAndroid.CENTER);
      }

      // todo: download cover image if selected

      const { modificationTime, size } = fileInfo;

      // save song to realm
      const songToSave = SongModel.generate(song);
      Object.assign<SongTypeApi, { file: File }>(songToSave, {
        file: FileModel.generate({ modifiedDate: new Date(modificationTime), size, uri }),
      });

      realm.write(() => {
        realm.create(SongModel.schema.name, songToSave);
      });

      ToastAndroid.showWithGravity('Song downloaded!', ToastAndroid.SHORT, ToastAndroid.CENTER);
    },
    [origin, queryClient, realm],
  );
};
