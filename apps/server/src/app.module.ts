import { Module } from '@nestjs/common';
import { ConditionalModule, ConfigModule } from '@nestjs/config';
import { ConfigurationSchema } from '../config/configuration.schema.js';
import { isMediaEnabled } from '../config/env.schema.ts';
import { AuthModule } from './auth/auth.module.js';
import { FeatureGatesModule } from './feature-gates/feature-gates.module.js';
import { HealthModule } from './health/health.module.js';
import { MediaModule } from './media/media.module.js';
import { ServerInfoModule } from './server-info/server-info.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validationSchema: ConfigurationSchema,
    }),
    AuthModule,
    ConditionalModule.registerWhen(MediaModule, isMediaEnabled),
    FeatureGatesModule,
    HealthModule,
    ServerInfoModule,
  ],
})
export class AppModule {}
