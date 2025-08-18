// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = defineConfig([
  expoConfig, // Importe les règles recommandées pour Expo
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Ajoute Prettier comme "règle ESLint"
      'prettier/prettier': 'error',
    },
    ignores: ['dist/*'], // Ignore le dossier dist (builds)
  },
]);
