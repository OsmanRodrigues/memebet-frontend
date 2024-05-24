import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ...pluginReactConfig,
        rules: {
            ...pluginReactConfig.rules,
            'react/react-in-jsx-scope': 0,
            '@typescript-eslint/no-explicit-any': 0
        }
    },
    {
        ignores: ['build/*', 'node_modules/*']
    },
    eslintConfigPrettier
];
