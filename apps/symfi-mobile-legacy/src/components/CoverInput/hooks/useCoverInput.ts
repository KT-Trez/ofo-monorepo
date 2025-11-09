import { useImagePickerV2 } from '@hooks';
import { useCallback } from 'react';

export const useCoverInput = (coverUri: string, setCoverUri: (uri: string) => void) => {
  const { pickImage, removeImage } = useImagePickerV2();

  const editCover = useCallback(async () => {
    const imageUri = await pickImage([16, 9]);
    if (imageUri) {
      setCoverUri(imageUri);
    }
  }, [pickImage, setCoverUri]);

  const removeCover = useCallback(async () => {
    await removeImage(coverUri);
    setCoverUri('');
  }, [coverUri, removeImage, setCoverUri]);

  return {
    editCover,
    removeCover,
  };
};
