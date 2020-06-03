const path = require('path');

module.exports = {
  webpack: {
    entry: './src/index.jsx',
    alias: {
      actions: path.resolve(__dirname, './src/actions/'),
      components: path.resolve(__dirname, './src/components/'),
      constants: path.resolve(__dirname, './src/constants/'),
      contexts: path.resolve(__dirname, './src/contexts/'),
      hocs: path.resolve(__dirname, './src/hocs/'),
      hooks: path.resolve(__dirname, './src/hooks/'),
      mocks: path.resolve(__dirname, './src/mocks/'),
      reducers: path.resolve(__dirname, './src/reducers/'),
      screens: path.resolve(__dirname, './src/screens/'),
      services: path.resolve(__dirname, './src/services/'),
      transforms: path.resolve(__dirname, './src/transforms/'),
      utils: path.resolve(__dirname, './src/utils/'),
    },
  },
};
