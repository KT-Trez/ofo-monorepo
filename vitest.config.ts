import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

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
      {
        extends: true,
        test: {
          include: ['**/*.e2e-spec.ts'],
          name: 'api-core e2e',
          root: 'apps/api-core/test',
        },
      },
    ],
  },
});
