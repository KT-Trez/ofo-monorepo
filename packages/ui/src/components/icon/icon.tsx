import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { type IconProps, IconWeight, type IconWeights } from './types.ts';

const DEFAULT_SIZE = 24;

export const ICON_FONT_FAMILY: Readonly<
  Record<IconWeights, Record<'filled' | 'outlined', string>>
> = {
  medium: {
    filled: 'MaterialSymbolsRounded_500Medium_Filled',
    outlined: 'MaterialSymbolsRounded_500Medium',
  },
  regular: {
    filled: 'MaterialSymbolsRounded_400Regular_Filled',
    outlined: 'MaterialSymbolsRounded_400Regular',
  },
};

export const Icon = ({
  color,
  isFilled = false,
  name,
  size = DEFAULT_SIZE,
  weight = IconWeight.Regular,
}: IconProps) => {
  return (
    <Text
      accessible={false}
      allowFontScaling={false}
      aria-hidden
      numberOfLines={1}
      selectable={false}
      style={[
        styles.icon,
        {
          fontFamily: ICON_FONT_FAMILY[weight][isFilled ? 'filled' : 'outlined'],
          fontSize: size,
          height: size,
          lineHeight: size,
          width: size,
        },
        color === undefined ? undefined : { color },
      ]}
    >
      {name}
    </Text>
  );
};

const styles = StyleSheet.create(theme => ({
  icon: {
    color: theme.colors.textPrimary,
    includeFontPadding: false,
    // until the font loads the raw name would show; keep it inside the icon box.
    overflow: 'hidden',
    textAlign: 'center',
  },
}));
