import { useRandom } from '@hooks';
import { memo, useMemo } from 'react';
import { type DimensionValue, Image, type ImageSourcePropType, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Overlay } from '../Overlay';

type CoverProps = {
  text?: string;
  uri?: false | string | undefined;
  width?: DimensionValue;
};

export const Cover = memo(
  ({ uri, text, width }: CoverProps) => {
    const { randomImage } = useRandom();
    const { roundness } = useTheme();

    const source = useMemo<ImageSourcePropType>(() => (uri ? { uri } : randomImage()), [uri, randomImage]);

    return (
      <View style={[styles.container, { borderRadius: roundness, width }]}>
        <Image
          resizeMethod="resize"
          resizeMode="cover"
          source={source}
          style={[styles.image, { borderRadius: roundness }]}
        />

        {text && <Overlay bottom={4} right={4} text={text} />}
      </View>
    );
  },
  (prevProps, newProps) => {
    return prevProps.uri === newProps.uri;
  },
);

const styles = StyleSheet.create({
  container: {
    aspectRatio: 16 / 9,
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
