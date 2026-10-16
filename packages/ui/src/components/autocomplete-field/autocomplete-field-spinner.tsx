import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const SPINNER_PERIOD = 900;

const BOX_SIZE = 22;

const RING_SIZE = 16;
const RING_WIDTH = 2;

export const AutocompleteFieldSpinner = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotation, {
        duration: SPINNER_PERIOD,
        easing: Easing.linear,
        toValue: 1,
        useNativeDriver: Platform.OS !== 'web',
      }),
    );

    loop.start();

    return () => loop.stop();
  }, [rotation]);

  const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View aria-hidden style={styles.box}>
      <Animated.View style={[styles.ring, { transform: [{ rotate }] }]} />
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  box: {
    alignItems: 'center',
    height: BOX_SIZE,
    justifyContent: 'center',
    width: BOX_SIZE,
  },
  ring: {
    borderColor: theme.colors.textTertiary,
    borderRadius: theme.radius.pill,
    borderTopColor: 'transparent',
    borderWidth: RING_WIDTH,
    height: RING_SIZE,
    width: RING_SIZE,
  },
}));
