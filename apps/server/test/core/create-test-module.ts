import { ConfigModule } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { buildConfiguration } from '../../config/configuration.ts';
import type { TestSetupMetadata } from './types.ts';

/**
 * Compiled testing module with a global `ConfigModule` built from the given environment variables.
 */
export const createTestModule = (
  env: Record<string, string>,
  metadata: TestSetupMetadata,
): Promise<TestingModule> => {
  const config = buildConfiguration(env);

  return Test.createTestingModule({
    ...metadata,
    imports: [
      ConfigModule.forRoot({ ignoreEnvFile: true, isGlobal: true, load: [() => config] }),
      ...(metadata.imports ?? []),
    ],
  }).compile();
};
