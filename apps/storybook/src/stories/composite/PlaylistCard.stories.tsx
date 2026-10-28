import { PlaylistCard } from '@ofo/ui/composite/playlist-card';
import type { Decorator, Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create({
  single: {
    width: 180,
  },
});

const withCardWidth: Decorator = Story => (
  <View style={styles.single}>
    <Story />
  </View>
);

const meta = {
  args: {
    coverSeed: '019a1b2c-3d4e-7f00-8a00-000000000001',
    isSelected: false,
    isSynced: false,
    onPress: () => {},
    title: 'Bieganie 170',
    trackCount: 24,
    trackCountLabel: 'utwory',
  },
  component: PlaylistCard,
  title: 'Composite/PlaylistCard',
} satisfies Meta<typeof PlaylistCard>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = { decorators: [withCardWidth] };

export const Synced: Story = { args: { isSynced: true }, decorators: [withCardWidth] };

export const Selected: Story = { args: { isSelected: true }, decorators: [withCardWidth] };

export const LongTitle: Story = {
  args: { title: 'Bardzo długa nazwa playlisty na trening interwałowy' },
  decorators: [withCardWidth],
};
