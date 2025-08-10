import { defineConfig } from 'vitepress'
import markdownItTaskLists from 'markdown-it-task-lists';
import { version } from './version'

// https://vitepress.dev/reference/site-config
export default defineConfig({

  title: `Kimu Docs - v${version}`,
  description: 'Documentation for Kimu, a ultra-lightweight framework for building modular and extensible applications.',

  markdown: {
    config: (md) => {
      md.use(markdownItTaskLists)
    }
  },
  
  // Abilita "Last Updated" via git
  lastUpdated: true,

  // Facoltativo: ignora link temporanei non ancora creati
  // ignoreDeadLinks: true

  // Sitemap (serve hostname)
  sitemap: {
    hostname: 'https://unicoverso.com/kimu'
  },

  // Meta / favicon / OG
  head: [
    ['meta', { name: 'theme-color', content: '#111' }],
    ['link', { rel: 'icon', href: '/images/icon.svg' }],
    ['meta', { property: 'og:title', content: `Kimu Docs - v${version}` }],
    ['meta', { property: 'og:description', content: 'Kimu framework documentation' }],
    ['meta', { property: 'og:type', content: 'website' }]
  ],

  locales: {
    root: {
      label: 'Welcome',
      lang: 'en-US',
      link: `/`,
      themeConfig: {
        nav: [
          { text: 'Home', link: `/` },
          { text: '🇮🇹 Italiano', link: `/it/` },
          { text: '🇬🇧 English', link: `/en/` },
        ],
        sidebar: []
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: `/en/`,
      themeConfig: {
        nav: [
          { text: '<span style="background:#ff3b3b;color:#fff;padding:4px 50px;border-radius:6px;font-weight:bold;display:inline-block;">🚧  WORK IN PROGRESS</span>', link: '/en/' },
          { text: 'Home', link: `/en/` },
          { text: 'KIMU', link: `/en/concepts/` },
          { text: 'Guide', link: `/en/guide/` },
          { text: 'Framework', link: `/en/framework/` },
          { text: 'Examples', link: `/en/examples/` },
        ],
        sidebar: [
          // ...sidebar inglese come prima...
        ]
      }
    },
    it: {
      label: 'Italiano',
      lang: 'it-IT',
      link: `/it/`,
      themeConfig: {
        nav: [
          { text: '<span style="background:#ff3b3b;color:#fff;padding:4px 50px;border-radius:6px;font-weight:bold;display:inline-block;">🚧   WORK IN PROGRESS</span>', link: '/it/' },
          { text: 'Home', link: `/it/` },
          { text: 'KIMU', link: `/it/concepts/` },
          { text: 'Guida', link: `/it/guide/` },
          { text: 'Framework', link: `/it/framework/` },
          { text: 'Esempi', link: `/it/examples/` }
        ],
        sidebar: [
          {
            text: 'Concetti',
            collapsed: true,
            items: [
              { text: 'Introduzione', link: `/it/concepts/introduction` },
              { text: 'Filosofia', link: `/it/concepts/philosophy` },
              { text: 'Manifesto', link: `/it/concepts/manifest` },
              { text: 'Visione & Missione', link: `/it/concepts/vision-mission` },
              { text: 'Perché KIMU?', link: `/it/concepts/why-kimu` },
              { text: 'Casi d\'uso', link: `/it/concepts/use-cases` },
              { text: 'Storia', link: `/it/concepts/history` },
              { text: 'Crediti', link: `/it/concepts/credits` },
              { text: 'Contribuire', link: `/it/concepts/contributing` },
              { text: 'KIMU vs Altri Framework', link: `/it/concepts/kimu-vs-others` },
              { text: 'Roadmap', link: `/it/concepts/roadmap` },
              { text: 'FAQ', link: `/it/concepts/faq` }
            ]
          },
          {
            text: 'Guida',
            collapsed: true,
            items: [
              { text: 'Introduzione', link: `/it/guide/introduction` },
              { text: 'Inizia subito', link: `/it/guide/get-started` },
              { text: 'Architettura', link: `/it/guide/architecture` },
              { text: 'Configurazione', link: `/it/guide/configuration` },
              { text: 'Best Practices', link: `/it/guide/best-practices` },
              { text: 'Ciclo di vita', link: `/it/guide/lifecycle` },
              {
                text: 'Estensioni',
                collapsed: false,
                items: [
                  { text: 'Panoramica', link: `/it/guide/extensions/` },
                  { text: 'Inizia Subito', link: `/it/guide/extensions/getting-started` },
                  { text: 'Anatomia', link: `/it/guide/extensions/anatomy` },
                  { text: 'Pattern di Sviluppo', link: `/it/guide/extensions/patterns` },
                  { text: 'Comunicazione', link: `/it/guide/extensions/communication` },
                  { text: 'Template Avanzati', link: `/it/guide/extensions/templates` },
                  { text: 'Ciclo di Vita', link: `/it/guide/extensions/lifecycle` },
                  { text: 'Best Practices', link: `/it/guide/extensions/best-practices` }
                ]
              },
              { text: 'Moduli', link: `/it/guide/modules` },
              { text: 'Helper', link: `/it/guide/helpers` },
              { text: 'API', link: `/it/guide/api` },
              { text: 'Community', link: `/it/guide/community` },
              { text: 'FAQ Tecniche', link: `/it/guide/faq` },
              { text: 'Prossimi passi', link: `/it/guide/next-steps` }
            ]
          },
          {
            text: 'Framework',
            collapsed: true,
            items: [
              { text: 'Panoramica', link: `/it/framework/` },
              {
                text: 'Classi Core',
                collapsed: true,
                items: [
                  { text: 'KimuApp', link: `/it/framework/core/kimu-app` },
                  { text: 'KimuEngine', link: `/it/framework/core/kimu-engine` },
                  { text: 'KimuRender', link: `/it/framework/core/kimu-render` },
                  { text: 'KimuStore', link: `/it/framework/core/kimu-store` },
                  { text: 'KimuAssetManager', link: `/it/framework/core/kimu-asset-manager` },
                  { text: 'KimuExtensionManager', link: `/it/framework/core/kimu-extension-manager` },
                  { text: 'KimuComponentElement', link: `/it/framework/core/kimu-component-element` }
                ]
              },
              {
                text: 'Decorator',
                collapsed: true,
                items: [
                  { text: '@KimuComponent', link: `/it/framework/decorators/kimu-component` }
                ]
              },
              {
                text: 'Tipi',
                collapsed: true,
                items: [
                  { text: 'KimuExtensionMeta', link: `/it/framework/types/kimu-extension-meta` },
                  { text: 'KimuAsset', link: `/it/framework/types/kimu-asset` },
                  { text: 'KimuLang', link: `/it/framework/types/kimu-lang` }
                ]
              },
              {
                text: 'Estensioni',
                collapsed: true,
                items: [
                  { text: 'Panoramica', link: `/it/framework/extensions/index` },
                  { text: 'Creare Estensioni', link: `/it/framework/extensions/creating-extensions` },
                  { text: 'Ciclo di Vita', link: `/it/framework/extensions/extension-lifecycle` },
                  { text: 'Manifest Estensioni', link: `/it/framework/extensions/extension-manifest` },
                  { text: 'Build e Deploy', link: `/it/framework/extensions/build-deployment` },
                  { text: 'Best Practices', link: `/it/framework/extensions/best-practices` }
                ]
              },
              {
                text: 'Pattern',
                collapsed: true,
                items: [
                  { text: 'Panoramica', link: `/it/framework/patterns/index` },
                  { text: 'Singleton Pattern', link: `/it/framework/patterns/singleton-pattern` },
                  { text: 'Observer Pattern', link: `/it/framework/patterns/observer-pattern` },
                  { text: 'Asset Loading', link: `/it/framework/patterns/asset-loading` }
                ]
              }
            ]
          },
          {
            text: 'Esempi',
            collapsed: true,
            items: [
              { text: 'Panoramica', link: `/it/examples/index` },
              { text: 'Esempi Markdown', link: `/it/examples/markdown-examples` },
              { text: 'Esempi API', link: `/it/examples/api-examples` }
            ]
          }
        ]
      }
    }
  },

  themeConfig: {

    // Opzionale: cerca locale o DocSearch
    search: { provider: 'local' },

    // Logo
    logo: {
      light: '/images/icon.svg',
      dark: '/images/icon.svg',
      alt: 'Kimu'
    },

    // Last updated
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    // Edit link
    editLink: {
      pattern: 'https://github.com/unicoverso/kimu/edit/main/:path',
      text: 'Suggest changes to this page'
    },

    // Link social
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

    // Footer
    footer: {
      message: 'Released under Creative Commons Attribution 4.0 International (CC BY 4.0)',
      copyright: "Copyright © 2025 - Marco (Hocram) Di Pasquale - UnicòVerso | <a href='https://unicoverso.com/kimu' target='_blank'>unicoverso.com/kimu</a>"
    }
  }

})
