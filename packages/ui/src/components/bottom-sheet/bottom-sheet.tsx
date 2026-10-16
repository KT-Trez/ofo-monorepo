import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { IconButton, IconButtonSize, IconButtonVariant } from '../icon-button';
import type { BottomSheetProps } from './types.ts';

export const BottomSheet = ({
  children,
  closeLabel,
  footer,
  isOpen,
  onClose,
  title,
}: BottomSheetProps) => {
  const [isMounted, setIsMounted] = useState(isOpen);
  const { theme } = useUnistyles();
  const visibility = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    }

    Animated.timing(visibility, {
      duration: isOpen ? theme.motion.duration.slow : theme.motion.duration.base,
      easing: Easing.bezier(...theme.motion.easing.out),
      toValue: isOpen ? 1 : 0,
      useNativeDriver: Platform.OS !== 'web',
    }).start(({ finished }) => {
      if (finished && !isOpen) {
        setIsMounted(false);
      }
    });
  }, [isOpen, theme.motion, visibility]);

  return (
    <Modal
      animationType="none"
      navigationBarTranslucent
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={isMounted}
    >
      <View style={styles.root}>
        <Animated.View style={[styles.fill, { opacity: visibility }]}>
          <Pressable aria-label={closeLabel} onPress={onClose} style={styles.scrim} />
        </Animated.View>

        <Animated.View
          style={[
            styles.panelPosition,
            {
              transform: [
                {
                  translateY: visibility.interpolate({
                    inputRange: [0, 1],
                    // starts below the screen; the exact panel height does not matter.
                    outputRange: [Dimensions.get('window').height, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View aria-modal role="dialog" style={styles.panel}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <Text numberOfLines={2} role="heading" style={styles.title}>
                {title}
              </Text>

              <IconButton
                accessibilityLabel={closeLabel}
                icon="close"
                isRound
                onPress={onClose}
                size={IconButtonSize.Sm}
                variant={IconButtonVariant.Tonal}
              />
            </View>

            <ScrollView style={styles.body}>{children}</ScrollView>

            {footer && <View style={styles.footer}>{footer}</View>}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create(theme => ({
  body: {
    flexShrink: 1,
  },
  fill: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  footer: {
    flexDirection: 'row',
    gap: theme.space.sm,
    paddingTop: theme.space.lg,
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: theme.colors.borderStrong,
    borderRadius: theme.radius.pill,
    height: theme.space.xs,
    marginBottom: theme.space.sm,
    width: theme.size.sheetHandle,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space.md,
    justifyContent: 'space-between',
    marginBottom: theme.space.sm,
    minHeight: theme.size.controlMd,
  },
  panel: {
    backgroundColor: theme.colors.surfaceBase,
    borderTopLeftRadius: theme.radius.default,
    borderTopRightRadius: theme.radius.default,
    boxShadow: theme.shadows.sheet,
    flexShrink: 1,
    paddingBottom: theme.space['2xl'],
    paddingHorizontal: theme.space.screenInset,
    paddingTop: theme.space.sm,
  },
  panelPosition: {
    maxHeight: '88%',
  },
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    backgroundColor: theme.colors.scrim,
    flex: 1,
  },
  title: {
    ...theme.typography.variants.headingMd,
    color: theme.colors.textPrimary,
    flexShrink: 1,
  },
}));
