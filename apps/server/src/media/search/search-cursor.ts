import { ApiException } from '../../common/errors/api-exception.js';

type SearchCursorPayload = {
  o: number;
  v: 1;
};

export class SearchCursor {
  private static readonly CURSOR_PATTERN = /^[\w-]+$/;
  private static readonly CURSOR_VERSION = 1;
  private static readonly MAX_SEARCH_DEPTH = 200;

  public readonly pageSize: number;

  constructor(
    public readonly limit: number,
    public readonly offset: number,
  ) {
    this.pageSize = Math.min(this.limit, SearchCursor.MAX_SEARCH_DEPTH - this.offset);
  }

  get nextOffset(): number {
    return this.offset + this.pageSize;
  }

  get hasNext(): boolean {
    return this.nextOffset < SearchCursor.MAX_SEARCH_DEPTH;
  }

  static from(cursor: string, limit: number): SearchCursor {
    try {
      if (!SearchCursor.CURSOR_PATTERN.test(cursor)) {
        throw new Error('not base64url');
      }

      const cursorString = Buffer.from(cursor, 'base64url').toString('utf8');
      const parsed = JSON.parse(cursorString);

      const isValidVersion = parsed?.v === SearchCursor.CURSOR_VERSION;
      const isNumericOffset = typeof parsed?.o === 'number';
      const isOffsetNonNegative = isNumericOffset && parsed.o >= 0;
      const isOffsetSafeInteger = isNumericOffset && Number.isSafeInteger(parsed.o);

      if (!isValidVersion || !isOffsetNonNegative || !isOffsetSafeInteger) {
        throw new Error('bad shape');
      }

      return new SearchCursor(limit, parsed.o);
    } catch (error) {
      throw new ApiException('invalid_request', 'The cursor is invalid', { cause: error });
    }
  }

  encodeNext(): string {
    const payload: SearchCursorPayload = {
      o: this.nextOffset,
      v: 1,
    };

    return Buffer.from(JSON.stringify(payload)).toString('base64url');
  }
}
