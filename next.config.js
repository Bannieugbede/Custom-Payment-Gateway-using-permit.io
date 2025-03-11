// module.exports = {
//   env: {
//     PERMIT_API_KEY: process.env.PERMIT_API_KEY,
//   },
//   telemetry: false,
// };

require('dotenv').config();

module.exports = {
  env: {
    PERMIT_API_KEY: process.env.PERMIT_API_KEY,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    });
    return config;
  },
};