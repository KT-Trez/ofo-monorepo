import { describe, expect, it } from 'vitest';
import { calculateCoverColors } from './calculate-cover-colors.ts';

describe('calculateCoverColors', () => {
  const sumChannels = (hex: string) => {
    return [1, 3, 5]
      .map(start => Number.parseInt(hex.slice(start, start + 2), 16))
      .reduce((sum, channel) => sum + channel, 0);
  };

  it('should return the same colors for the same seed', () => {
    // given
    const seed = 'k3j9x0q2';

    // when
    const colorsA = calculateCoverColors(seed);
    const colorsB = calculateCoverColors(seed);

    // then
    expect(colorsA).toEqual(colorsB);
  });

  it('should return a dark background and a light foreground as hex colors', () => {
    // given
    const seed = 'k3j9x0q2';

    // when
    const { background, foreground } = calculateCoverColors(seed);

    // then
    expect(background).toMatch(/^#[\da-f]{6}$/);
    expect(foreground).toMatch(/^#[\da-f]{6}$/);
    expect(sumChannels(background)).toBeLessThan(sumChannels(foreground));
  });

  it('should return different colors for different seeds', () => {
    // given
    const seeds = ['first', 'second', 'third', 'fourth'];

    // when
    const backgrounds = seeds.map(seed => calculateCoverColors(seed).background);
    const foregrounds = seeds.map(seed => calculateCoverColors(seed).foreground);

    // then
    expect(new Set(backgrounds).size).toBe(4);
    expect(new Set(foregrounds).size).toBe(4);
  });
});
