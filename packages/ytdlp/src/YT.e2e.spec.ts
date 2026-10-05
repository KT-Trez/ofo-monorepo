import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { YT } from './YT.ts';

/**
 * Runs against the real `yt-dlp` with `E2E=1`.
 * Needs `yt-dlp`, `ffmpeg` and `ffprobe`: `YTDLP_BINARY`, `FFMPEG_PATH`, `FFPROBE_PATH`
 */
describe.skipIf(process.env.E2E !== '1')('YT', () => {
  // "Me at the zoo": the first YouTube video, 19 s long, stable
  const videoId = 'jNQXAC9IVRw';
  const yt = new YT({
    binaryPath: process.env.YTDLP_BINARY ?? 'yt-dlp',
    ffmpegPath: process.env.FFMPEG_PATH,
    ffprobePath: process.env.FFPROBE_PATH,
    jsRuntime: 'node',
    timeoutsMs: { download: 120_000, info: 60_000, search: 60_000, update: 120_000 },
  });
  const outDirs: string[] = [];

  afterAll(async () => {
    await Promise.all(outDirs.map(dir => rm(dir, { force: true, recursive: true })));
  });

  it('should report its version', async () => {
    // given / when
    const version = await yt.version();

    // then
    expect(version).toMatch(/^\d{4}\.\d{2}\.\d{2}/);
  });

  it('should search with an offset', async () => {
    // given / when
    const items = await yt.search({ limit: 3, offset: 2, query: 'lofi hip hop' });

    // then
    expect(items).toHaveLength(3);
    expect(items.at(2)?.title).toBeTruthy();
  });

  it('should return the info of a video', async () => {
    // given / when
    const info = await yt.info(videoId);

    // then
    expect(info).toMatchObject({ channelName: 'jawed', id: videoId, title: 'Me at the zoo' });
    expect(info.durationMs).toBeCloseTo(19_000, -3);
    expect(info.hasAudio).toBe(true);
  });

  it('should classify a missing video', async () => {
    // given / when / then
    await expect(yt.info('aaaaaaaaaaa')).rejects.toMatchObject({ kind: 'video_unavailable' });
  });

  it.for(['opus', 'm4a'] as const)('should download "%s" audio', async format => {
    // given
    const outDir = await mkdtemp(join(tmpdir(), 'VITEST_E2E_'));
    outDirs.push(outDir);

    // when
    const result = await yt.download({ format, outDir, sourceId: videoId });

    // then
    expect(result.path).toBe(join(outDir, `${videoId}.${format}`));
    expect(result.sizeBytes).toBeGreaterThan(2048);
    expect(result.durationMs).toBeCloseTo(19_000, -3);
  });
});
