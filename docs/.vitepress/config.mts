import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title: "Kimu-Docs",
  description: "Keep It Minimal UI Framework",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    siteTitle: 'Kimu-Docs',

    logo: {
      light: '/images/icon.svg',
      dark: '/images/icon.svg',
      alt: 'Kimu'
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide' },
      { text: 'Examples', link: '/examples' },

      {
        text: 'Dropdown Menu',
        items: [
          { text: 'Item A', link: '/item-1' },
          { text: 'Item B', link: '/item-2' },
          { text: 'Item C', link: '/item-3' }
        ]
      }

    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/index' },
          { text: 'Get Started', link: '/guide/get-started' },
          { text: 'Architecture', link: '/guide/architecture' },
          { text: 'Life Cycle', link: '/guide/lifecycle' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Extensions', link: '/guide/extensions' },
          { text: 'Modules', link: '/guide/modules' },
          { text: 'Helpers & Services', link: '/guide/helpers' },
          { text: 'API Reference', link: '/guide/api' },
          { text: 'FAQ', link: '/guide/faq' },
          { text: 'Next Steps', link: '/guide/next-steps' },
          { text: 'Community', link: '/guide/community' },
          { text: 'Author and Contact', link: '/guide/about' }
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/examples/markdown-examples' },
          { text: 'Runtime API Examples', link: '/examples/api-examples' }
        ]
      }
    ],

    socialLinks: [
      {
        icon: {
          svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12L12 3l9 9"/><path d="M9 21V9h6v12"/></svg>'
        },
        link: 'https://unicoverso.com/kimu'
      },
      { icon: 'github', link: 'https://github.com/unicoverso/kimu' },
      { icon: 'instagram', link: 'https://instagram.com/unicoverso_com' }
    ],

    footer: {
      message: 'Released under the *** License.',
      copyright: 'Copyright © 2025 - Marco (Hocram) Di Pasquale - UnicòVerso'
    },

    /*
    carbonAds: {
      code: 'your-carbon-code',
      placement: 'your-carbon-placement'
    }
    */

    /*
    docFooter: {
      prev: 'Pagina prior',
      next: 'Proxima pagina'
    }
    */
  }
})
