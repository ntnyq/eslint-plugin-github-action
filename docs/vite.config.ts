import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'

export default defineConfig({
  optimizeDeps: {
    exclude: ['vitepress'],
  },
  plugins: [UnoCSS(), groupIconVitePlugin()],
})
