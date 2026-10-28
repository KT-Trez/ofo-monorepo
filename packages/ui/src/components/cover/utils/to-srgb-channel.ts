/** sRGB transfer function parameters, as defined by IEC 61966-2-1. */
const SRGB_LINEAR_THRESHOLD = 0.0031308;
const SRGB_LINEAR_SLOPE = 12.92;
const SRGB_GAMMA = 2.4;
const SRGB_SCALE = 1.055;
const SRGB_OFFSET = 0.055;

const CHANNEL_MAX = 255;
const HEX_RADIX = 16;
const HEX_DIGITS = 2;

/** Encodes a linear sRGB channel (0–1, clamped) as a two-digit hex value. */
export const toSrgbChannel = (linear: number) => {
  const encoded =
    linear <= SRGB_LINEAR_THRESHOLD
      ? SRGB_LINEAR_SLOPE * linear
      : SRGB_SCALE * linear ** (1 / SRGB_GAMMA) - SRGB_OFFSET;

  return Math.round(Math.min(1, Math.max(0, encoded)) * CHANNEL_MAX)
    .toString(HEX_RADIX)
    .padStart(HEX_DIGITS, '0');
};
