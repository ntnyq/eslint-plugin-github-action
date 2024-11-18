import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['dot'],
    coverage: {
      reporter: ['lcov', 'text', 'json'],
    },
  },
})
