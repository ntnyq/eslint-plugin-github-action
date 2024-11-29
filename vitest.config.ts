import { defineConfig } from 'vitest/config'
import pkg from './package.json'

export default defineConfig({
  define: {
    __PKG_NAME__: JSON.stringify(pkg.name),
    __PKG_VERSION__: JSON.stringify(pkg.version),
  },
  test: {
    coverage: {
      include: ['**/src/**/*.ts'],
      reporter: ['lcov', 'text'],
      thresholds: {
        branches: 85,
        functions: 95,
        lines: 95,
        perFile: false,
        statements: 95,
      },
    },
    reporters: ['dot'],
  },
})
