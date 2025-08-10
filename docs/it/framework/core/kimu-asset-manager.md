# KimuAssetManager

Gestore centralizzato per il caricamento e l'iniezione di asset (CSS, JS, HTML) nel framework KIMU.

## Descrizione

`KimuAssetManager` fornisce utilità per gestire asset e risorse esterne, con particolare attenzione a:

- **Caricamento file**: Fetch di file CSS, HTML, JS dal server
- **Injection nel DOM**: Inserimento di stili e script in Shadow DOM o Document
- **Prevenzione duplicati**: Evita caricamenti multipli dello stesso asset
- **Gestione errori**: Handling robusto di asset non trovati

**Tutti i metodi sono statici**, rendendo la classe un'utility globale per asset management.

## Utilizzo

### Caricamento File

```typescript
import { KimuAssetManager } from './core/kimu-asset-manager';

// Carica file di testo
const cssContent = await KimuAssetManager.fetchFile('assets/theme.css');
const htmlTemplate = await KimuAssetManager.fetchFile('templates/card.html');
const configData = await KimuAssetManager.fetchFile('config/settings.json');
```

### Injection di Stili

```typescript
// Inietta CSS in Shadow DOM di un componente
await KimuAssetManager.injectStyle(
    this,                    // Componente target
    'assets/component.css',  // Path CSS
    'component-style'        // ID univoco
);

// Injection condizionale
if (needsTheme) {
    await KimuAssetManager.injectStyle(this, 'themes/dark.css', 'dark-theme');
}
```

### Injection di Script

```typescript
// Inietta script esterno
KimuAssetManager.injectExternalScript(
    document,                           // Target (document o componente)
    'https://cdn.example.com/lib.js',  // URL script
    'external-lib'                      // ID univoco
);
```

### Link Esterni

```typescript
// Inietta link CSS esterno
KimuAssetManager.injectExternalLink(
    this,                                    // Componente
    'https://fonts.googleapis.com/css2...',  // URL CSS
    'google-fonts'                           // ID
);
```

## API

### Caricamento File

#### `fetchFile(path): Promise<string | null>`

Carica un file di testo dal server.

**Parametri:**
- `path: string` - Path del file (relativo al server root)

**Ritorna:** `Promise<string | null>` - Contenuto del file o `null` se non trovato

**Caratteristiche:**
- Aggiunge automaticamente `?raw` per bypass cache
- Normalizza path (aggiunge `/` iniziale se mancante)
- Gestisce errori 404 gracefully

**Esempio:**
```typescript
// Caricamento CSS
const cssContent = await KimuAssetManager.fetchFile('assets/styles.css');
if (cssContent) {
    console.log('CSS caricato:', cssContent.length, 'caratteri');
} else {
    console.warn('CSS non trovato');
}

// Caricamento configurazione JSON
const configText = await KimuAssetManager.fetchFile('config/app.json');
if (configText) {
    const config = JSON.parse(configText);
    console.log('Configurazione:', config);
}

// Caricamento template HTML
const template = await KimuAssetManager.fetchFile('templates/user-card.html');
```

### Injection Stili

#### `injectStyle(component, stylePath, styleId): Promise<void>`

Inietta un file CSS nel Shadow DOM di un componente.

**Parametri:**
- `component: HTMLElement` - Componente target con Shadow DOM
- `stylePath: string` - Path al file CSS
- `styleId: string | null` - ID univoco per l'elemento `<style>`

**Comportamento:**
- Verifica presenza Shadow DOM
- Previene injection duplicate (stesso ID)
- Carica file CSS via `fetchFile()`
- Crea elemento `<style>` con contenuto

**Esempio:**
```typescript
// Injection base
await KimuAssetManager.injectStyle(this, 'assets/component.css', 'comp-style');

// Injection condizionale con gestione errori
try {
    await KimuAssetManager.injectStyle(this, 'themes/user-theme.css', 'user-theme');
    console.log('✅ Tema utente applicato');
} catch (error) {
    console.warn('⚠️ Tema utente non disponibile, uso default');
    await KimuAssetManager.injectStyle(this, 'themes/default.css', 'default-theme');
}

// Injection multipla per temi
const themes = ['base.css', 'colors.css', 'typography.css'];
for (const [index, theme] of themes.entries()) {
    await KimuAssetManager.injectStyle(this, `themes/${theme}`, `theme-${index}`);
}
```

