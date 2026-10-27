import { afterEach, describe, expect, it } from 'vitest';
import { createTestClient } from '../../test/create-test-client.ts';
import { testTrackFactory } from '../../test/create-test-track.ts';
import { artist } from '../schema/artist.entity.ts';
import { AudioFormat, DownloadErrorCode, DownloadStatus } from '../schema/track-local.constants.ts';
import { track } from '../schema/track.entity.ts';
import { DownloadRepository } from './download.repository.ts';
import { TrackRepository } from './track.repository.ts';

describe('DownloadRepository', () => {
  const client = createTestClient();
  const downloadRepository = new DownloadRepository(client);
  const trackRepository = new TrackRepository(client);

  const createTestTrack = testTrackFactory(client, trackRepository);

  afterEach(async () => {
    await client.db.delete(track);
    await client.db.delete(artist);
  });

  it('should enqueue canceled, failed and not downloaded tracks', async () => {
    // given
    const trackIdA = await createTestTrack({ localInsert: { status: DownloadStatus.Cancelled } });
    const trackIdB = await createTestTrack({
      localInsert: { errorCode: DownloadErrorCode.Interrupted, status: DownloadStatus.Failed },
    });
    const trackIdC = await createTestTrack({
      localInsert: { status: DownloadStatus.NotDownloaded },
    });
    const trackIdD = await createTestTrack({
      localInsert: {
        fileFormat: AudioFormat.Opus,
        filePath: '/music/d.opus',
        fileSizeBytes: 1024,
        status: DownloadStatus.Downloaded,
      },
    });
    const trackIdE = await createTestTrack({ localInsert: { status: DownloadStatus.Downloading } });

    // when
    await downloadRepository.enqueue([trackIdA, trackIdB, trackIdC, trackIdD, trackIdE]);

    // then
    const failed = await downloadRepository.selectFailed();
    const queued = await downloadRepository.selectQueue();

    expect(failed).toEqual([]);
    expect(queued).toEqual([
      expect.objectContaining({
        errorCode: null,
        status: DownloadStatus.Queued,
        uid: trackIdA,
      }),
      expect.objectContaining({
        errorCode: null,
        status: DownloadStatus.Queued,
        uid: trackIdB,
      }),
      expect.objectContaining({
        errorCode: null,
        status: DownloadStatus.Queued,
        uid: trackIdC,
      }),
    ]);
  });

  it('should mark interrupted downloads as failed at startup', async () => {
    // given
    const trackIdA = await createTestTrack({ localInsert: { status: DownloadStatus.Downloading } });
    const trackIdB = await createTestTrack({ localInsert: { status: DownloadStatus.Queued } });

    // when
    await downloadRepository.failInterrupted();

    // then
    expect(await downloadRepository.selectFailed()).toEqual([
      expect.objectContaining({
        errorCode: DownloadErrorCode.Interrupted,
        status: DownloadStatus.Failed,
        uid: trackIdA,
      }),
    ]);
    expect(await downloadRepository.selectQueue()).toEqual([
      expect.objectContaining({ uid: trackIdB }),
    ]);
  });
});
