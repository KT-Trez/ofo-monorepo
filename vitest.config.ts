/// <reference types="node" />
/// <reference types="vitest" />
import swc from 'unplugin-swc';
import { defineConfig, type TestProjectInlineConfiguration } from 'vitest/config';

const projects: TestProjectInlineConfiguration[] = [];

if (process.env.E2E === '1') {
  projects.push({
    extends: true,
    test: {
      include: ['**/*.live-spec.ts'],
      name: 'api-core e2e',
      root: 'apps/api-core',
      testTimeout: 120_000,
    },
  });
}

// requires a running instance of the infrastructure; see `docker-compose.integration.yml` for details
if (process.env.INTEGRATION === '1') {
  projects.push({
    extends: true,
    test: {
      exclude: ['**/node_modules/**', '**/dist/**'],
      globalSetup: ['./test/integration.global-setup.ts'],
      include: ['**/*.int-spec.ts'],
      name: 'api-core integration',
      root: 'apps/api-core',
      testTimeout: 60_000,
    },
  });
}

export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    clearMocks: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'api-core',
          root: 'apps/api-core/src',
        },
      },
      ...projects,
    ],
  },
});
