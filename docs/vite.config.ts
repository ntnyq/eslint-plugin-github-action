import { fileURLToPath } from 'node:url'
import UnoCSS from 'unocss/vite'
import VueComponents from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'

export default defineConfig({
  optimizeDeps: {
    exclude: ['vitepress'],
  },
  plugins: [
    UnoCSS(),
    VueComponents({
      dirs: [fileURLToPath(new URL('./.vitepress/components', import.meta.url))],
      dts: fileURLToPath(new URL('./components.d.ts', import.meta.url)),
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      extensions: ['vue', 'md'],
    }),
    groupIconVitePlugin(),
  ],
})
