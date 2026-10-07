import { ConfigService } from '@nestjs/config';
import { YT } from '@ofo/ytdlp/YT';
import type { ServerConfig } from '../../config/configuration.js';

const SECOND_MS = 1000;
const UPDATE_TIMEOUT_MS = 300 * SECOND_MS;

export const WDL_PROVIDER = {
  inject: [ConfigService],
  provide: YT,
  useFactory: (config: ConfigService<ServerConfig, true>): YT => {
    const audio = config.get('audio', { infer: true });
    const media = config.get('features', { infer: true }).media;
    const wdl = config.get('ytdlp', { infer: true });

    return new YT({
      binaryPath: wdl.path,
      ffmpegPath: audio.ffmpegPath,
      ffprobePath: audio.ffprobePath,
      jsRuntime: wdl.jsRuntime,
      timeoutsMs: {
        download: media.prepare_timeout_seconds * SECOND_MS,
        info: wdl.infoTimeoutSec * SECOND_MS,
        search: wdl.searchTimeoutSec * SECOND_MS,
        update: UPDATE_TIMEOUT_MS,
      },
    });
  },
};
