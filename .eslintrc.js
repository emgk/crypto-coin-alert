module.exports = {
    env: {
        browser: true,
        es6: true
    },
    extends: ['react-app', 'prettier'],
    parserOptions: {
        ecmaVersion: 12
    },
    plugins: ['react', 'prettier'],
    rules: {
        'prettier/prettier': [
            'error',
            {
                semi: true,
                tabWidth: 4,
                printWidth: 100,
                singleQuote: true,
                trailingComma: 'none',
                jsxBracketSameLine: true
            }
        ]
    }
};
