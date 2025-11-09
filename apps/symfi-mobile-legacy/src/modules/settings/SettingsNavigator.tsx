import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { SettingsNavigatorParams } from 'types';
import { SettingsPage } from './SettingsPage';

const { Navigator, Screen } = createNativeStackNavigator<SettingsNavigatorParams>();

const defaultOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export const SettingsNavigator = () => (
  <Navigator initialRouteName={'SettingsPage'}>
    <Screen component={SettingsPage} name={'SettingsPage'} options={defaultOptions} />
  </Navigator>
);
