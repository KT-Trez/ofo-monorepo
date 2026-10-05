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
      name: 'server e2e',
      root: 'apps/server',
      testTimeout: 120_000,
    },
  });
  // requires real ffmpeg and ffprobe on PATH
  projects.push({
    extends: true,
    test: {
      include: ['**/*.e2e.ts'],
      name: 'ytdlp e2e',
      root: 'packages/ytdlp',
      testTimeout: 60_000,
    },
  });
}

if (process.env.INTEGRATION === '1') {
  projects.push({
    extends: true,
    test: {
      include: ['**/*.integration.spec.ts'],
      name: 'server integration',
      root: 'apps/server',
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
          include: ['{src,config}/**/*.spec.ts'],
          name: 'server',
          root: 'apps/server',
        },
      },
      {
        extends: true,
        test: {
          name: 'ytdlp',
          root: 'packages/ytdlp',
        },
      },
      ...projects,
    ],
  },
});
