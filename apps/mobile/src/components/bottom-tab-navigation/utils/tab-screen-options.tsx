import type { BottomTabNavigationOptions } from 'expo-router/tabs';
import type { TabBarItem } from '../tab-bar.tsx';
import { TabIcon } from '../tab-icon.tsx';

export const tabScreenOptions = ({ icon, label }: TabBarItem): BottomTabNavigationOptions => {
  return {
    tabBarIcon: ({ focused }) => <TabIcon icon={icon} isSelected={focused} />,
    title: label,
  };
};
