import AsyncStorage from '@react-native-async-storage/async-storage';
import DataStore from 'react-native-local-mongodb';

const storeFactory = (name: string) => {
  return new DataStore({
    autoload: true,
    corruptAlertThreshold: 0,
    // todo: migrate filenames
    filename: name,
    // filename: name.endsWith('.db') ? name : name + '.db',
    storage: {
      async getItem(key: string, cb): Promise<string | null> {
        const item = await AsyncStorage.getItem(key);
        if (cb) cb(undefined, item ?? undefined);
        return null;
      },
      async removeItem(key: string, cb): Promise<void> {
        await AsyncStorage.removeItem(key);

        if (cb) cb(undefined);
      },
      async setItem(key: string, value: string, cb?): Promise<void> {
        await AsyncStorage.setItem(key, value);
        if (cb) cb(undefined);
      },
    },
    timestampData: true,
  });
};

const Store = {
  playLists: storeFactory('playlists'),
  songs: storeFactory('songs'),
  songPlayLists: storeFactory('songPlayLists'),
};

export { Store };
