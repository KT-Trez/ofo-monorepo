const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

// `@ofo/ui` brings its own `react-*` packages; resolve them from here so there is a single copy
const SINGLETONS = ['react', 'react-native', 'react-native-unistyles'];

const config = getDefaultConfig(__dirname);
const appOrigin = path.join(__dirname, 'package.json');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isSingleton = SINGLETONS.some(name => {
    return moduleName === name || moduleName.startsWith(`${name}/`);
  });

  return context.resolveRequest(
    isSingleton ? { ...context, originModulePath: appOrigin } : context,
    moduleName,
    platform,
  );
};

module.exports = config;
