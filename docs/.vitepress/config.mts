import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/guide/' },
          { text: 'Examples', link: '/en/examples/' }
        ],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Introduction', link: '/en/guide/index' },
              { text: 'Get Started', link: '/en/guide/get-started' },
              { text: 'Architecture', link: '/en/guide/architecture' },
              { text: 'Life Cycle', link: '/en/guide/lifecycle' },
              { text: 'Configuration', link: '/en/guide/configuration' },
              { text: 'Extensions', link: '/en/guide/extensions' },
              { text: 'Modules', link: '/en/guide/modules' },
              { text: 'Helpers & Services', link: '/en/guide/helpers' },
              { text: 'API Reference', link: '/en/guide/api' },
              { text: 'FAQ', link: '/en/guide/faq' },
              { text: 'Next Steps', link: '/en/guide/next-steps' },
              { text: 'Community', link: '/en/guide/community' },
              { text: 'Author and Contact', link: '/en/guide/about' }
            ]
          },
          {
            text: 'Examples',
            items: [
              { text: 'Markdown Examples', link: '/en/examples/markdown-examples' },
              { text: 'Runtime API Examples', link: '/en/examples/api-examples' }
            ]
          }
        ]
      }
    },
    it: {
      label: 'Italiano',
      lang: 'it-IT',
      link: '/it/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/it/' },
          { text: 'Guida', link: '/it/guide/' },
          { text: 'Esempi', link: '/it/examples/' }
        ],
        sidebar: [
          {
            text: 'Guida',
            items: [
              { text: 'Introduzione', link: '/it/guide/index' },
              { text: 'Inizia', link: '/it/guide/get-started' },
              { text: 'Architettura', link: '/it/guide/architecture' },
              { text: 'Ciclo di Vita', link: '/it/guide/lifecycle' },
              { text: 'Configurazione', link: '/it/guide/configuration' },
              { text: 'Estensioni', link: '/it/guide/extensions' },
              { text: 'Moduli', link: '/it/guide/modules' },
              { text: 'Helpers & Servizi', link: '/it/guide/helpers' },
              { text: 'Riferimento API', link: '/it/guide/api' },
              { text: 'FAQ', link: '/it/guide/faq' },
              { text: 'Prossimi Passi', link: '/it/guide/next-steps' },
              { text: 'Community', link: '/it/guide/community' },
              { text: 'Autore e Contatti', link: '/it/guide/about' }
            ]
          },
          {
            text: 'Esempi',
            items: [
              { text: 'Esempi Markdown', link: '/it/examples/markdown-examples' },
              { text: 'Esempi API Runtime', link: '/it/examples/api-examples' }
            ]
          }
        ]
      }
    }
  },
  themeConfig: {
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
    // ...existing code...
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
    }
  }
})