### Asset Esterni

#### `injectExternalLink(component, href, id): void`

Inietta un link CSS esterno nel Shadow DOM.

**Parametri:**
- `component: HTMLElement` - Componente target
- `href: string` - URL del CSS esterno
- `id: string` - ID univoco per l'elemento

**Esempio:**
```typescript
// Font esterni
KimuAssetManager.injectExternalLink(
    this,
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'google-fonts-inter'
);

// CSS framework esterno
KimuAssetManager.injectExternalLink(
    this,
    'https://unpkg.com/normalize.css@8.0.1/normalize.css',
    'normalize-css'
);
```

#### `injectExternalScript(target, src, id): void`

Inietta un script esterno nel target specificato.

**Parametri:**
- `target: HTMLElement | Document` - Target per l'injection
- `src: string` - URL dello script
- `id: string` - ID univoco

**Esempio:**
```typescript
// Libreria esterna globale
KimuAssetManager.injectExternalScript(
    document,
    'https://unpkg.com/lodash@4.17.21/lodash.min.js',
    'lodash-lib'
);

// Script specifico per componente
KimuAssetManager.injectExternalScript(
    this,
    'https://cdn.jsdelivr.net/npm/chart.js',
    'chart-js'
);
```

## Esempi Avanzati

### Asset Loader con Cache

```typescript
class CachedAssetLoader {
    private static cache = new Map<string, string>();
    private static loading = new Map<string, Promise<string | null>>();
    
    static async loadWithCache(path: string): Promise<string | null> {
        // Verifica cache
        if (this.cache.has(path)) {
            return this.cache.get(path)!;
        }
        
        // Verifica se già in caricamento
        if (this.loading.has(path)) {
            return this.loading.get(path)!;
        }
        
        // Avvia caricamento
        const loadPromise = KimuAssetManager.fetchFile(path);
        this.loading.set(path, loadPromise);
        
        try {
            const content = await loadPromise;
            if (content) {
                this.cache.set(path, content);
            }
            return content;
        } finally {
            this.loading.delete(path);
        }
    }
    
    static clearCache(): void {
        this.cache.clear();
    }
    
    static getCacheStats(): { size: number; paths: string[] } {
        return {
            size: this.cache.size,
            paths: Array.from(this.cache.keys())
        };
    }
}

// Uso
const css = await CachedAssetLoader.loadWithCache('assets/heavy-styles.css');
console.log('Cache stats:', CachedAssetLoader.getCacheStats());
```

### Theme Manager

