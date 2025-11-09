import { SongCard } from '@components';
import type { SongTypeApi } from '@types';
import { memo, useCallback, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

type SongProps = {
  download: (item: SongTypeApi) => Promise<void>;
  isDownloaded: boolean;
  item: SongTypeApi;
};

export const Song = memo(
  ({ isDownloaded, item, download }: SongProps) => {
    const animation = useRef(new Animated.Value(0)).current;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { colors, roundness } = useTheme();

    const downloadSong = useCallback(async () => {
      setIsLoading(true);
      await download(item);
      setIsLoading(false);
    }, [download, item]);

    const open = useCallback(() => {
      Animated.timing(animation, {
        duration: 300,
        toValue: 72,
        useNativeDriver: false,
      }).start();
    }, [animation]);

    return (
      <View style={{ backgroundColor: colors.background, borderRadius: roundness }}>
        <SongCard bottomLabel={item.views.label} item={item} imageUri={item.thumbnail} onPress={open} />
        <Animated.View style={[{ height: animation }, styles.animatedView]}>
          <IconButton icon="play-circle-outline" onPress={() => console.log('Pressed')} size={40} />
          <IconButton
            disabled={isLoading || isDownloaded}
            icon={isDownloaded ? 'check-circle-outline' : 'download-circle-outline'}
            loading={isLoading}
            onPress={downloadSong}
            size={40}
            theme={{ colors: { onSurfaceDisabled: 'green' } }}
          />
        </Animated.View>
      </View>
    );
  },
  (prevProps, nextProps) =>
    prevProps.item.id === nextProps.item.id && prevProps.isDownloaded === nextProps.isDownloaded,
);

const styles = StyleSheet.create({
  animatedView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
