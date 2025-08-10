# KimuAsset

Tipi TypeScript per la definizione e gestione di asset (CSS, JS) nel framework KIMU.

## Descrizione

I tipi `KimuAsset` definiscono la struttura per gestire asset esterni e risorse che devono essere caricate dinamicamente nelle estensioni KIMU. Forniscono:

- **Tipizzazione forte**: Definizione precisa di asset e gruppi di asset
- **Metadati asset**: Path, ID, configurazioni per ogni risorsa
- **Gestione gruppi**: Organizzazione logica di CSS e JS correlati
- **Caricamento automatico**: Integrazione con `KimuAssetManager`

## Definizioni dei Tipi

### KimuAsset

Definisce un singolo asset da caricare.

```typescript
type KimuAsset = {
  path: string;       // Path o URL dell'asset
  id?: string;        // ID univoco per l'elemento DOM (opzionale)
};
```

### KimuGroupAsset

Definisce un gruppo di asset esterni organizzati per tipo.

```typescript
type KimuGroupAsset = {
  css?: KimuAsset[];  // Array di asset CSS
  js?: KimuAsset[];   // Array di asset JavaScript
};
```

## Utilizzo

### Asset Singoli

```typescript
// Asset CSS
const themeAsset: KimuAsset = {
  path: "https://cdn.example.com/theme.css",
  id: "external-theme"
};

// Asset JavaScript
const libraryAsset: KimuAsset = {
  path: "https://unpkg.com/lodash@4.17.21/lodash.min.js",
  id: "lodash-lib"
};

// Asset locale
const localStyle: KimuAsset = {
  path: "assets/custom-styles.css",
  id: "custom-styles"
};
```

### Gruppi di Asset

```typescript
// Gruppo completo per un'estensione
const uiKitAssets: KimuGroupAsset = {
  css: [
    {
      path: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
      id: "bootstrap-css"
    },
    {
      path: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css", 
      id: "fontawesome-css"
    }
  ],
  js: [
    {
      path: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
      id: "bootstrap-js"
    }
  ]
};

// Gruppo solo CSS
const stylesOnly: KimuGroupAsset = {
  css: [
    { path: "themes/dark.css", id: "dark-theme" },
    { path: "themes/animations.css", id: "animations" }
  ]
};

// Gruppo solo JavaScript
const scriptsOnly: KimuGroupAsset = {
  js: [
    { path: "https://cdn.plot.ly/plotly-latest.min.js", id: "plotly" },
    { path: "https://d3js.org/d3.v7.min.js", id: "d3" }
  ]
};
```

## Integrazione con Estensioni

### In Metadata Estensione

```typescript
import { KimuExtensionMeta, KimuGroupAsset } from './core/kimu-types';

const chartExtension: KimuExtensionMeta = {
  tag: "data-chart",
  name: "Data Chart Component",
  version: "1.0.0",
  external: {
    css: [
      {
        path: "https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.css",
        id: "chartjs-css"
      }
    ],
    js: [
      {
        path: "https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js", 
        id: "chartjs-lib"
      }
    ]
  } as KimuGroupAsset
};
```

### Con @KimuComponent Decorator

```typescript
@KimuComponent({
  tag: "rich-editor",
  name: "Rich Text Editor",
  external: {
    css: [
      { path: "https://cdn.quilljs.com/1.3.6/quill.snow.css", id: "quill-theme" },
      { path: "https://cdn.quilljs.com/1.3.6/quill.bubble.css", id: "quill-bubble" }
    ],
    js: [
      { path: "https://cdn.quilljs.com/1.3.6/quill.min.js", id: "quill-lib" }
    ]
  }
})
export class RichEditor extends KimuComponentElement {
  onInit(): void {
    // Quill è disponibile automaticamente
    const editor = new (window as any).Quill(this.$('.editor'), {
      theme: 'snow'
    });
  }
}
```

## Esempi Avanzati

### Asset Configuration Manager

```typescript
class AssetConfigManager {
  private static configurations = new Map<string, KimuGroupAsset>();
  
  static registerAssetGroup(name: string, assets: KimuGroupAsset): void {
    this.configurations.set(name, assets);
  }
  
  static getAssetGroup(name: string): KimuGroupAsset | undefined {
    return this.configurations.get(name);
  }
  
  static setupCommonAssets(): void {
    // Configurazione UI Framework
    this.registerAssetGroup('bootstrap', {
      css: [
        {
          path: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
          id: "bootstrap-css"
        }
      ],
      js: [
        {
          path: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
          id: "bootstrap-js"
        }
      ]
    });
    
    // Configurazione Chart Library
    this.registerAssetGroup('charts', {
      css: [
        { path: "https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.css", id: "chart-css" }
      ],
      js: [
        { path: "https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js", id: "chart-js" }
      ]
    });
    
    // Configurazione Icon Library
    this.registerAssetGroup('icons', {
      css: [
        {
          path: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css",
          id: "fontawesome"
        },
        {
          path: "https://fonts.googleapis.com/icon?family=Material+Icons",
          id: "material-icons"
        }
      ]
    });
  }
}

// Setup
AssetConfigManager.setupCommonAssets();

// Uso in estensioni
const chartAssets = AssetConfigManager.getAssetGroup('charts');
```

