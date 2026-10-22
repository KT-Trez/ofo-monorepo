import { useTranslation } from '@ofo/i18n';
import { IconGlyph } from '@ofo/ui/components/icon';
import { Tabs } from 'expo-router/tabs';
import {
  useTabsScreenOptions,
} from '../../components/bottom-tab-navigation/hooks/use-tabs-screen-options.tsx';
import { TabBar } from '../../components/bottom-tab-navigation/tab-bar.tsx';
import {
  tabScreenOptions,
} from '../../components/bottom-tab-navigation/utils/tab-screen-options.tsx';

export default () => {
  const { options } = useTabsScreenOptions();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{ ...options, headerShown: false }}
      tabBar={props => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="(home)"
        options={tabScreenOptions({ icon: IconGlyph.Home, label: t('screens.home') })}
      />
      <Tabs.Screen
        name="search"
        options={tabScreenOptions({ icon: IconGlyph.Search, label: t('screens.search') })}
      />
      <Tabs.Screen
        name="(library)"
        options={tabScreenOptions({ icon: IconGlyph.LibraryMusic, label: t('screens.library') })}
      />
      <Tabs.Screen
        name="settings"
        options={tabScreenOptions({ icon: IconGlyph.Settings, label: t('screens.settings') })}
      />
    </Tabs>
  );
};
