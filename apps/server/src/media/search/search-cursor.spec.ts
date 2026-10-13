import { describe, expect, it } from 'vitest';
import { ApiException } from '../../common/errors/api-exception.js';
import { SearchCursor } from './search-cursor.js';

describe('SearchCursor', () => {
  const toBase64url = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');

  it.for([0, 20, 160])('should round-trip the next offset after %i', offset => {
    // given
    const cursor = new SearchCursor(20, offset);

    // when
    const encoded = cursor.encodeNext();

    // then
    expect(encoded).toMatch(/^[\w-]+$/);
    expect(SearchCursor.from(encoded, 20).offset).toBe(offset + 20);
  });

  it('should take the limit from the request rather than from the cursor', () => {
    // given
    const encoded = new SearchCursor(20, 0).encodeNext();

    // when
    const cursor = SearchCursor.from(encoded, 5);

    // then
    expect(cursor).toMatchObject({ limit: 5, nextOffset: 25, offset: 20, pageSize: 5 });
  });

  it.for<[offset: number, limit: number, pageSize: number]>([
    [0, 50, 50],
    [190, 50, 10],
    [200, 50, 0],
  ])(
    'should clamp the page at offset %i with limit %i to %i items',
    ([offset, limit, pageSize]) => {
      // given / when
      const cursor = new SearchCursor(limit, offset);

      // then
      expect(cursor.pageSize).toBe(pageSize);
      expect(cursor.nextOffset).toBe(offset + pageSize);
    },
  );

  it.for<[offset: number, limit: number, hasNext: boolean]>([
    [0, 50, true],
    [140, 50, true],
    [150, 50, false],
    [190, 50, false],
  ])('should report whether a page follows offset %i with limit %i', ([offset, limit, hasNext]) => {
    // given / when
    const cursor = new SearchCursor(limit, offset);

    // then
    expect(cursor.hasNext).toBe(hasNext);
  });

  it('should accept a cursor with a zero offset', () => {
    // given / when
    const cursor = SearchCursor.from(toBase64url({ o: 0, v: 1 }), 20);

    // then
    expect(cursor.offset).toBe(0);
  });

  it.for<[message: string, cursor: string]>([
    ['not base64url', '***'],
    ['not JSON', Buffer.from('nope').toString('base64url')],
    ['null', toBase64url(null)],
    ['a wrong version', toBase64url({ o: 1, v: 2 })],
    ['a missing offset', toBase64url({ v: 1 })],
    ['a negative offset', toBase64url({ o: -1, v: 1 })],
    ['a fractional offset', toBase64url({ o: 1.5, v: 1 })],
    ['a string offset', toBase64url({ o: '1', v: 1 })],
  ])('should reject a cursor that is %s with 1004', ([_name, cursor]) => {
    // when
    const from = () => SearchCursor.from(cursor, 20);

    // then
    expect(from).toThrow(ApiException);
    expect(from).toThrow(expect.objectContaining({ code: 1004 }));
  });
});
