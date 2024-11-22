import { globSync } from 'tinyglobby'
import { resolve } from '../../../scripts/utils'
import type { DefaultTheme } from 'vitepress'

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

    editLink: {
      pattern: 'https://github.com/ntnyq/eslint-plugin-github-action/edit/main/docs/:path',
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/ntnyq/eslint-plugin-github-action' }],

    nav: [
      { text: 'Home', link: '/' },
      { text: 'User Guide', link: '/user-guide/' },
      { text: 'Rules', link: '/rules/' },
      {
        text: 'Changelog',
        link: 'https://github.com/ntnyq/eslint-plugin-github-action/releases',
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
            { text: 'User Guide', link: '/user-guide/' },
            { text: 'Rules', link: '/rules/' },
            {
              text: 'Changelog',
              link: 'https://github.com/ntnyq/eslint-plugin-github-action/releases',
            },
          ],
        },
      ],
    },
  }

  return config
}
