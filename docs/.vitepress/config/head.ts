import type { HeadConfig } from 'vitepress'

const ogTitle = 'eslint-plugin-github-action'
const ogUrl = 'https://eslint-plugin-github-action.ntnyq.com'

export const head: HeadConfig[] = [
  ['link', { rel: 'icon', href: '/favicon.ico' }],
  ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
  ['meta', { name: 'theme-color', href: '#ffffff' }],
  ['meta', { property: 'og:type', content: 'website' }],
  ['meta', { property: 'og:title', content: ogTitle }],
  ['meta', { property: 'og:url', content: ogUrl }],
]
