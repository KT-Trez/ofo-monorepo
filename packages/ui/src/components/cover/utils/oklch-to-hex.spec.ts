import { describe, expect, it } from 'vitest';
import { oklchToHex } from './oklch-to-hex.ts';

describe('oklchToHex', () => {
  it.for<[lightness: number, chroma: number, hue: number, expected: string]>([
    [1, 0, 0, '#ffffff'],
    [0, 0, 0, '#000000'],
    [0.627955, 0.257683, 29.2339, '#ff0000'],
    [0.86644, 0.294827, 142.4953, '#00ff00'],
    [0.452014, 0.313214, 264.052, '#0000ff'],
  ])('should convert oklch(%d %d %d) to "%s"', ([lightness, chroma, hue, expected]) => {
    // when
    const hex = oklchToHex(lightness, chroma, hue);

    // then
    expect(hex).toBe(expected);
  });

  it('should ignore the hue when the chroma is zero', () => {
    // when
    const hexes = [0, 90, 180, 270].map(hue => oklchToHex(0.5, 0, hue));

    // then
    expect(new Set(hexes).size).toBe(1);
  });

  it('should treat hues 0 and 360 as the same', () => {
    // when
    const hexA = oklchToHex(0.36, 0.07, 0);
    const hexB = oklchToHex(0.36, 0.07, 360);

    // then
    expect(hexA).toBe(hexB);
  });

  it('should clamp a color outside the sRGB gamut to a valid hex color', () => {
    // when
    const hex = oklchToHex(0.9, 0.4, 150);

    // then
    expect(hex).toMatch(/^#[\da-f]{6}$/);
  });
});
