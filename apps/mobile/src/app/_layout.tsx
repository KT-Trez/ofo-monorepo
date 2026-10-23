import { Stack } from 'expo-router';
import { preventAutoHideAsync } from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native-unistyles';
import {
  NavigationThemeProvider,
} from '../components/navigation-theme-provider/navigation-theme-provider.tsx';
import { useAppLoader } from '../hooks/use-app-loader.ts';

void preventAutoHideAsync();

export default () => {
  const isAppLoaded = useAppLoader();

  if (!isAppLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <NavigationThemeProvider>
        <StatusBar style="auto" />

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="player"
            options={{ animation: 'slide_from_bottom', presentation: 'fullScreenModal' }}
          />
          <Stack.Screen
            name="playlist/[id]/add-tracks"
            options={{ animation: 'slide_from_bottom', presentation: 'fullScreenModal' }}
          />
        </Stack>
      </NavigationThemeProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.bg,
    flex: 1,
  },
}));
