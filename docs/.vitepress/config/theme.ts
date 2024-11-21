import type { DefaultTheme } from 'vitepress'

export const themeConfig: DefaultTheme.Config = {
  search: {
    provider: 'local',
  },

  editLink: {
    pattern: 'https://github.com/ntnyq/eslint-plugin-github-action/edit/main/docs/:path',
  },

  socialLinks: [{ icon: 'github', link: 'https://github.com/ntnyq/eslint-plugin-github-action' }],

  nav: [
    { text: 'Introduction', link: '/' },
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
        items: [
          {
            text: 'action-name-casing',
            link: '/rules/action-name-casing',
          },
          {
            text: 'require-action-name',
            link: '/rules/require-action-name',
          },
        ],
      },
    ],
    '/': [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/' },
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
