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
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/all',
    ],
    plugins: [
        'jest'
    ],
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/naming-convention': ['error', {
            selector: 'interface',
            format: ['PascalCase'],
            custom: { regex: '^I[A-Z]', match: true }
          }],
        '@typescript-eslint/no-explicit-any': 'off',
    }
};
