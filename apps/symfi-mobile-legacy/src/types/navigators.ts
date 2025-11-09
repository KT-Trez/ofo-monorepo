import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type CollectionNavigatorProps = NativeStackNavigationProp<CollectionNavigatorParams>;

export type CollectionNavigatorParams = {
  CollectionCreateForm: undefined;
  CollectionDetails: { id: string };
  CollectionEditForm: { id: string };
  CollectionPage: undefined;
  SongEditForm: { collectionId: string; songId: string };
  SongsSearch: undefined;
  SongPicker: { collectionId: string };
};

export type MainNavigatorParams = {
  CollectionNavigator: undefined;
  SettingsNavigator: undefined;
};

export type SettingsNavigatorParams = {
  SettingsPage: undefined;
};
