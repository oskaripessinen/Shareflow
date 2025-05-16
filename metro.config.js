const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const nodeLibs = require('node-libs-react-native');
const path = require('path');

nodeLibs.stream = require.resolve('readable-stream');

const empty = require.resolve(path.join(__dirname, 'metro.empty.js'));
nodeLibs.net = empty;
nodeLibs.tls = empty;
nodeLibs.dns = empty;

const config = getDefaultConfig(__dirname);
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...nodeLibs,
  },
};

module.exports = withNativeWind(config, { input: './global.css' });
