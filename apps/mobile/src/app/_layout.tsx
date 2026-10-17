import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native-unistyles';
import { fonts } from '../fonts.ts';

void preventAutoHideAsync();

export default () => {
  const [isLoaded, error] = useFonts(fonts);
  const isReady = isLoaded || error !== null;

  useEffect(() => {
    if (isReady) {
      void hideAsync();
    }
  }, [isReady]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ contentStyle: styles.screen, headerShown: false }} />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.bg,
    flex: 1,
  },
  screen: {
    backgroundColor: theme.colors.bg,
  },
}));
