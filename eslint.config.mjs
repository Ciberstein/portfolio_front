import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      // "flat" was the export name in older releases of this plugin; the
      // installed version publishes its flat config as recommended-latest.
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      react.configs.flat['jsx-runtime'],
    ],
    plugins: { react },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Without this, no-unused-vars does not count a JSX tag as a use, so every
      // polymorphic `as` prop and every mapped `icon: Icon` is reported as dead
      // code. A linter that cries wolf is one nobody runs — which is how this
      // config sat broken without anyone noticing.
      'react/jsx-uses-vars': 'error',
    },
  },
])
