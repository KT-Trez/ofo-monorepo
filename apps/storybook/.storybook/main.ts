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
} satisfies StorybookConfig;
