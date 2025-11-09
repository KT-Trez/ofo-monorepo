import { SongPicker } from '@components';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { CollectionNavigatorParams } from '@types';
import { CollectionDetails } from './CollectionDetails';
import { CollectionCreateForm, CollectionEditForm } from './CollectionForm';
import { CollectionList } from './CollectionList';
import { SongEditForm } from './SongForm';
import { SongsSearchPage } from './SongsSearch';

const { Navigator, Screen } = createNativeStackNavigator<CollectionNavigatorParams>();

const defaultOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export const CollectionNavigator = () => (
  <Navigator initialRouteName={'CollectionPage'} screenOptions={defaultOptions}>
    <Screen component={CollectionCreateForm} name="CollectionCreateForm" />
    <Screen component={CollectionDetails} name="CollectionDetails" />
    <Screen component={CollectionEditForm} name="CollectionEditForm" />
    <Screen component={CollectionList} name="CollectionPage" />
    <Screen component={SongEditForm} name="SongEditForm" />
    <Screen component={SongPicker} name="SongPicker" />
    <Screen component={SongsSearchPage} name="SongsSearch" />
  </Navigator>
);
