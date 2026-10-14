import type { StorybookConfig } from '@storybook/react-native-web-vite';

export default {
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      pluginReactOptions: {
        babel: {
          plugins: [['react-native-unistyles/plugin', { root: 'src' }]],
        },
      },
    },
  },
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  // `@ofo/ui` brings its own `react-*` packages; resolve them from here so there is a single copy
  viteFinal: config => ({
    ...config,
    resolve: {
      ...config.resolve,
      dedupe: [
        ...(config.resolve?.dedupe ?? []),
        'react',
        'react-dom',
        'react-native-web',
        'react-native-unistyles',
      ],
    },
  }),
} satisfies StorybookConfig;
