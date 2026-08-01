import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Innertube, { UniversalCache } from 'youtubei.js';
import { type ApiCoreConfig } from '../../config/configuration.js';

export const INNER_TUBE_TOKEN = Symbol('INNER_TUBE_CONNECTION');

@Global()
@Module({
  exports: [INNER_TUBE_TOKEN],
  providers: [
    {
      inject: [ConfigService],
      provide: INNER_TUBE_TOKEN,
      useFactory: (config: ConfigService<ApiCoreConfig>) => {
        const innerTubeConfig = config.getOrThrow('innerTube', { infer: true });

        return Innertube.create({
          cache: new UniversalCache(false),
          generate_session_locally: innerTubeConfig.generateSessionLocally,
        });
      },
    },
  ],
})
export class InnerTubeModule {}
