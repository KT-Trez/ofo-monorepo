import { Module } from '@nestjs/common';
import { AppConfigController } from './app-config.controller.js';
import { AppConfigService } from './app-config.service.js';

@Module({
  controllers: [AppConfigController],
  providers: [AppConfigService],
})
export class AppConfigModule {}
