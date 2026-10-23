import type { GenRandomUid, Uid } from '../types.ts';

/** Fills the array with cryptographically secure random bytes, like `crypto.getRandomValues`. */
export type GenAndAppendRandomBytes = (array: Uint8Array<ArrayBuffer>) => void;

export const createRandomUidGenerator = (
  genAndAppendRandomBytes: GenAndAppendRandomBytes,
  now = Date.now,
): GenRandomUid => {
  return () => {
    const bytes = new Uint8Array(16);
    const timestamp = now();
    genAndAppendRandomBytes(bytes);

    // 48-bit big-endian Unix timestamp in milliseconds
    for (let index = 5, rest = timestamp; index >= 0; index -= 1, rest = Math.floor(rest / 256)) {
      bytes[index] = rest % 256;
    }

    bytes[6] = (bytes[6]! & 0x0f) | 0x70; // version 7
    bytes[8] = (bytes[8]! & 0x3f) | 0x80; // variant 10

    // the version and variant bits are set above, which the type cannot see through `join`
    return [
      bytesToHex(bytes, 0, 4),
      bytesToHex(bytes, 4, 6),
      bytesToHex(bytes, 6, 8),
      bytesToHex(bytes, 8, 10),
      bytesToHex(bytes, 10, 16),
    ].join('-') as Uid;
  };
};

const bytesToHex = (bytes: Uint8Array, start: number, end: number) => {
  return Array.from(bytes.subarray(start, end), byte => byte.toString(16).padStart(2, '0')).join(
    '',
  );
};