### Dynamic Asset Builder

```typescript
class DynamicAssetBuilder {
  static buildCDNAsset(library: string, version: string, type: 'css' | 'js'): KimuAsset {
    const cdnMap = {
      'bootstrap': {
        css: `https://cdn.jsdelivr.net/npm/bootstrap@${version}/dist/css/bootstrap.min.css`,
        js: `https://cdn.jsdelivr.net/npm/bootstrap@${version}/dist/js/bootstrap.bundle.min.js`
      },
      'jquery': {
        js: `https://code.jquery.com/jquery-${version}.min.js`
      },
      'lodash': {
        js: `https://cdn.jsdelivr.net/npm/lodash@${version}/lodash.min.js`
      }
    };
    
    const path = cdnMap[library]?.[type];
    if (!path) {
      throw new Error(`Asset ${library} ${type} v${version} non supportato`);
    }
    
    return {
      path,
      id: `${library}-${type}-${version.replace(/\./g, '-')}`
    };
  }
  
  static buildAssetGroup(config: Array<{library: string, version: string, types: ('css'|'js')[]}>): KimuGroupAsset {
    const result: KimuGroupAsset = { css: [], js: [] };
    
    for (const { library, version, types } of config) {
      for (const type of types) {
        try {
          const asset = this.buildCDNAsset(library, version, type);
          result[type]!.push(asset);
        } catch (error) {
          console.warn(`Errore building asset ${library} ${type}:`, error);
        }
      }
    }
    
    return result;
  }
}

// Uso
const dynamicAssets = DynamicAssetBuilder.buildAssetGroup([
  { library: 'bootstrap', version: '5.3.0', types: ['css', 'js'] },
  { library: 'jquery', version: '3.6.0', types: ['js'] },
  { library: 'lodash', version: '4.17.21', types: ['js'] }
]);

console.log('Asset dinamici generati:', dynamicAssets);
```

### Asset Validator

```typescript
class AssetValidator {
  static validateAsset(asset: KimuAsset): boolean {
    // Verifica path
    if (!asset.path || typeof asset.path !== 'string') {
      console.error('Asset path obbligatorio e deve essere stringa');
      return false;
    }
    
    // Verifica URL valido o path relativo
    try {
      if (asset.path.startsWith('http')) {
        new URL(asset.path); // Valida URL
      } else if (!asset.path.match(/^[a-zA-Z0-9\/\-_.]+$/)) {
        throw new Error('Path relativo non valido');
      }
    } catch (error) {
      console.error('Asset path non valido:', asset.path, error);
      return false;
    }
    
    // Verifica ID se presente
    if (asset.id && !/^[a-zA-Z][a-zA-Z0-9\-_]*$/.test(asset.id)) {
      console.error('Asset ID non valido:', asset.id);
      return false;
    }
    
    return true;
  }
  
  static validateAssetGroup(group: KimuGroupAsset): boolean {
    let valid = true;
    
    // Valida CSS assets
    if (group.css) {
      for (const [index, cssAsset] of group.css.entries()) {
        if (!this.validateAsset(cssAsset)) {
          console.error(`CSS asset ${index} non valido:`, cssAsset);
          valid = false;
        }
      }
    }
    
    // Valida JS assets
    if (group.js) {
      for (const [index, jsAsset] of group.js.entries()) {
        if (!this.validateAsset(jsAsset)) {
          console.error(`JS asset ${index} non valido:`, jsAsset);
          valid = false;
        }
      }
    }
    
    return valid;
  }
  
  static sanitizeAsset(asset: KimuAsset): KimuAsset {
    return {
      path: asset.path.trim(),
      id: asset.id ? asset.id.replace(/[^a-zA-Z0-9\-_]/g, '') : undefined
    };
  }
}

// Uso
const asset: KimuAsset = {
  path: "https://cdn.example.com/library.js  ",
  id: "invalid@id!"
};

console.log('Valido:', AssetValidator.validateAsset(asset));
const sanitized = AssetValidator.sanitizeAsset(asset);
console.log('Sanitizzato:', sanitized);
```

### Asset Loading Strategy

```typescript
class AssetLoadingStrategy {
  static async loadAssetGroup(
    component: HTMLElement, 
    assets: KimuGroupAsset,
    strategy: 'sequential' | 'parallel' | 'critical-first' = 'parallel'
  ): Promise<void> {
    switch (strategy) {
      case 'sequential':
        await this.loadSequential(component, assets);
        break;
      case 'parallel': 
        await this.loadParallel(component, assets);
        break;
      case 'critical-first':
        await this.loadCriticalFirst(component, assets);
        break;
    }
  }
  
