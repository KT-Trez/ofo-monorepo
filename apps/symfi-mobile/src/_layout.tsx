import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { DataSourceProvider } from './components/DataSourceProvider/DataSourceProvider';

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

  return (
    <DataSourceProvider database="symfi.db">
      <Stack />
    </DataSourceProvider>
  );
}
