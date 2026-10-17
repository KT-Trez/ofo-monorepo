import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type { DistributedPick } from 'type-fest';
import { Tabs, type TabsOption, type TabsProps, TabsSize } from '@ofo/ui/components/tabs';

const styles = StyleSheet.create(theme => ({
  column: {
    gap: theme.space.sm,
  },
}));

type Theme = 'dark' | 'light' | 'system';

const THEME_OPTIONS = [
  { icon: 'brightness_auto', label: 'Systemowy', value: 'system' },
  { icon: 'dark_mode', label: 'Ciemny', value: 'dark' },
  { icon: 'light_mode', label: 'Jasny', value: 'light' },
] satisfies readonly TabsOption<Theme>[];

const LABEL_OPTIONS = THEME_OPTIONS.map(({ label, value }) => ({ label, value }));

const TabsPlayground = (
  props: DistributedPick<TabsProps<Theme>, 'isIconOnly' | 'options' | 'size'>,
) => {
  const [theme, setTheme] = useState<Theme>('system');

  return <Tabs {...props} accessibilityLabel="Motyw" onChange={setTheme} value={theme} />;
};

const meta = {
  args: { options: LABEL_OPTIONS },
  component: TabsPlayground,
  title: 'Components/Tabs',
} satisfies Meta<typeof TabsPlayground>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithIcons: Story = {
  args: { options: THEME_OPTIONS },
};

export const WithNoLabels: Story = {
  args: { isIconOnly: true, options: THEME_OPTIONS },
};

export const Sizes: Story = {
  render: () => (
    <View style={styles.column}>
      {Object.values(TabsSize).map(size => (
        <TabsPlayground key={size} options={THEME_OPTIONS} size={size} />
      ))}
    </View>
  ),
};