  private static async loadSequential(component: HTMLElement, assets: KimuGroupAsset): Promise<void> {
    // Carica CSS prima, poi JS
    if (assets.css) {
      for (const cssAsset of assets.css) {
        await KimuAssetManager.injectStyle(component, cssAsset.path, cssAsset.id);
      }
    }
    
    if (assets.js) {
      for (const jsAsset of assets.js) {
        await this.loadScript(component, jsAsset);
      }
    }
  }
  
  private static async loadParallel(component: HTMLElement, assets: KimuGroupAsset): Promise<void> {
    const promises: Promise<any>[] = [];
    
    // Carica CSS in parallelo
    if (assets.css) {
      promises.push(...assets.css.map(css => 
        KimuAssetManager.injectStyle(component, css.path, css.id)
      ));
    }
    
    // Carica JS in parallelo
    if (assets.js) {
      promises.push(...assets.js.map(js => this.loadScript(component, js)));
    }
    
    await Promise.all(promises);
  }
  
  private static async loadCriticalFirst(component: HTMLElement, assets: KimuGroupAsset): Promise<void> {
    // Identifica asset critici (esempi di logica)
    const criticalCSS = assets.css?.filter(css => css.path.includes('critical') || css.id?.includes('critical')) || [];
    const criticalJS = assets.js?.filter(js => js.path.includes('critical') || js.id?.includes('critical')) || [];
    
    // Carica critici prima
    await Promise.all([
      ...criticalCSS.map(css => KimuAssetManager.injectStyle(component, css.path, css.id)),
      ...criticalJS.map(js => this.loadScript(component, js))
    ]);
    
    // Carica il resto
    const remainingCSS = assets.css?.filter(css => !criticalCSS.includes(css)) || [];
    const remainingJS = assets.js?.filter(js => !criticalJS.includes(js)) || [];
    
    await Promise.all([
      ...remainingCSS.map(css => KimuAssetManager.injectStyle(component, css.path, css.id)),
      ...remainingJS.map(js => this.loadScript(component, js))
    ]);
  }
  
  private static async loadScript(component: HTMLElement, asset: KimuAsset): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = asset.path;
      if (asset.id) script.id = asset.id;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Errore caricamento script: ${asset.path}`));
      
      (component.shadowRoot || document.head).appendChild(script);
    });
  }
}

// Uso
const extensionAssets: KimuGroupAsset = {
  css: [
    { path: "critical-styles.css", id: "critical-css" },
    { path: "theme.css", id: "theme" }
  ],
  js: [
    { path: "https://cdn.example.com/critical-lib.js", id: "critical-lib" },
    { path: "utils.js", id: "utils" }
  ]
};

await AssetLoadingStrategy.loadAssetGroup(this, extensionAssets, 'critical-first');
```

## Pattern di Utilizzo

### ✅ Asset Esterni CDN

```typescript
const cdnAssets: KimuGroupAsset = {
  css: [
    {
      path: "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css",
      id: "tailwind-css"
    }
  ],
  js: [
    {
      path: "https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js",
      id: "alpine-js"
    }
  ]
};
```

### ✅ Asset Locali

```typescript
const localAssets: KimuGroupAsset = {
  css: [
    { path: "assets/component-styles.css", id: "component-css" },
    { path: "themes/dark-mode.css", id: "dark-theme" }
  ],
  js: [
    { path: "utils/helpers.js", id: "helpers" }
  ]
};
```

### ✅ Naming Convention

```typescript
// ID descrittivi e consistenti
const assets: KimuGroupAsset = {
  css: [
    { path: "vendor/bootstrap.css", id: "bootstrap-css" },
    { path: "vendor/fontawesome.css", id: "fontawesome-css" }
  ],
  js: [
    { path: "vendor/jquery.js", id: "jquery-lib" },
    { path: "vendor/bootstrap.js", id: "bootstrap-js" }
  ]
};
```

## Best Practices

### ✅ Validazione Input

```typescript
function createAsset(path: string, id?: string): KimuAsset {
  if (!path || typeof path !== 'string') {
    throw new Error('Path asset obbligatorio');
  }
  
  return { path: path.trim(), id };
}
```

### ✅ Error Handling

```typescript
async function safeLoadAssets(component: HTMLElement, assets: KimuGroupAsset): Promise<void> {
  try {
    if (!AssetValidator.validateAssetGroup(assets)) {
      throw new Error('Asset group non valido');
    }
    
    await AssetLoadingStrategy.loadAssetGroup(component, assets);
  } catch (error) {
    console.error('Errore caricamento asset:', error);
    // Fallback o retry logic
  }
}
```

### ✅ Performance

```typescript
// Cache per asset già caricati
const loadedAssets = new Set<string>();

function shouldLoadAsset(asset: KimuAsset): boolean {
  const key = asset.id || asset.path;
  return !loadedAssets.has(key);
}
```

## Vedi Anche

- **[KimuAssetManager](../core/kimu-asset-manager.md)** - Gestore che usa questi tipi
- **[KimuExtensionMeta](./kimu-extension-meta.md)** - Metadata che include asset esterni
- **[Asset Loading](../patterns/asset-loading.md)** - Pattern di caricamento
- **[Performance](../patterns/performance.md)** - Ottimizzazione caricamento
