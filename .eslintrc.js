module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions:  {
        ecmaVersion: 2020,  // Allows for the parsing of modern ECMAScript features
        project: 'tsconfig.json',
        sourceType:  'module',  // Allows for the use of imports
        tsconfigRootDir: '.'
    },
    env: {
        jest: true,
        node: true,
    },
    extends: [
        'eslint:all',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/all',
    ],
    plugins: [
        'jest'
    ],
    rules: {
        'dot-location': 'off',
        'func-style': 'off',
        'function-call-argument-newline': 'off',
        'init-declarations': 'off',
        'implicit-arrow-linebreak': 'off',
        'max-lines-per-function': ['error', 120],
        'max-len': ['error', { code: 120 }],
        'max-params': ['error', 5],
        'max-statements': ['error', 50, {ignoreTopLevelFunctions: true }],
        'multiline-ternary': 'off',
        'no-extra-parens': 'off',
        'no-magic-numbers': 'off',
        'no-undefined': 'off',
        'padded-blocks': 'off',
        'no-ternary': 'off',
        'one-var': 'off',
        'space-before-function-paren': ['error', 'never'],
        quotes: ['error', 'single', { allowTemplateLiterals: true }],
        'quote-props': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/naming-convention': ['error', {
            selector: 'interface',
            format: ['PascalCase'],
            custom: { regex: '^I[A-Z]', match: true }
          }],
        '@typescript-eslint/no-explicit-any': 'off',
    }
};
