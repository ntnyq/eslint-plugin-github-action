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
      thresholds: {
        functions: 90,
        lines: 90,
        statements: 90,
        branches: 75,
        perFile: false,
      },
      include: ['**/src/**/*.ts'],
      reporter: ['lcov', 'text'],
    },
  },
})
