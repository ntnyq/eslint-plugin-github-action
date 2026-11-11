import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watch: false,
    coverage: {
      exclude: ['**/src/types/**'],
      include: ['**/src/**/*.ts'],
      reporter: ['lcov', 'text'],
      thresholds: {
        // Allow for branches guarded by rule option schemas.
        branches: 97,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
    projects: [
      {
        test: {
          exclude: ['tests/integration/**'],
          include: ['tests/**/*.test.ts'],
          name: 'source',
        },
      },
      {
        test: {
          include: ['tests/integration/**/*.test.ts'],
          name: 'integration',
        },
      },
    ],
  },
})
