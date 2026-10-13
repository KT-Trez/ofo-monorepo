import { HealthIndicatorService } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { YT } from '@ofo/ytdlp/YT';
import { WdlReadiness } from './wdl-readiness.service.ts';

describe('WdlReadiness', () => {
  const versionMock = vi.fn<YT['version']>();

  let readiness: WdlReadiness;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HealthIndicatorService,
        WdlReadiness,
        { provide: YT, useValue: { version: versionMock } },
      ],
    }).compile();

    readiness = module.get(WdlReadiness);
  });

  it('should report the wdl version', async () => {
    // given
    versionMock.mockResolvedValue('2026.01.01');

    // when
    const result = await readiness.check();

    // then
    expect(result).toEqual({ ytdlp: { status: 'up', version: '2026.01.01' } });
  });

  it('should report down with the error message', async () => {
    // given
    versionMock.mockRejectedValue(new Error('Cannot run yt-dlp'));

    // when
    const result = await readiness.check();

    // then
    expect(result).toEqual({ ytdlp: { message: 'Cannot run yt-dlp', status: 'down' } });
  });

  it('should probe wdl on every check', async () => {
    // given
    versionMock
      .mockResolvedValueOnce('2026.01.01')
      .mockRejectedValueOnce(new Error('Cannot run yt-dlp'));

    // when
    const up = await readiness.check();
    const down = await readiness.check();

    // then
    expect(versionMock).toHaveBeenCalledTimes(2);
    expect(up).toMatchObject({ ytdlp: { status: 'up' } });
    expect(down).toMatchObject({ ytdlp: { status: 'down' } });
  });

  it('should report down with a thrown non-error value as the message', async () => {
    // given
    versionMock.mockRejectedValue('spawn yt-dlp ENOENT');

    // when
    const result = await readiness.check();

    // then
    expect(result).toEqual({ ytdlp: { message: 'spawn yt-dlp ENOENT', status: 'down' } });
  });
});
