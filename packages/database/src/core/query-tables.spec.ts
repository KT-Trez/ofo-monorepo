import { describe, expect, it } from 'vitest';
import { createTestClient } from '../../test/create-test-client.ts';
import { PlaylistRepository } from '../repositories/playlist.repository.ts';
import { getQueryTables } from './query-tables.ts';

describe('getQueryTables', () => {
  const client = createTestClient();
  const playlistRepository = new PlaylistRepository(client);

  it('should return the from table and every joined table', () => {
    // given
    const query = playlistRepository.selectAll();

    // when
    const tables = getQueryTables(query);

    // then
    expect(Array.from(tables).toSorted()).toEqual(['playlist', 'playlist_local', 'playlist_track']);
  });
});
