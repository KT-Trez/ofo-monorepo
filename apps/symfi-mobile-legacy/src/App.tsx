import { AudioPlayerProvider, ConfirmDialogProvider, Loader } from '@components';
import { SCHEMA_VERSION, theme } from '@config';
import {
  ChannelModel,
  CollectionModel,
  ConfigItemModel,
  DurationModel,
  FileModel,
  SongModel,
  ViewsModel,
} from '@models';
import { NavigationContainer } from '@react-navigation/native';
import { RealmProvider } from '@realm/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MainNavigator } from './modules';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const App = () => (
  <SafeAreaProvider>
    <PaperProvider theme={theme}>
      <RealmProvider
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        deleteRealmIfMigrationNeeded={!!process.env.EXPO_PUBLIC_DEVELOPMENT}
        fallback={Loader}
        schema={[ChannelModel, CollectionModel, ConfigItemModel, DurationModel, FileModel, SongModel, ViewsModel]}
        schemaVersion={SCHEMA_VERSION}
      >
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <AudioPlayerProvider>
              <ConfirmDialogProvider>
                <StatusBar backgroundColor="#004e5b" hidden={false} style="light" translucent={false} />
                <MainNavigator />
              </ConfirmDialogProvider>
            </AudioPlayerProvider>
          </NavigationContainer>
        </QueryClientProvider>
      </RealmProvider>
    </PaperProvider>
  </SafeAreaProvider>
);
