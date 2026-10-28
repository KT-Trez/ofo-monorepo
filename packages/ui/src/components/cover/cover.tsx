import { useMemo, useState } from 'react';
import { type LayoutChangeEvent, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Icon, IconGlyph } from '../icon';
import type { CoverProps } from './types.ts';
import { calculateCoverColors } from './utils/calculate-cover-colors.ts';

const ASPECT_RATIO = 16 / 9;

export const Cover = ({ icon, isSelected = false, seed }: CoverProps) => {
  const [height, setHeight] = useState<number>(0);
  const { theme } = useUnistyles();

  const colors = useMemo(() => calculateCoverColors(seed), [seed]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setHeight(event.nativeEvent.layout.height);
  };

  return (
    <View onLayout={handleLayout} style={[styles.cover, { backgroundColor: colors.background }]}>
      {height > 0 && (
        <Icon
          color={colors.foreground}
          isFilled
          name={icon}
          size={Math.max(16, Math.round(height * 0.5))}
        />
      )}

      {isSelected && (
        <View style={styles.selected}>
          {height > 0 && (
            <Icon
              color={theme.colors.accent}
              isFilled
              name={IconGlyph.CheckCircle}
              size={Math.max(18, Math.round(height * 0.55))}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  cover: {
    alignItems: 'center',
    aspectRatio: ASPECT_RATIO,
    borderRadius: theme.radius.default,
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  selected: {
    alignItems: 'center',
    backgroundColor: theme.colors.overlaySelected,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
}));
