import { webcrypto } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { createRandomUidGenerator, type GenAndAppendRandomBytes } from './uid.ts';

describe('createRandomUidGenerator', () => {
  const genAndAppendRandomBytes = (array: Uint8Array<ArrayBuffer>) => {
    webcrypto.getRandomValues(array);
  };

  it('should create UUIDv7 with the timestamp in front', () => {
    // given
    const genRandomUid = createRandomUidGenerator(genAndAppendRandomBytes, () => 0x0123_4567_89ab);

    // then
    expect(genRandomUid()).toMatch(/^01234567-89ab-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('should sort ids by the time they were created', () => {
    // given
    let time = Date.now();
    const genRandomUid = createRandomUidGenerator(genAndAppendRandomBytes, () => time++);

    const uids = Array.from({ length: 100 }, () => genRandomUid());

    // then
    expect(uids.toSorted()).toEqual(uids);
  });

  it('should use the given random source', () => {
    // given
    const genAndAppendRandomBytesMock: GenAndAppendRandomBytes = array => array.fill(0xff);
    const genRandomUid = createRandomUidGenerator(genAndAppendRandomBytesMock, () => 0);

    // then
    expect(genRandomUid()).toBe('00000000-0000-7fff-bfff-ffffffffffff');
  });
});
