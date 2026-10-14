import type { Decorator } from '@storybook/react-native-web-vite';
import { PreviewFrame } from './preview-frame.tsx';

export const withTheme: Decorator = (Story, context) => (
  <PreviewFrame preference={context.globals.theme}>
    <Story />
  </PreviewFrame>
);