```typescript
class ThemeManager {
    private static currentTheme = 'default';
    private static availableThemes = ['default', 'dark', 'blue', 'green'];
    
    static async applyTheme(component: HTMLElement, themeName: string): Promise<void> {
        if (!this.availableThemes.includes(themeName)) {
            console.warn(`Tema '${themeName}' non disponibile`);
            return;
        }
        
        // Rimuovi tema precedente
        const oldThemeElement = component.shadowRoot?.getElementById('current-theme');
        if (oldThemeElement) {
            oldThemeElement.remove();
        }
        
        // Applica nuovo tema
        await KimuAssetManager.injectStyle(
            component,
            `themes/${themeName}.css`,
            'current-theme'
        );
        
        this.currentTheme = themeName;
        console.log(`✅ Tema '${themeName}' applicato`);
    }
    
    static async loadAllThemes(component: HTMLElement): Promise<void> {
        console.log('🎨 Precaricamento temi...');
        
        for (const theme of this.availableThemes) {
            try {
                await KimuAssetManager.injectStyle(
                    component,
                    `themes/${theme}.css`,
                    `theme-${theme}`
                );
                
                // Disabilita tutti tranne il default
                const themeElement = component.shadowRoot?.getElementById(`theme-${theme}`);
                if (themeElement && theme !== 'default') {
                    (themeElement as HTMLStyleElement).disabled = true;
                }
            } catch (error) {
                console.warn(`Errore caricamento tema ${theme}:`, error);
            }
        }
        
        console.log('✅ Temi precaricati');
    }
    
    static switchTheme(component: HTMLElement, newTheme: string): void {
        // Disabilita tutti i temi
        this.availableThemes.forEach(theme => {
            const element = component.shadowRoot?.getElementById(`theme-${theme}`);
            if (element) {
                (element as HTMLStyleElement).disabled = true;
            }
        });
        
        // Abilita tema selezionato
        const targetElement = component.shadowRoot?.getElementById(`theme-${newTheme}`);
        if (targetElement) {
            (targetElement as HTMLStyleElement).disabled = false;
            this.currentTheme = newTheme;
            console.log(`🎨 Switched to theme: ${newTheme}`);
        }
    }
    
    static getCurrentTheme(): string {
        return this.currentTheme;
    }
}

// Uso
await ThemeManager.loadAllThemes(this);
ThemeManager.switchTheme(this, 'dark');
```

### Asset Bundle Loader

```typescript
class AssetBundleLoader {
    static async loadBundle(component: HTMLElement, bundleName: string): Promise<void> {
        const bundles = {
            'ui-kit': {
                styles: ['ui/base.css', 'ui/components.css', 'ui/utilities.css'],
                scripts: ['https://unpkg.com/ui-kit@1.0.0/dist/ui-kit.js']
            },
            'charts': {
                styles: ['charts/chart-base.css', 'charts/themes.css'],
                scripts: ['https://cdn.jsdelivr.net/npm/chart.js']
            },
            'forms': {
                styles: ['forms/inputs.css', 'forms/validation.css'],
                scripts: []
            }
        };
        
        const bundle = bundles[bundleName];
        if (!bundle) {
            throw new Error(`Bundle '${bundleName}' non trovato`);
        }
        
        console.log(`📦 Caricamento bundle: ${bundleName}`);
        
        // Carica stili
        for (const [index, stylePath] of bundle.styles.entries()) {
            await KimuAssetManager.injectStyle(
                component,
                stylePath,
                `${bundleName}-style-${index}`
            );
        }
        
        // Carica script
        for (const [index, scriptSrc] of bundle.scripts.entries()) {
            KimuAssetManager.injectExternalScript(
                component,
                scriptSrc,
                `${bundleName}-script-${index}`
            );
        }
        
        console.log(`✅ Bundle '${bundleName}' caricato`);
    }
}

// Uso
await AssetBundleLoader.loadBundle(this, 'ui-kit');
await AssetBundleLoader.loadBundle(this, 'charts');
```

### Asset Dependency Resolver

```typescript
class AssetDependencyResolver {
    private static dependencies = new Map<string, string[]>();
    private static loaded = new Set<string>();
    
    static defineDependencies(asset: string, deps: string[]): void {
        this.dependencies.set(asset, deps);
    }
    
    static async loadWithDependencies(
        component: HTMLElement,
        assetPath: string
    ): Promise<void> {
        const deps = this.dependencies.get(assetPath) || [];
        
        // Carica dipendenze prima
        for (const dep of deps) {
            if (!this.loaded.has(dep)) {
                console.log(`📋 Caricamento dipendenza: ${dep}`);
                await KimuAssetManager.injectStyle(component, dep, `dep-${dep.replace(/[^a-z0-9]/gi, '-')}`);
                this.loaded.add(dep);
            }
        }
        
        // Carica asset principale
        if (!this.loaded.has(assetPath)) {
            console.log(`📋 Caricamento asset: ${assetPath}`);
            await KimuAssetManager.injectStyle(component, assetPath, `main-${assetPath.replace(/[^a-z0-9]/gi, '-')}`);
            this.loaded.add(assetPath);
        }
    }
    
    static setupDependencies(): void {
        // Definisci dipendenze
        this.defineDependencies('components/button.css', ['base/reset.css', 'base/typography.css']);
        this.defineDependencies('components/modal.css', ['base/reset.css', 'components/overlay.css']);
        this.defineDependencies('components/form.css', ['base/reset.css', 'components/input.css']);
    }
}

// Setup
AssetDependencyResolver.setupDependencies();

// Uso
await AssetDependencyResolver.loadWithDependencies(this, 'components/button.css');
```

