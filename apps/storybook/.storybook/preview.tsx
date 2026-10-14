import './fonts.css';
import type { Preview } from '@storybook/react-native-web-vite';
import { withTheme } from './preview-frame-decorator.tsx';

export default {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        dynamicTitle: true,
        icon: 'paintbrushalt',
        items: [
          { title: 'System', value: 'system' },
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
      },
    },
  },
  initialGlobals: { theme: 'system' },
  parameters: {
    backgrounds: { disable: true },
    layout: 'fullscreen',
  },
} satisfies Preview;
