import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '../config/configuration.js';
import { HealthModule } from './health/health.module.js';
import { InnerTubeModule } from './inner-tube/inner-tube.module.js';
import { SearchModule } from './search/search.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    HealthModule,
    InnerTubeModule,
    SearchModule,
  ],
})
export class AppModule {}