### Progressive Asset Loading

```typescript
class ProgressiveAssetLoader {
    static async loadProgressively(
        component: HTMLElement,
        assets: Array<{ path: string; priority: 'critical' | 'high' | 'low' }>
    ): Promise<void> {
        // Raggruppa per priorità
        const critical = assets.filter(a => a.priority === 'critical');
        const high = assets.filter(a => a.priority === 'high');
        const low = assets.filter(a => a.priority === 'low');
        
        // Carica assets critici (blocca)
        console.log('🔥 Caricamento assets critici...');
        for (const asset of critical) {
            await KimuAssetManager.injectStyle(component, asset.path, `critical-${Date.now()}`);
        }
        
        // Carica assets alta priorità (asincrono)
        console.log('⚡ Caricamento assets alta priorità...');
        Promise.all(
            high.map(asset =>
                KimuAssetManager.injectStyle(component, asset.path, `high-${Date.now()}`)
            )
        );
        
        // Carica assets bassa priorità (lazy)
        setTimeout(async () => {
            console.log('🐌 Caricamento assets bassa priorità...');
            for (const asset of low) {
                await KimuAssetManager.injectStyle(component, asset.path, `low-${Date.now()}`);
            }
        }, 100);
    }
}

// Uso
await ProgressiveAssetLoader.loadProgressively(this, [
    { path: 'base/critical.css', priority: 'critical' },
    { path: 'components/main.css', priority: 'high' },
    { path: 'animations/effects.css', priority: 'low' }
]);
```

## Best Practices

### ✅ Gestione Errori

```typescript
async function safeInjectStyle(component: HTMLElement, path: string, id: string): Promise<boolean> {
    try {
        await KimuAssetManager.injectStyle(component, path, id);
        return true;
    } catch (error) {
        console.warn(`Errore caricamento ${path}:`, error);
        
        // Fallback style
        await KimuAssetManager.injectStyle(component, 'assets/fallback.css', `${id}-fallback`);
        return false;
    }
}
```

### ✅ Prevenzione Memory Leak

```typescript
class AssetCleanup {
    private static injectedAssets = new WeakMap<HTMLElement, Set<string>>();
    
    static trackAsset(component: HTMLElement, assetId: string): void {
        if (!this.injectedAssets.has(component)) {
            this.injectedAssets.set(component, new Set());
        }
        this.injectedAssets.get(component)!.add(assetId);
    }
    
    static cleanup(component: HTMLElement): void {
        const assets = this.injectedAssets.get(component);
        if (assets) {
            assets.forEach(id => {
                const element = component.shadowRoot?.getElementById(id);
                element?.remove();
            });
            this.injectedAssets.delete(component);
        }
    }
}
```

### ✅ Performance Monitoring

```typescript
async function monitoredInjectStyle(component: HTMLElement, path: string, id: string): Promise<void> {
    const start = performance.now();
    
    await KimuAssetManager.injectStyle(component, path, id);
    
    const end = performance.now();
    const loadTime = end - start;
    
    if (loadTime > 100) {
        console.warn(`⚠️ Slow asset loading: ${path} (${loadTime.toFixed(2)}ms)`);
    }
}
```

## Vedi Anche

- **[KimuEngine](./kimu-engine.md)** - Motore di rendering che usa AssetManager
- **[KimuComponentElement](./kimu-component-element.md)** - Componenti che caricano asset
- **[Asset Loading](../patterns/asset-loading.md)** - Pattern di caricamento
- **[Performance](../patterns/performance.md)** - Ottimizzazione asset
