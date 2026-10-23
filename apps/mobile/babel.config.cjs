/** @type {import('@babel/core').ConfigFunction} */
module.exports = api => {
  api.cache(true);

  return {
    plugins: [
      ['inline-import', { extensions: ['.sql'] }], // `@ofo/database`: `drizzle/migrations.js`
      ['react-native-unistyles/plugin', { root: 'src' }],
    ],
    presets: ['babel-preset-expo'],
  };
};
