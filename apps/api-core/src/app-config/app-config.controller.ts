import { Controller, Get, Header, Query } from '@nestjs/common';
import type { AppConfigApi } from '@ofo/types/app-config';
import { AppConfigQueryDto } from './app-config.dto.js';
import { AppConfigService } from './app-config.service.js';

@Controller({ path: 'app', version: '4' })
export class AppConfigController {
  constructor(private readonly service: AppConfigService) {}

  @Get('config')
  @Header('Cache-Control', 'public, max-age=300')
  getConfig(@Query() query: AppConfigQueryDto): AppConfigApi {
    return this.service.getConfig(query.appVersion, query.platform);
  }
}
