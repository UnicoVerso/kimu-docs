# KimuAsset

TypeScript types for defining and managing assets (CSS, JS) in the KIMU framework.

## Description

The `KimuAsset` types define the structure for managing external assets and resources that need to be dynamically loaded in KIMU extensions. They provide:

- **Strong typing**: Precise definition of assets and asset groups
- **Asset metadata**: Path, ID, configurations for each resource
- **Group management**: Logical organization of related CSS and JS
- **Automatic loading**: Integration with `KimuAssetManager`

## Type Definitions

### KimuAsset

Defines a single asset to load.

```typescript
type KimuAsset = {
  path: string;       // Asset path or URL
  id?: string;        // Unique ID for DOM element (optional)
};
```

### KimuGroupAsset

Defines a group of external assets organized by type.

```typescript
type KimuGroupAsset = {
  css?: KimuAsset[];  // Array of CSS assets
  js?: KimuAsset[];   // Array of JavaScript assets
};
```

## Usage

### Single Assets

```typescript
// CSS asset
const themeAsset: KimuAsset = {
  path: "https://cdn.example.com/theme.css",
  id: "external-theme"
};

// JavaScript asset
const libraryAsset: KimuAsset = {
  path: "https://unpkg.com/lodash@4.17.21/lodash.min.js",
  id: "lodash-lib"
};

// Local asset
const localStyle: KimuAsset = {
  path: "assets/custom-styles.css",
  id: "custom-styles"
};
```

### Asset Groups

```typescript
// Complete group for an extension
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

// CSS only group
const stylesOnly: KimuGroupAsset = {
  css: [
    { path: "themes/dark.css", id: "dark-theme" },
    { path: "themes/animations.css", id: "animations" }
  ]
};

// JavaScript only group
const scriptsOnly: KimuGroupAsset = {
  js: [
    { path: "https://cdn.plot.ly/plotly-latest.min.js", id: "plotly" },
    { path: "https://d3js.org/d3.v7.min.js", id: "d3" }
  ]
};
```

## Integration with Extensions

### In Extension Metadata

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

### With @KimuComponent Decorator

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
    // Quill is automatically available
    const editor = new (window as any).Quill(this.$('.editor'), {
      theme: 'snow'
    });
  }
}
```

## Advanced Examples

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
    // UI Framework configuration
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
    
    // Chart Library configuration
    this.registerAssetGroup('charts', {
      css: [
        { path: "https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.css", id: "chart-css" }
      ],
      js: [
        { path: "https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js", id: "chart-js" }
      ]
    });
    
    // Icon Library configuration
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

// Usage in extensions
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
      throw new Error(`Asset ${library} ${type} v${version} not supported`);
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
          console.warn(`Error building asset ${library} ${type}:`, error);
        }
      }
    }
    
    return result;
  }
}

// Usage
const dynamicAssets = DynamicAssetBuilder.buildAssetGroup([
  { library: 'bootstrap', version: '5.3.0', types: ['css', 'js'] },
  { library: 'jquery', version: '3.6.0', types: ['js'] },
  { library: 'lodash', version: '4.17.21', types: ['js'] }
]);

console.log('Generated dynamic assets:', dynamicAssets);
```

### Asset Validator

```typescript
class AssetValidator {
  static validateAsset(asset: KimuAsset): boolean {
    // Verify path
    if (!asset.path || typeof asset.path !== 'string') {
      console.error('Asset path required and must be string');
      return false;
    }
    
    // Verify valid URL or relative path
    try {
      if (asset.path.startsWith('http')) {
        new URL(asset.path); // Validate URL
      } else if (!asset.path.match(/^[a-zA-Z0-9\/\-_.]+$/)) {
        throw new Error('Invalid relative path');
      }
    } catch (error) {
      console.error('Invalid asset path:', asset.path, error);
      return false;
    }
    
    // Verify ID if present
    if (asset.id && !/^[a-zA-Z][a-zA-Z0-9\-_]*$/.test(asset.id)) {
      console.error('Invalid asset ID:', asset.id);
      return false;
    }
    
    return true;
  }
  
  static validateAssetGroup(group: KimuGroupAsset): boolean {
    let valid = true;
    
    // Validate CSS assets
    if (group.css) {
      for (const [index, cssAsset] of group.css.entries()) {
        if (!this.validateAsset(cssAsset)) {
          console.error(`CSS asset ${index} invalid:`, cssAsset);
          valid = false;
        }
      }
    }
    
    // Validate JS assets
    if (group.js) {
      for (const [index, jsAsset] of group.js.entries()) {
        if (!this.validateAsset(jsAsset)) {
          console.error(`JS asset ${index} invalid:`, jsAsset);
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

// Usage
const asset: KimuAsset = {
  path: "https://cdn.example.com/library.js  ",
  id: "invalid@id!"
};

console.log('Valid:', AssetValidator.validateAsset(asset));
const sanitized = AssetValidator.sanitizeAsset(asset);
console.log('Sanitized:', sanitized);
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
    // Load CSS first, then JS
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
    
    // Load CSS in parallel
    if (assets.css) {
      promises.push(...assets.css.map(css => 
        KimuAssetManager.injectStyle(component, css.path, css.id)
      ));
    }
    
    // Load JS in parallel
    if (assets.js) {
      promises.push(...assets.js.map(js => this.loadScript(component, js)));
    }
    
    await Promise.all(promises);
  }
  
  private static async loadCriticalFirst(component: HTMLElement, assets: KimuGroupAsset): Promise<void> {
    // Identify critical assets (example logic)
    const criticalCSS = assets.css?.filter(css => css.path.includes('critical') || css.id?.includes('critical')) || [];
    const criticalJS = assets.js?.filter(js => js.path.includes('critical') || js.id?.includes('critical')) || [];
    
    // Load critical first
    await Promise.all([
      ...criticalCSS.map(css => KimuAssetManager.injectStyle(component, css.path, css.id)),
      ...criticalJS.map(js => this.loadScript(component, js))
    ]);
    
    // Load the rest
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
      script.onerror = () => reject(new Error(`Error loading script: ${asset.path}`));
      
      (component.shadowRoot || document.head).appendChild(script);
    });
  }
}

// Usage
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

## Usage Patterns

### ✅ External CDN Assets

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

### ✅ Local Assets

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
// Descriptive and consistent IDs
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

### ✅ Input Validation

```typescript
function createAsset(path: string, id?: string): KimuAsset {
  if (!path || typeof path !== 'string') {
    throw new Error('Asset path required');
  }
  
  return { path: path.trim(), id };
}
```

### ✅ Error Handling

```typescript
async function safeLoadAssets(component: HTMLElement, assets: KimuGroupAsset): Promise<void> {
  try {
    if (!AssetValidator.validateAssetGroup(assets)) {
      throw new Error('Invalid asset group');
    }
    
    await AssetLoadingStrategy.loadAssetGroup(component, assets);
  } catch (error) {
    console.error('Error loading assets:', error);
    // Fallback or retry logic
  }
}
```

### ✅ Performance

```typescript
// Cache for already loaded assets
const loadedAssets = new Set<string>();

function shouldLoadAsset(asset: KimuAsset): boolean {
  const key = asset.id || asset.path;
  return !loadedAssets.has(key);
}
```

## See Also

- **[KimuAssetManager](../core/kimu-asset-manager.md)** - Manager that uses these types
- **[KimuExtensionMeta](./kimu-extension-meta.md)** - Metadata that includes external assets
- **[Asset Loading](../patterns/asset-loading.md)** - Loading patterns
- **[Performance](../patterns/performance.md)** - Loading optimization
