import { defineConfig } from 'tsup'
import pkg from './package.json'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  clean: true,
  cjsInterop: true,
  format: ['cjs', 'esm'],
  target: 'es2022',
  define: {
    __PKG_NAME__: JSON.stringify(pkg.name),
    __PKG_VERSION__: JSON.stringify(pkg.version),
  },
})
