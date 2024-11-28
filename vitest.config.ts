import { defineConfig } from 'vitest/config'
import pkg from './package.json'

export default defineConfig({
  define: {
    __PKG_NAME__: JSON.stringify(pkg.name),
    __PKG_VERSION__: JSON.stringify(pkg.version),
  },
  test: {
    reporters: ['dot'],
    coverage: {
      include: ['**/src/**/*.ts'],
      reporter: ['lcov', 'text', 'json'],
    },
  },
})
