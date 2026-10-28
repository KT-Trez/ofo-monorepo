import { toSrgbChannel } from './to-srgb-channel.ts';

/** Linear LMS to linear sRGB matrix, from the OKLab reference. */
const LMS_TO_LINEAR_SRGB = [
  [4.0767416621, -3.3077115913, 0.2309699292],
  [-1.2684380046, 2.6097574011, -0.3413193965],
  [-0.0041960863, -0.7034186147, 1.707614701],
] as const;

/** OKLab `a` and `b` coefficients of the L, M and S cone responses, from the OKLab reference. */
const OKLAB_TO_LMS = [
  [0.3963377774, 0.2158037573],
  [-0.1055613458, -0.0638541728],
  [-0.0894841775, -1.291485548],
] as const;

const RADIANS_PER_DEGREE = Math.PI / 180;

/**
 * Converts an OKLCH color (lightness 0–1, chroma, hue in degrees) to a `#rrggbb` hex color.
 * Channels outside the sRGB gamut are clamped.
 */
export const oklchToHex = (lightness: number, chroma: number, hue: number) => {
  const a = chroma * Math.cos(hue * RADIANS_PER_DEGREE);
  const b = chroma * Math.sin(hue * RADIANS_PER_DEGREE);

  const toLms = ([aCoefficient, bCoefficient]: readonly [number, number]) => {
    return (lightness + aCoefficient * a + bCoefficient * b) ** 3;
  };

  const [lRow, mRow, sRow] = OKLAB_TO_LMS;
  const l = toLms(lRow);
  const m = toLms(mRow);
  const s = toLms(sRow);

  const toLinearSrgb = ([lCoefficient, mCoefficient, sCoefficient]: readonly [
    number,
    number,
    number,
  ]) => {
    return lCoefficient * l + mCoefficient * m + sCoefficient * s;
  };

  const [redRow, greenRow, blueRow] = LMS_TO_LINEAR_SRGB;
  const red = toSrgbChannel(toLinearSrgb(redRow));
  const green = toSrgbChannel(toLinearSrgb(greenRow));
  const blue = toSrgbChannel(toLinearSrgb(blueRow));

  return `#${red}${green}${blue}`;
};
