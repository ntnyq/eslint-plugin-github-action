import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watch: false,
    coverage: {
      exclude: ['**/src/types/**', '**/src/utils/index.ts', '**/src/dts.ts'],
      include: ['**/src/**/*.ts'],
      reporter: ['lcov', 'text'],
      thresholds: {
        // Branch coverage at 97.3% due to JSON schema-guarded branches
        // that are unreachable in practice (marked with v8 ignore comments)
        branches: 97,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  },
})
