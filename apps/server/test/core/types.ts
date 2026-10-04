import type { ModuleMetadata } from '@nestjs/common';

export type TestSetupMetadata = Pick<ModuleMetadata, 'controllers' | 'imports' | 'providers'>;
