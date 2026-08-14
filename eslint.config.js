import js from '@eslint/js';
import globals from 'globals';
<<<<<<< HEAD
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
            'backend/node_modules/**',
            'backend/uploads/**',
            'backend/data/**',
            'coverage/**',
            '.git/**',
            'public/**',
            'gen.js',
            '**/*.py',
            '**/*.ipynb',
        ],
    },
    js.configs.recommended,
    {
        files: [
            'src/**/*.{js,jsx}',
            'backend/**/*.js',
            'scripts/**/*.js',
            'vite.config.js',
            'tailwind.config.js',
            'postcss.config.js',
            '*.js',
        ],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/no-unescaped-entities': 'off',
            'react-refresh/only-export-components': 'off',
            'react-hooks/exhaustive-deps': 'off',
            'no-unused-vars': 'off',
            'no-console': 'off',
            'no-duplicate-imports': 'off',
            'no-dupe-keys': 'off',
            'no-control-regex': 'off',
            'no-useless-escape': 'off',
            'prefer-const': 'warn',
            'no-var': 'error',
            eqeqeq: 'off',
            curly: 'off',
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
        },
    },
=======
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.vite/**',
      'backend/**',
    ],
  },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
        },
      ],
      'no-undef': 'error',
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'eqeqeq': ['warn', 'always'],

      // React rules
      'react/react-in-jsx-scope': 'off', // React 17+
      'react/prop-types': 'off', // Using TypeScript/other validation
      'react/no-unescaped-entities': 'warn',
      'react/display-name': 'warn',
      'react/no-children-prop': 'warn',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // JSX a11y rules
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
    },
  },
  {
    files: ['*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
        },
      ],
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
>>>>>>> 984042a287e79b9407dceaab05a15cc186ee9f16
];
