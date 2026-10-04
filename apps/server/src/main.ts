import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { ServerConfig } from '../config/configuration.js';
import { AppModule } from './app.module.js';
import { configureApp } from './configure-app.js';

const bootstrap = async () => {
  const logger = new Logger(bootstrap.name);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configureApp(app);

  const config = app.get(ConfigService<ServerConfig>).getOrThrow('app', { infer: true });
  await app.listen(config.port);

  logger.log(`Nest application listening (port="${config.port}")`);
};

bootstrap();
