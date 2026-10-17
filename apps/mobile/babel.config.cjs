/** @type {import('@babel/core').ConfigFunction} */
module.exports = api => {
  api.cache(true);

  return {
    plugins: [['react-native-unistyles/plugin', { root: 'src' }]],
    presets: ['babel-preset-expo'],
  };
};
