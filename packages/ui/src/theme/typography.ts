import {
  type ThemeFontFamilies,
  ThemeFontFamily,
  ThemeFontWeight,
  type ThemeFontWeights,
  type ThemeLetterSpacings,
  type ThemeLineHeights,
  type ThemeTextStyle,
  type ThemeTextVariants,
  type ThemeTypography,
} from './types.ts';

export const fontFamily: Readonly<Record<ThemeFontFamilies, Record<ThemeFontWeights, string>>> = {
  text: {
    regular: 'Geist_400Regular',
    medium: 'Geist_500Medium',
    semibold: 'Geist_600SemiBold',
    bold: 'Geist_700Bold',
    extrabold: 'Geist_800ExtraBold',
  },
  number: {
    regular: 'GeistMono_400Regular',
    medium: 'GeistMono_500Medium',
    semibold: 'GeistMono_600SemiBold',
    bold: 'GeistMono_700Bold',
    extrabold: 'GeistMono_800ExtraBold',
  },
};

export const fontSize: Readonly<Record<ThemeTextVariants, number>> = {
  headingLg: 28,
  headingMd: 22,
  headingSm: 18,
  titleSm: 17,
  body: 15,
  bodySm: 14,
  caption: 13,
  captionSm: 12,
  label: 11,
  numberBpm: 72,
  numberTime: 13,
};

export const letterSpacing: Readonly<Record<ThemeLetterSpacings, number>> = {
  display: -0.035,
  title: -0.02,
  body: -0.005,
  label: 0.08,
  number: -0.02,
};

export const lineHeight: Readonly<Record<ThemeLineHeights, number>> = {
  tight: 1.05,
  snug: 1.25,
  body: 1.45,
};

const makeTextStyle = (
  family: ThemeFontFamilies,
  lineHeightRatio: number,
  size: number,
  trackingEm: number,
  weight: ThemeFontWeights,
  extra?: Pick<ThemeTextStyle, 'textTransform'>,
): ThemeTextStyle => {
  return {
    fontFamily: fontFamily[family][weight],
    fontSize: size,
    lineHeight: Math.round(size * lineHeightRatio),
    letterSpacing: size * trackingEm,
    ...(family === ThemeFontFamily.Number && { fontVariant: ['tabular-nums'] }),
    ...extra,
  };
};

const variants: Record<ThemeTextVariants, ThemeTextStyle> = {
  headingLg: makeTextStyle(
    ThemeFontFamily.Text,
    lineHeight.snug,
    fontSize.headingLg,
    letterSpacing.display,
    ThemeFontWeight.Extrabold,
  ),
  headingMd: makeTextStyle(
    ThemeFontFamily.Text,
    lineHeight.snug,
    fontSize.headingMd,
    letterSpacing.title,
    ThemeFontWeight.Extrabold,
  ),
  headingSm: makeTextStyle(
    ThemeFontFamily.Text,
    lineHeight.snug,
    fontSize.headingSm,
    letterSpacing.title,
    ThemeFontWeight.Extrabold,
  ),
  titleSm: makeTextStyle(
    ThemeFontFamily.Text,
    lineHeight.snug,
    fontSize.titleSm,
    letterSpacing.title,
    ThemeFontWeight.Bold,
  ),
  body: makeTextStyle(
    ThemeFontFamily.Text,
    lineHeight.body,
    fontSize.body,
    letterSpacing.body,
    ThemeFontWeight.Regular,
  ),
  bodySm: makeTextStyle(
    ThemeFontFamily.Text,
    lineHeight.body,
    fontSize.bodySm,
    letterSpacing.body,
    ThemeFontWeight.Regular,
  ),
  caption: makeTextStyle(
    ThemeFontFamily.Text,
    lineHeight.body,
    fontSize.caption,
    letterSpacing.body,
    ThemeFontWeight.Regular,
  ),
  captionSm: makeTextStyle(
    ThemeFontFamily.Text,
    lineHeight.body,
    fontSize.captionSm,
    letterSpacing.body,
    ThemeFontWeight.Regular,
  ),
  label: makeTextStyle(
    ThemeFontFamily.Text,
    lineHeight.snug,
    fontSize.label,
    letterSpacing.label,
    ThemeFontWeight.Bold,
    {
      textTransform: 'uppercase',
    },
  ),
  numberBpm: makeTextStyle(
    ThemeFontFamily.Number,
    1,
    fontSize.numberBpm,
    -0.05,
    ThemeFontWeight.Extrabold,
  ),
  numberTime: makeTextStyle(
    ThemeFontFamily.Number,
    lineHeight.snug,
    fontSize.numberTime,
    letterSpacing.number,
    ThemeFontWeight.Medium,
  ),
};

export const typography: ThemeTypography = {
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  variants,
};
