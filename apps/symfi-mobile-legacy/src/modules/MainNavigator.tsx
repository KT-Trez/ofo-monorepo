import type { MainNavigatorParams } from '@types';
import { Icon } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { CollectionNavigator } from './collections';
import { SettingsNavigator } from './settings';

const Tab = createMaterialBottomTabNavigator<MainNavigatorParams>();

export const MainNavigator = () => (
  <Tab.Navigator compact initialRouteName="CollectionNavigator">
    <Tab.Screen
      component={CollectionNavigator}
      name="CollectionNavigator"
      options={{
        tabBarIcon: props => <Icon {...props} size={24} source="playlist-play" />,
        tabBarLabel: 'Collections',
      }}
    />
    <Tab.Screen
      component={SettingsNavigator}
      name="SettingsNavigator"
      options={{
        tabBarIcon: props => <Icon {...props} size={24} source="cog" />,
        tabBarLabel: 'Settings',
      }}
    />
  </Tab.Navigator>
);

// {/*<Screen*/}
// {/*  component={SongsSearch}*/}
// {/*  name={'search'}*/}
// {/*  options={{*/}
// {/*    headerShown: false,*/}
// {/*    tabBarIcon: ({ color, size }) => (<MaterialIcons color={color} name={'search'} size={size}/>),*/}
// {/*    tabBarLabel: 'Search',*/}
// {/*  }}*/}
// {/*/>*/}
// {/*<Screen*/}
// {/*  component={SongListNavigator}*/}
// {/*  name={'SongList'}*/}
// {/*  options={{*/}
// {/*    headerShown: false,*/}
// {/*    tabBarIcon: ({ color, size }) => (*/}
// {/*      <MaterialIcons color={color} name={'audiotrack'} size={size}/>),*/}
// {/*    tabBarLabel: 'SongsList',*/}
// {/*  }}*/}
// {/*/>*/}

// <Navigator initialRouteName={'CollectionNavigator'}>
//   <Screen
//     component={}
//     name={'CollectionNavigator'}
//     options={{
//       ...defaultOptions,
//       tabBarIcon: iconProps => <MaterialIcons {...iconProps} name={'playlist-play'} />,
//       tabBarLabel: 'Collections',
//     }}
//   />
//   <Screen
//     component={SettingsNavigator}
//     name={'SettingsNavigator'}
//     options={{
//       tabBarIcon: iconProps => <MaterialIcons {...iconProps} name={'settings'} />,
//       tabBarLabel: 'Settings',
//     }}
//   />
