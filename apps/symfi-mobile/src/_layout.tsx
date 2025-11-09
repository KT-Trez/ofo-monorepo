import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync().catch(console.error);

// noinspection JSUnusedGlobalSymbols
export default function RootLayout() {
  useEffect(() => {
    // if !isLoading
    SplashScreen.hide();
  }, []);

  // if (isLoading) {
  //   return null;
  // }

  return <Stack />;
}
