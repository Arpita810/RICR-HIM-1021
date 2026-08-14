import js from '@eslint/js';
import globals from 'globals';
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
];
