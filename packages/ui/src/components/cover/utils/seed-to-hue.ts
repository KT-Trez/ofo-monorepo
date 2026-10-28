/** 32-bit FNV-1a parameters, as defined by the FNV specification. */
const FNV_OFFSET_BASIS = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

/** Shifts and multipliers of the MurmurHash3 finalizer (`fmix32`), from its reference implementation. */
const FMIX32_SHIFT_1 = 16;
const FMIX32_SHIFT_2 = 13;
const FMIX32_MULTIPLIER_1 = 0x85ebca6b;
const FMIX32_MULTIPLIER_2 = 0xc2b2ae35;

const HUE_COUNT = 360;

/**
 * Maps any string to a hue (0–359). The same string always gives the same hue.
 *
 * The string is hashed with 32-bit FNV-1a, then mixed with the MurmurHash3 finalizer,
 * so strings that differ only in their last characters still get distant hues.
 */
export const seedToHue = (seed: string) => {
  let hash = FNV_OFFSET_BASIS;

  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, FNV_PRIME);
  }

  hash ^= hash >>> FMIX32_SHIFT_1;
  hash = Math.imul(hash, FMIX32_MULTIPLIER_1);
  hash ^= hash >>> FMIX32_SHIFT_2;
  hash = Math.imul(hash, FMIX32_MULTIPLIER_2);
  hash ^= hash >>> FMIX32_SHIFT_1;

  return (hash >>> 0) % HUE_COUNT;
};
