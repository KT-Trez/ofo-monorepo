import type { Animated, ColorValue, GestureResponderEvent, StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { IconSource } from 'react-native-paper/src/components/Icon';

export type FABAction = {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  color?: string;
  containerStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  icon: IconSource;
  label?: string;
  labelMaxFontSizeMultiplier?: number;
  labelStyle?: StyleProp<TextStyle>;
  labelTextColor?: string;
  onPress: (e: GestureResponderEvent) => void;
  rippleColor?: ColorValue;
  size?: 'small' | 'medium';
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  testID?: string;
};
