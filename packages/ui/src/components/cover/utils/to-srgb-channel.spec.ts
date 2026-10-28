import { describe, expect, it } from 'vitest';
import { toSrgbChannel } from './to-srgb-channel.ts';

describe('toSrgbChannel', () => {
  it.for<[linear: number, expected: string]>([
    [0, '00'],
    [1, 'ff'],
    [0.5, 'bc'],
    [0.214, '7f'],
  ])('should encode the linear value %d as "%s"', ([linear, expected]) => {
    // when
    const channel = toSrgbChannel(linear);

    // then
    expect(channel).toBe(expected);
  });

  it('should use the linear segment below the threshold', () => {
    // given
    const linear = 0.002;

    // when
    const channel = toSrgbChannel(linear);

    // then
    expect(channel).toBe('07');
  });

  it.for<[linear: number, expected: string]>([
    [-0.5, '00'],
    [2, 'ff'],
  ])('should clamp the out-of-range value %d to "%s"', ([linear, expected]) => {
    // when
    const channel = toSrgbChannel(linear);

    // then
    expect(channel).toBe(expected);
  });

  it('should pad single-digit values with a leading zero', () => {
    // given
    const linear = 0.0031308;

    // when
    const channel = toSrgbChannel(linear);

    // then
    expect(channel).toBe('0a');
  });
});
