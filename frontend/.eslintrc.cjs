module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'eslint-config-prettier',
    'prettier'
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'vite.config.ts'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier'],
  rules: {
    // 'no-unused-vars': 'off',
    // '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/rules-of-hooks': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'always',
        bracketSameLine: false,
        bracketSpacing: true,
        semi: false,
        experimentalTernaries: false,
        singleQuote: true,
        quoteProps: 'as-needed',
        trailingComma: 'none',
        singleAttributePerLine: false,
        htmlWhitespaceSensitivity: 'css',
        vueIndentScriptAndStyle: false,
        proseWrap: 'preserve',
        insertPragma: false,
        requirePragma: false,
        tabWidth: 2,
        useTabs: false,
        embeddedLanguageFormatting: 'auto',
        endOfLine: 'auto',
        printWidth: 60,
        jsxSingleQuote: true
      }
    ]
  }
}
