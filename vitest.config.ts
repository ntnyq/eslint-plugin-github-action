import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: ['**/src/**/*.ts'],
      reporter: ['lcov', 'text'],
      thresholds: {
        100: true,
      },
    },
  },
})
