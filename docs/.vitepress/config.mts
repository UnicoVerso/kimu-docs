import { defineConfig } from 'vitepress'
import markdownItTaskLists from 'markdown-it-task-lists';
import { version } from './version'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: `Kimu Documentation - v${version}`,
  description: 'Documentation for Kimu, a ultra-lightweight framework for building modular and extensible applications.',
  markdown: {
    config: (md) => {
      md.use(markdownItTaskLists)
    }
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'KIMU', link: '/en/concepts/' },
          { text: 'Guide', link: '/en/guide/' },
          { text: 'Examples', link: '/en/examples/' },
        ],
        sidebar: [
          {
            text: 'Concepts',
            collapsed: false,
            items: [
              { text: 'Introduction', link: '/en/concepts/index' },
              { text: 'Philosophy', link: '/en/concepts/philosophy' },
              { text: 'Manifesto', link: '/en/concepts/manifest' },
              { text: 'Vision & Mission', link: '/en/concepts/vision-mission' },
              { text: 'Why KIMU?', link: '/en/concepts/why-kimu' },
              { text: 'Use Cases', link: '/en/concepts/use-cases' },
              { text: 'KIMU vs Other Frameworks', link: '/en/concepts/kimu-vs-others' },
              { text: 'History', link: '/en/concepts/history' },
              { text: 'Credits', link: '/en/concepts/credits' },
              { text: 'Contributing', link: '/en/concepts/contributing' },
              { text: 'Roadmap', link: '/en/concepts/roadmap' },
              { text: 'FAQ', link: '/en/concepts/faq' }
            ]
          },
          {
            text: 'Guide',
            collapsed: false,
            items: [
              { text: 'Introduction', link: '/en/guide/index' },
              { text: 'Get Started', link: '/en/guide/get-started' },
              { text: 'Architecture', link: '/en/guide/architecture' },
              { text: 'Configuration', link: '/en/guide/configuration' },
              { text: 'Best Practices', link: '/en/guide/best-practices' },
              { text: 'Lifecycle', link: '/en/guide/lifecycle' },
              { text: 'Modules', link: '/en/guide/modules' },
              { text: 'Extensions', link: '/en/guide/extensions' },
              { text: 'API', link: '/en/guide/api' },
              { text: 'Helpers', link: '/en/guide/helpers' },
              { text: 'Community', link: '/en/guide/community' },
              { text: 'FAQ', link: '/en/guide/faq' },
              { text: 'Next Steps', link: '/en/guide/next-steps' }
            ]
          },
          {
            text: 'Examples',
            collapsed: false,
            items: [
              { text: 'Overview', link: '/en/examples/index' },
              { text: 'Markdown Examples', link: '/en/examples/markdown-examples' },
              { text: 'API Examples', link: '/en/examples/api-examples' }
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
          { text: 'KIMU', link: '/it/concepts/' },
          { text: 'Guida', link: '/it/guide/' },
          { text: 'Esempi', link: '/it/examples/' }
        ],
        sidebar: [
          {
            text: 'Concetti',
            collapsed: false,
            items: [
              { text: 'Introduzione', link: '/it/concepts/index' },
              { text: 'Filosofia', link: '/it/concepts/philosophy' },
              { text: 'Manifesto', link: '/it/concepts/manifest' },
              { text: 'Visione & Missione', link: '/it/concepts/vision-mission' },
              { text: 'Perché KIMU?', link: '/it/concepts/why-kimu' },
              { text: 'Casi d\'uso', link: '/it/concepts/use-cases' },
              { text: 'KIMU vs Altri Framework', link: '/it/concepts/kimu-vs-others' },
              { text: 'Storia', link: '/it/concepts/history' },
              { text: 'Crediti', link: '/it/concepts/credits' },
              { text: 'Contribuire', link: '/it/concepts/contributing' },
              { text: 'Roadmap', link: '/it/concepts/roadmap' }
            ]
          },
          {
            text: 'Guida',
            collapsed: false,
            items: [
              { text: 'Introduzione', link: '/it/guide/index' },
              { text: 'Inizia subito', link: '/it/guide/get-started' },
              { text: 'Architettura', link: '/it/guide/architecture' },
              { text: 'Configurazione', link: '/it/guide/configuration' },
              { text: 'Best Practices', link: '/it/guide/best-practices' },
              { text: 'Ciclo di vita', link: '/it/guide/lifecycle' },
              { text: 'Moduli', link: '/it/guide/modules' },
              { text: 'Estensioni', link: '/it/guide/extensions' },
              { text: 'API', link: '/it/guide/api' },
              { text: 'Helper', link: '/it/guide/helpers' },
              { text: 'Community', link: '/it/guide/community' },
              { text: 'FAQ', link: '/it/guide/faq' },
              { text: 'Prossimi passi', link: '/it/guide/next-steps' }
            ]
          },
          {
            text: 'Esempi',
            collapsed: false,
            items: [
              { text: 'Panoramica', link: '/it/examples/index' },
              { text: 'Esempi Markdown', link: '/it/examples/markdown-examples' },
              { text: 'Esempi API', link: '/it/examples/api-examples' }
            ]
          }
        ]
      }
    }
  },
  themeConfig: {
    siteTitle: `Kimu-Docs - v${version}`,
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
      message: 'Released under Creative Commons Attribution 4.0 International (CC BY 4.0)',
      copyright: "Copyright © 2025 - Marco (Hocram) Di Pasquale - UnicòVerso | <a href='https://unicoverso.com/kimu' target='_blank'>unicoverso.com/kimu</a>"
    }
  }
})
