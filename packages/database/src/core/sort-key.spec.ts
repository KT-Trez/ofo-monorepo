import { randomInt } from 'es-toolkit';
import { describe, expect, it } from 'vitest';
import { keyBetween, keysAfter } from './sort-key.ts';

describe('keyBetween, keysAfter', () => {
  const isAscending = (keys: readonly string[]) => {
    return keys.every((key, index) => index === 0 || keys[index - 1]! < key);
  };

  describe('keyBetween', () => {
    it('should start a list and extends it at both ends', () => {
      // given
      const first = keyBetween(null, null);
      const start = keyBetween(null, first);
      const end = keyBetween(first, null);

      // then
      expect(isAscending([start, first, end])).toBe(true);
    });

    it.for<[before: string | null, after: string | null, expected: string]>([
      ['A', 'C', 'B'],
      ['A', 'B', 'AV'],
      ['A', 'AV', 'AF'],
      ['z', null, 'z1'],
      [null, '1', '0V'],
    ])(
      'should fit a key between %s and %s adjacent keys by making it longer',
      ([before, after, expected]) => {
        expect(keyBetween(before, after)).toBe(expected);
      },
    );

    it('should keep the order through many inserts at random places', () => {
      // given
      const keys = [keyBetween(null, null)];

      // when
      for (let step = 0; step < 2000; step += 1) {
        const index = randomInt(keys.length + 1);

        const before = keys[index - 1] ?? null;
        const after = keys[index] ?? null;

        keys.splice(index, 0, keyBetween(before, after));
      }

      // then
      expect(isAscending(keys)).toBe(true);
    });

    it.for<[before: string | null, after: string | null, error: string]>([
      ['A', 'A', 'is not before'],
      ['B', 'A', 'is not before'],
      ['A0', null, 'Invalid sort key'],
    ])('should reject keys %s and %s as invalid combination', ([before, after, error]) => {
      expect(() => keyBetween(before, after)).toThrow(error);
    });
  });

  describe('keysAfter', () => {
    it('should append ascending keys when starting from the start of the list', () => {
      // given
      const keys = keysAfter(null, 1000);

      // then
      expect(isAscending(keys)).toBe(true);
      expect(keys.slice(0, 3)).toEqual(['1', '2', '3']);
      expect(Math.max(...keys.map(key => key.length))).toBe(17);
    });

    it('should append ascending keys when starting from a given key', () => {
      // given
      const keys = keysAfter('B', 2);

      // then
      expect(keys).toEqual(['C', 'D']);
    });
  });
});
