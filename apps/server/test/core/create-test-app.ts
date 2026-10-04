import type { NestExpressApplication } from '@nestjs/platform-express';
import { configureApp } from '../../src/configure-app.ts';
import { createTestModule } from './create-test-module.ts';
import type { TestSetupMetadata } from './types.ts';

/**
 * Nest application for HTTP-level tests, configured from the given environment variables.
 */
export const createTestApp = async (
  env: Record<string, string>,
  metadata: TestSetupMetadata,
): Promise<NestExpressApplication> => {
  const moduleRef = await createTestModule(env, metadata);

  const app = moduleRef.createNestApplication<NestExpressApplication>();
  configureApp(app);

  await app.init();

  return app;
};
