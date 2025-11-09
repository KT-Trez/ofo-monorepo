import type { ConfigContext, ExpoConfig } from 'expo/config';

// noinspection JSUnusedGlobalSymbols
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  android: {
    adaptiveIcon: {
      backgroundColor: '#ffffff',
      foregroundImage: './assets/adaptive-icon.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  icon: './assets/icon.png',
  name: 'symfi-mobile',
  newArchEnabled: true,
  orientation: 'portrait',
  plugins: ['expo-router'],
  scheme: 'symfi',
  slug: 'symfi-mobile',
  splash: {
    backgroundColor: '#ffffff',
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
  },
  userInterfaceStyle: 'light',
  version: '1.0.0',
  web: {
    favicon: './assets/favicon.png',
  },
});
