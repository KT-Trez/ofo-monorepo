import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTestClient } from '../../test/create-test-client.ts';
import { testTrackFactory } from '../../test/create-test-track.ts';
import { artist } from '../schema/artist.entity.ts';
import { playlist } from '../schema/playlist.entity.ts';
import { track } from '../schema/track.entity.ts';
import { PlaylistRepository } from './playlist.repository.ts';
import { TrackRepository } from './track.repository.ts';

describe('PlaylistRepository', () => {
  const client = createTestClient();
  const playlistRepository = new PlaylistRepository(client);
  const trackRepository = new TrackRepository(client);

  const createTestTrack = testTrackFactory(client, trackRepository);

  afterEach(async () => {
    vi.useRealTimers();
    await client.db.delete(playlist);
    await client.db.delete(track);
    await client.db.delete(artist);
  });

  describe('selectAll', () => {
    it('should select every playlist with its track count', async () => {
      // given
      const playlistIdA = await playlistRepository.create('  Bieganie  ');
      const playlistIdB = await playlistRepository.create('Siłownia');

      const trackIdA = await createTestTrack();
      const trackIdB = await createTestTrack();

      await playlistRepository.addTrack(playlistIdA, trackIdA);
      await playlistRepository.addTrack(playlistIdA, trackIdB);

      // when
      const playlists = await playlistRepository.selectAll();

      // then
      expect(playlists).toEqual([
        { isSyncEnabled: false, title: 'Siłownia', trackCount: 0, uid: playlistIdB },
        { isSyncEnabled: false, title: 'Bieganie', trackCount: 2, uid: playlistIdA },
      ]);
    });

    it('should select the most recently opened playlist first', async () => {
      // given
      vi.useFakeTimers({ toFake: ['Date'] });

      vi.setSystemTime(new Date('2026-10-01T10:00:00Z'));
      const playlistIdA = await playlistRepository.create('A');

      vi.setSystemTime(new Date('2026-10-01T11:00:00Z'));
      const playlistIdB = await playlistRepository.create('B');

      vi.setSystemTime(new Date('2026-10-01T12:00:00Z'));
      const playlistIdC = await playlistRepository.create('C');

      // when
      vi.setSystemTime(new Date('2026-10-01T13:00:00Z'));
      await playlistRepository.markOpened(playlistIdA);

      const playlists = await playlistRepository.selectAll();

      // then
      expect(playlists.map(({ uid }) => uid)).toEqual([playlistIdA, playlistIdC, playlistIdB]);
    });
  });
});
