import { ConfigModule } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { ConfigurationSchema } from '../../config/configuration.schema.ts';
import type { TestSetupMetadata } from './types.ts';

export const createTestModule = (
  env: Record<string, string>,
  metadata: TestSetupMetadata,
): Promise<TestingModule> => {
  const config = ConfigurationSchema.parse(env);

  return Test.createTestingModule({
    ...metadata,
    imports: [
      ConfigModule.forRoot({ ignoreEnvFile: true, isGlobal: true, load: [() => config] }),
      ...(metadata.imports ?? []),
    ],
  }).compile();
};
