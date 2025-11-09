import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { PermissionStatus, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useCallback } from 'react';
import { ToastAndroid } from 'react-native';
import { useRandom } from './useRandom';

const ensureAppHasPermissions = async () => {
  const { status } = await requestMediaLibraryPermissionsAsync();
  if (status !== PermissionStatus.GRANTED) {
    ToastAndroid.showWithGravity('No permission to select photo.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
  }

  return status === PermissionStatus.GRANTED;
};

export const useImagePickerV2 = () => {
  const { randomId } = useRandom();

  const pickImage = useCallback(
    async (aspect: [number, number]) => {
      if (!(await ensureAppHasPermissions())) {
        return false;
      }

      const { canceled, assets } = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect,
        base64: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (canceled) {
        return false;
      }

      const asset = await MediaLibrary.createAssetAsync(assets[0].uri);
      const coverUri = FileSystem.documentDirectory + '/assets/' + randomId() + '-thumbnail.png';

      await FileSystem.copyAsync({ from: asset.uri, to: coverUri });
      await MediaLibrary.deleteAssetsAsync(asset);

      return coverUri;
    },
    [randomId],
  );

  const removeImage = useCallback(async (imageUri: string) => {
    if (!(await ensureAppHasPermissions())) {
      return false;
    }

    try {
      await FileSystem.deleteAsync(imageUri);
    } catch (err) {
      const asset = await MediaLibrary.getAssetInfoAsync(imageUri);
      await MediaLibrary.deleteAssetsAsync(asset);
    }
  }, []);

  return { pickImage, removeImage };
};
