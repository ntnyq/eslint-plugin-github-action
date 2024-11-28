import { defineConfig } from 'vitepress'
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { head } from './config/head'
import { getThemeConfig } from './config/theme'

export default defineConfig({
  title: 'eslint-plugin-github-action',

  description: 'Rules for consistent, readable and valid GitHub action files.',

  lastUpdated: true,

  head,
  themeConfig: getThemeConfig(),
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
})
