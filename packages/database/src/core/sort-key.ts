// Fractional indexing
// A key is read as a base-62 fraction `0.<digits>`; a key between any two others always exists,
// so moving or inserting an item only writes that one row.

// ascending in ASCII, so comparing keys bytewise (SQLite `BINARY`, JS `<`) compares their values
const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const BASE = DIGITS.length;
const VALID_KEY = /^[0-9A-Za-z]*[1-9A-Za-z]$/;

const assertKey = (key: string | null) => {
  if (key !== null && !VALID_KEY.test(key)) {
    throw new Error(`Invalid sort key: "${key}"`);
  }
};

const digitAt = (key: string, index: number) => {
  return index < key.length ? DIGITS.indexOf(key[index]!) : 0;
};

/**
 * Builds a key between `low` and `high`, one digit at a time.
 * `low = ''` is the fraction 0, the start of the list.
 * `high = null` stands for 1, the end, which no key can reach.
 *
 * 1. Copies the common prefix of both keys and continues after it.
 * 2. If there is a free digit between their first digits, returns it:
 *    the middle one, or the next one when appending, so appended keys stay short.
 * 3. Otherwise, if `high` is longer, its first digit alone already fits between them.
 * 4. Otherwise, copies the first digit of `low` and continues with no upper limit.
 *
 * @example
 * makeKey('A', 'C'); // 'B', step 2
 * makeKey('A', 'AV'); // 'AF', step 1, then 2
 * makeKey('A', 'B'); // 'AV', step 4, then 2
 * makeKey('B', null, true); // 'C', step 2 when appending
 */
const makeKey = (low: string, high: string | null, isAppend = false): string => {
  if (high !== null) {
    let common = 0;
    while (common < high.length && digitAt(low, common) === digitAt(high, common)) {
      common += 1;
    }

    if (common > 0) {
      return high.slice(0, common) + makeKey(low.slice(common), high.slice(common));
    }
  }

  const lowDigit = digitAt(low, 0);
  const highDigit = high === null ? BASE : digitAt(high, 0);

  if (highDigit - lowDigit > 1) {
    const digit = isAppend ? lowDigit + 1 : Math.floor((lowDigit + highDigit) / 2);
    return DIGITS[digit]!;
  }

  if (high !== null && high.length > 1) {
    return high[0]!;
  }

  return DIGITS[lowDigit]! + makeKey(low.slice(1), null, isAppend);
};

/**
 * Returns a key that sorts between `before` and `after`.
 * `null` means the start or the end of the list. When there is no room, the key gets longer.
 *
 * @example
 * keyBetween(null, null); // '1', the first item of an empty list
 * keyBetween('A', 'C'); // 'B'
 * keyBetween('A', 'B'); // 'AV'
 * keyBetween(null, '1'); // '0V', before the first item
 * keyBetween('z', null); // 'z1', after the last item
 */
export const keyBetween = (before: string | null, after: string | null): string => {
  assertKey(before);
  assertKey(after);

  if (before !== null && after !== null && before >= after) {
    throw new Error(`Sort key "${before}" is not before "${after}"`);
  }

  return makeKey(before ?? '', after, after === null);
};

/**
 * Returns `count` ascending keys after `last`, for appending items to the end of a list.
 * `null` means the list is empty.
 *
 * @example
 * keysAfter(null, 3); // ['1', '2', '3']
 * keysAfter('B', 2); // ['C', 'D']
 */
export const keysAfter = (last: string | null, count: number): string[] => {
  const keys: string[] = [];
  let previous = last;

  for (let index = 0; index < count; index += 1) {
    previous = keyBetween(previous, null);
    keys.push(previous);
  }

  return keys;
};
