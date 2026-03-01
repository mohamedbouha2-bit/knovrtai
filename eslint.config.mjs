import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import nextPlugin from '@next/eslint-plugin-next';
import globals from 'globals';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const nextCoreWebVitals = nextPlugin.configs['core-web-vitals'] ?? { rules: {} };

export default [
  {
    // الملفات التي يتم تجاهلها تماماً من الفحص
    ignores: [
      '.next/**', 'node_modules/**', 'dist/**', 'build/**', 
      'src/assets/**', 'src/font/**', 'src/ui/**', '.history/**', 
      'eslint.config.mjs', 'tailwind.config.mjs'
    ]
  },

  {
    files: ['src/**/*.{js,jsx,ts,tsx}', 'app/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser, ...globals.node,
        React: "readonly", JSX: "readonly", 
        process: "readonly" // لضمان عدم الخطأ في استخدام متغيرات البيئة
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        tsconfigRootDir: __dirname,
      }
    },
    plugins: {
      '@typescript-eslint': ts,
      react: reactPlugin,
      'react-hooks': reactHooks,
      import: importPlugin,
      '@next/next': nextPlugin
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        alias: {
          map: [
            ['@', path.resolve(__dirname, 'src')],
            ['@ui', path.resolve(__dirname, 'src/ui')],
            ['@utils', path.resolve(__dirname, 'src/utils')],
            ['@lib', path.resolve(__dirname, 'src/lib')],
            ['@server', path.resolve(__dirname, 'server')],
          ],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
      }
    },
    rules: {
      ...nextCoreWebVitals.rules,
      // --- أخطاء حرجة (Errors) ---
      'import/no-unresolved': 'error',
      'import/no-cycle': ['error', { maxDepth: 10 }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn', // مهم لضمان استقرار الـ Hooks
      'no-undef': 'off', // نعطله هنا لأن TS يتولى المهمة في الملفات التابعة له

      // --- تخفيف القواعد للتطوير السريع (Off/Warn) ---
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
      'no-unreachable': 'warn',
    }
  },

  // إعدادات خاصة بملفات السيرفر (Backend)
  {
    files: ['server/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      'import/no-unresolved': 'error',
      'no-console': 'off' // مسموح في السيرفر للسجلات (Logs)
    }
  }
];