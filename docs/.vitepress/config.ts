import { defineConfig } from 'vitepress'
import { head } from './config/head'
import { themeConfig } from './config/theme'

export default defineConfig({
  title: 'eslint-plugin-github-action',

  description: 'Rules for consistent, readable and valid GitHub action files.',

  head,
  themeConfig,
  lastUpdated: true,
})
