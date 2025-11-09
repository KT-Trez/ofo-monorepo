import { Tabs } from 'expo-router';

// noinspection JSUnusedGlobalSymbols
export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="albums" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
