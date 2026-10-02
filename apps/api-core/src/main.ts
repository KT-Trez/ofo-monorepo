import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { ApiCoreConfig } from '../config/configuration.js';
import { AppModule } from './app.module.js';

const bootstrap = async () => {
  const logger = new Logger(bootstrap.name);

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<ApiCoreConfig>);
  const config = configService.getOrThrow('app', { infer: true });

  app.enableVersioning({ type: VersioningType.URI });
  await app.listen(config.port);

  logger.log(`Nest application listening (port="${config.port}")`);
};

bootstrap();
