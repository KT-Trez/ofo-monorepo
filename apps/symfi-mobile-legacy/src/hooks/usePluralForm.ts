import { useCallback } from 'react';

/**
 * Returns `s` if objects count not equal to 1.
 *
 * @deprecated use usePluralFormV4 instead
 * @example const s = usePluralForm(2);
 * @param count - number of objects
 *
 * @returns `s` if count !== 1
 */
export const usePluralFormV3 = (count: number) => {
  return count === 1 ? '' : 's';
};

/**
 * Custom hook to get a pluralization function.
 *
 * This hook returns an object containing a function `p` that determines
 * whether to append an 's' to a word based on the count provided.
 *
 * @example
 * const { p } = usePluralFormV4();
 * const suffix = p(2); // returns 's'
 *
 * @returns An object containing the pluralization function `p`.
 */
export const usePluralFormV4 = () => {
  /**
   * Pluralization function.
   *
   * @param {number} count - The number of objects.
   *
   * @returns {string} Returns 's' if count is not equal to 1, otherwise returns an empty string.
   */
  const p = useCallback((count: number) => (count === 1 ? '' : 's'), []);

  return { p };
};
