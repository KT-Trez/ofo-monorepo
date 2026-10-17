import { useEffect, useRef } from 'react';
import { Animated, Easing, type LayoutChangeEvent, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Tab } from './tab.tsx';
import { type TabsOption, type TabsProps, TabsSize } from './types.ts';

type Layout = { width: number; x: number };

export const Tabs = <TValue extends string>({
  accessibilityLabel,
  isFullwidth = false,
  isIconOnly = false,
  onChange,
  options,
  size = TabsSize.Md,
  value,
}: TabsProps<TValue>) => {
  const { theme } = useUnistyles();
  styles.useVariants({ full: isFullwidth, size });

  // hidden until placed
  const indicatorOpacity = useRef(new Animated.Value(0)).current;
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  const isIndicatorShown = useRef(false);

  const layouts = useRef(new Map<TValue, Layout>()).current;

  const handleLayout = (
    event: LayoutChangeEvent,
    isSelected: boolean,
    option: TabsOption<TValue>,
  ) => {
    layouts.set(option.value, event.nativeEvent.layout);

    if (isSelected) {
      moveIndicator(event.nativeEvent.layout);
    }
  };

  const moveIndicator = ({ width, x }: Layout) => {
    // the first position is set before loading, so the indicator does not fly in
    if (!isIndicatorShown.current) {
      isIndicatorShown.current = true;
      indicatorX.setValue(x);
      indicatorWidth.setValue(width);
      indicatorOpacity.setValue(1);

      return;
    }

    // a native driver does not handle `width`, so both values run on the JS thread to stay in sync
    const timing = {
      duration: theme.motion.duration.base,
      easing: Easing.bezier(...theme.motion.easing.out),
      useNativeDriver: false,
    };

    Animated.parallel([
      Animated.timing(indicatorX, { ...timing, toValue: x }),
      Animated.timing(indicatorWidth, { ...timing, toValue: width }),
    ]).start();
  };

  useEffect(() => {
    const layout = layouts.get(value);

    if (layout) {
      moveIndicator(layout);
    }
  }, [value]);

  return (
    <View aria-label={accessibilityLabel} role="tablist" style={styles.group}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.indicator,
          { left: indicatorX, opacity: indicatorOpacity, width: indicatorWidth },
        ]}
      />

      {options.map(option => (
        <Tab
          isFullwidth={isFullwidth}
          isIconOnly={isIconOnly}
          isSelected={option.value === value}
          key={option.value}
          onChange={onChange}
          onLayout={handleLayout}
          option={option}
          size={size}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  group: {
    backgroundColor: theme.colors.surfaceRaised,
    borderRadius: theme.radius.default,
    flexDirection: 'row',
    gap: theme.space['2xs'],
    padding: theme.space['2xs'],
    variants: {
      full: {
        false: { alignSelf: 'flex-start' },
        true: { alignSelf: 'stretch' },
      },
      size: {
        md: { minHeight: theme.size.controlMd },
        sm: { minHeight: theme.size.controlSm },
      },
    },
  },
  indicator: {
    backgroundColor: theme.colors.surfaceHover,
    borderRadius: theme.radius.default,
    bottom: theme.space['2xs'],
    position: 'absolute',
    top: theme.space['2xs'],
  },
}));
