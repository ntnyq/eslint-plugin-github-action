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
        functions: 95,
        lines: 95,
        statements: 95,
        branches: 85,
        perFile: false,
      },
      include: ['**/src/**/*.ts'],
      reporter: ['lcov', 'text'],
    },
  },
})
