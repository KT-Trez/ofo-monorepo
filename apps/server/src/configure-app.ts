import { ValidationPipe, VersioningType } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { ExceptionsFilter } from './common/errors/exceptions.filter.js';
import { validationExceptionFactory } from './common/validation/validation-exception.factory.js';

export const configureApp = (app: NestExpressApplication) => {
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: validationExceptionFactory,
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new ExceptionsFilter());
  app.enableShutdownHooks();
  app.useBodyParser('json', { limit: '2mb' });
  app.use(helmet());
};
