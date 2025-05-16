const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const reactNative = require('eslint-plugin-react-native');
const prettier = require('eslint-config-prettier');

// react.configs.recommended voi olla undefined joissain versioissa!
// Tarkista näin:
const reactRules =
  react.configs && react.configs.recommended ? react.configs.recommended.rules : {};
const reactNativeRules =
  reactNative.configs && reactNative.configs.recommended
    ? reactNative.configs.recommended.rules
    : {};

module.exports = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-native': reactNative,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...reactRules,
      ...reactNativeRules,
      'react-native/no-inline-styles': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  prettier,
];
