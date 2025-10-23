// eslint.config.mjs
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier, // desactiva reglas de formato que chocan con Prettier
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts'])
])
