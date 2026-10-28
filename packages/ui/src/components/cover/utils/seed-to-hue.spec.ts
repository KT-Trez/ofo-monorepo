import { describe, expect, it } from 'vitest';
import { seedToHue } from './seed-to-hue.ts';

describe('seedToHue', () => {
  it('should return the same hue for the same seed', () => {
    // given
    const seed = 'k3j9x0q2';

    // when
    const hues = [seedToHue(seed), seedToHue(seed)];

    // then
    expect(hues.at(0)).toBe(hues.at(1));
  });

  it.for(['', 'a', 'zażółć 🎵', '019a1b2c-3d4e-7f00-8a00-0123456789ab'])(
    'should return an integer hue between 0 and 359 for "%s"',
    seed => {
      // when
      const hue = seedToHue(seed);

      // then
      expect(Number.isInteger(hue)).toBe(true);
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThan(360);
    },
  );

  it('should spread consecutive seeds over every sector of the hue circle', () => {
    // given
    // the hue circle is split into 12 sectors of 30°; similar seeds must land in all of them,
    // not cluster in a few (plain FNV-1a without the finalizer covers only 10)
    const SEED_COUNT = 100;
    const SECTOR_SIZE = 30;
    const SECTOR_COUNT = 360 / SECTOR_SIZE;

    const seeds = Array.from({ length: SEED_COUNT }, (_, index) => `seed-${index.toString(16)}`);

    // when
    const sectors = seeds.map(seed => Math.floor(seedToHue(seed) / SECTOR_SIZE));

    // then
    expect(new Set(sectors).size).toBe(SECTOR_COUNT);
  });
});
