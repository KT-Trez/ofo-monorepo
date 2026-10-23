const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

const APP_ORIGIN = path.join(__dirname, 'package.json');

// `@ofo/ui` brings its own `react-*` packages; resolve them from here so there is a single copy
const SINGLETONS = ['react', 'react-native', 'react-native-unistyles'];

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isSingleton = SINGLETONS.some(name => {
    return moduleName === name || moduleName.startsWith(`${name}/`);
  });

  return context.resolveRequest(
    isSingleton ? { ...context, originModulePath: APP_ORIGIN } : context,
    moduleName,
    platform,
  );
};

// `@ofo/database` bundles its Drizzle migrations as `.sql` imports (inlined by `babel-plugin-inline-import`)
config.resolver.sourceExts.push('sql');

module.exports = config;
