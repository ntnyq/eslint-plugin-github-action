import { appDescription, appTitle, appUrl } from '../meta'
import type { HeadConfig } from 'vitepress'

export const head: HeadConfig[] = [
  ['link', { rel: 'icon', href: '/favicon.ico' }],
  ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
  ['meta', { name: 'theme-color', href: '#ffffff' }],
  ['meta', { property: 'og:type', content: 'website' }],
  ['meta', { property: 'og:title', content: appTitle }],
  ['meta', { property: 'og:url', content: appUrl }],
  ['meta', { property: 'og:description', content: appDescription }],
  // ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  // ['meta', { name: 'twitter:image', content: `${appUrl}/og.png` }],
]
