import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['dot'],
    coverage: {
      all: false,
      include: ['**/src/**/*.ts'],
      reporter: ['lcov', 'text'],
      thresholds: {
        100: true,
      },
    },
  },
})
