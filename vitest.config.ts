import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    clearMocks: true,
    projects: [
      {
        extends: true,
        plugins: [swc.vite({ module: { type: 'es6' } })],
        test: {
          name: 'api-core',
          root: 'apps/api-core/src',
        },
      },
      {
        extends: true,
        plugins: [swc.vite({ module: { type: 'es6' } })],
        test: {
          name: 'api-core e2e',
          root: 'apps/api-core/test',
        },
      },
    ],
  },
});
