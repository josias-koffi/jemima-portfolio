import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // <img> natifs volontaires : le CSS d'origine cible directement les balises.
      '@next/next/no-img-element': 'off',
      // Liens <a> natifs volontaires : navigation complète → transitions de page CSS.
      '@next/next/no-html-link-for-pages': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^(_|ignore)' },
      ],
    },
  },
  {
    ignores: ['.next/', 'src/payload-types.ts', 'src/app/(payload)/**', 'src/migrations/**', 'playwright-report/', 'test-results/'],
  },
]

export default eslintConfig
