import { oklchToHex } from './oklch-to-hex.ts';
import { seedToHue } from './seed-to-hue.ts';

/** OKLCH lightness and chroma of the background and foreground colors. */
const BACKGROUND = { chroma: 0.07, lightness: 0.36 };
const FOREGROUND = { chroma: 0.11, lightness: 0.82 };

/**
 * Derives a dark background and a light foreground hex color that share a hue taken from the seed.
 * Any string works as the seed, and the same seed always gives the same colors.
 */
export const calculateCoverColors = (seed: string) => {
  const hue = seedToHue(seed);

  return {
    background: oklchToHex(BACKGROUND.lightness, BACKGROUND.chroma, hue),
    foreground: oklchToHex(FOREGROUND.lightness, FOREGROUND.chroma, hue),
  };
};
