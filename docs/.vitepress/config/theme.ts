import { globSync } from 'tinyglobby'
import { version } from '../../../package.json'
import { resolve } from '../../../scripts/utils'
import { packageName } from '../meta'
import type { DefaultTheme } from 'vitepress'

const VERSIONS: DefaultTheme.NavItemWithLink[] = [
  { text: `v${version} (current)`, link: '/' },
  { text: `Release Notes`, link: `https://github.com/ntnyq/${packageName}/releases` },
]

function ruleToSidebarItem(ruleId: string): DefaultTheme.SidebarItem {
  return {
    text: ruleId,
    link: `/rules/${ruleId}`,
  }
}

export function getThemeConfig() {
  const rules = globSync(resolve('src/rules/*.ts'), {
    ignore: ['**/index.ts'],
    onlyFiles: true,
    cwd: resolve(),
  })
    .map(path => path.split('/').pop()!)
    .map(path => path.replace('.ts', ''))

  const config: DefaultTheme.Config = {
    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },

    logo: {
      light: '/logo-light.svg',
      dark: '/logo-dark.svg',
    },

    editLink: {
      text: 'Suggest changes to this page',
      pattern: `https://github.com/ntnyq/${packageName}/edit/main/docs/:path`,
    },

    socialLinks: [
      { icon: 'x', link: 'https://twitter.com/ntnyq' },
      { icon: 'npm', link: `https://www.npmjs.com/package/${packageName}` },
      { icon: 'github', link: `https://github.com/ntnyq/${packageName}` },
    ],

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Rules', link: '/rules/' },
      {
        text: `v${version}`,
        items: VERSIONS,
      },
    ],

    sidebar: {
      '/rules/': [
        {
          text: 'Rules',
          items: [
            {
              text: 'Overview',
              link: '/rules/',
            },
          ],
        },
        {
          text: 'Rules list',
          items: rules.map(ruleId => ruleToSidebarItem(ruleId)),
        },
      ],
      '/': [
        {
          text: 'Guide',
          items: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide/' },
            { text: 'Rules', link: '/rules/' },
          ],
        },
      ],
    },
  }

  return config
}
