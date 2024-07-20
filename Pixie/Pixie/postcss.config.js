const postcss = require('postcss');
const namespacePixieStyles = require('./scripts/namespace-pixie-styles.plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    !isDev && namespacePixieStyles,
    !isDev &&
      require('cssnano')({
        preset: 'default',
      }),
  ],
};
