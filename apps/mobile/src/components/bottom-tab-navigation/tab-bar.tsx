import { type IconName } from '@ofo/ui/components/icon';
import { BottomTabBar, type BottomTabBarProps } from 'expo-router/tabs';
import { View } from 'react-native';
import { BottomMiniPlayer } from './bottom-mini-player.tsx';

export type TabBarItem = { icon: IconName; label: string };

export const TabBar = ({ insets, ...props }: BottomTabBarProps) => {
  return (
    <View style={{ paddingBottom: insets.bottom }}>
      <BottomMiniPlayer />
      <BottomTabBar {...props} insets={{ ...insets, bottom: 0 }} />
    </View>
  );
};
