import { BottomSheet } from '@ofo/ui/components/bottom-sheet';
import { Button, ButtonVariant } from '@ofo/ui/components/button';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create(theme => ({
  content: {
    gap: theme.space.md,
  },
  text: {
    ...theme.typography.variants.body,
    color: theme.colors.textSecondary,
  },
}));

type BottomSheetPlaygroundProps = {
  hasFooter: boolean;
  lines: number;
};

const BottomSheetPlayground = ({ hasFooter, lines }: BottomSheetPlaygroundProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  return (
    <View>
      <Button onPress={handleOpen}>Otwórz</Button>

      <BottomSheet
        closeLabel="Zamknij"
        footer={
          hasFooter && (
            <>
              <View style={{ flex: 1 }}>
                <Button isFullwidth onPress={handleClose} variant={ButtonVariant.Secondary}>
                  Anuluj
                </Button>
              </View>

              <View style={{ flex: 1 }}>
                <Button isFullwidth onPress={handleClose}>
                  Połącz
                </Button>
              </View>
            </>
          )
        }
        isOpen={isOpen}
        onClose={handleClose}
        title="Połączyć playlisty?"
      >
        <View style={styles.content}>
          {Array.from({ length: lines }, (_, index) => (
            <Text key={index} style={styles.text}>
              Utwory z „Bieganie wieczorne” trafią na koniec „Trening interwałowy”. Pustą playlistę
              usuniemy.
            </Text>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
};

const meta = {
  args: { hasFooter: true, lines: 1 },
  component: BottomSheetPlayground,
  parameters: { layout: 'fullscreen' },
  title: 'Components/BottomSheet',
} satisfies Meta<typeof BottomSheetPlayground>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithLongContent: Story = {
  args: { lines: 30 },
};

export const WithNoFooter: Story = {
  args: { hasFooter: false },
};
