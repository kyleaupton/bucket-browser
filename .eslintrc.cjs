module.exports = {
  env: {
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    'eslint:recommended',
    'prettier',
  ],
  plugins: ['prettier'],
  rules: {
    // Required
    'prettier/prettier': 'error',

    // Optional
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
  },
};
