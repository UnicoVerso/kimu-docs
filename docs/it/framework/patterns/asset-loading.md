# Asset Loading Pattern

Il pattern Asset Loading gestisce il caricamento efficiente delle risorse (immagini, CSS, JavaScript, font, ecc.) in applicazioni modulari, ottimizzando performance e user experience.

## Problema

Nelle applicazioni moderne con molte estensioni, il caricamento degli asset presenta diverse sfide:

- **Performance**: Caricamento di asset non necessari rallenta l'applicazione
- **Dipendenze**: Asset possono dipendere da altri asset
- **Cache**: Necessità di evitare ricaricamenti inutili
- **Lazy Loading**: Caricare asset solo quando servono
- **Error Handling**: Gestire fallimenti nel caricamento
- **Progressive Loading**: Prioritizzare asset critici
- **Memory Management**: Evitare accumulo di asset non usati

## Soluzione

Il pattern Asset Loading implementa:

1. **Lazy Loading**: Caricamento on-demand
2. **Caching**: Cache intelligente degli asset
3. **Preloading**: Caricamento anticipato di asset critici
4. **Prioritization**: Gestione delle priorità di caricamento
5. **Error Recovery**: Gestione robusta degli errori
6. **Memory Management**: Pulizia automatica della memoria

## Implementazione in KIMU

### KimuAssetManager

```typescript
interface AssetConfig {
  path: string;
  type: 'image' | 'style' | 'script' | 'font' | 'data';
  priority?: number;
  preload?: boolean;
  cache?: boolean;
  retry?: number;
  timeout?: number;
}

interface LoadedAsset {
  url: string;
  type: string;
  size: number;
  loadTime: number;
  lastAccessed: number;
}

export class KimuAssetManager {
  private static instance: KimuAssetManager;
  private assetCache = new Map<string, LoadedAsset>();
  private loadingPromises = new Map<string, Promise<string>>();
  private preloadQueue: AssetConfig[] = [];
  private isPreloading = false;

  private constructor() {
    this.setupMemoryManagement();
  }

  public static getInstance(): KimuAssetManager {
    if (!KimuAssetManager.instance) {
      KimuAssetManager.instance = new KimuAssetManager();
    }
    return KimuAssetManager.instance;
  }

  /**
   * Carica un asset singolo
   */
  public async getAsset(path: string, config?: Partial<AssetConfig>): Promise<string> {
    const fullConfig: AssetConfig = {
      path,
      type: this.detectAssetType(path),
      priority: 0,
      cache: true,
      retry: 3,
      timeout: 10000,
      ...config
    };

    // Controlla cache
    if (fullConfig.cache && this.assetCache.has(path)) {
      const cached = this.assetCache.get(path)!;
      cached.lastAccessed = Date.now();
      return cached.url;
    }

    // Controlla se già in caricamento
    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path)!;
    }

    // Avvia nuovo caricamento
    const loadingPromise = this.loadAssetWithRetry(fullConfig);
    this.loadingPromises.set(path, loadingPromise);

    try {
      const url = await loadingPromise;
      this.loadingPromises.delete(path);
      return url;
    } catch (error) {
      this.loadingPromises.delete(path);
      throw error;
    }
  }

  /**
   * Caricamento con retry automatico
   */
  private async loadAssetWithRetry(config: AssetConfig): Promise<string> {
    let lastError: Error;

    for (let attempt = 1; attempt <= config.retry!; attempt++) {
      try {
        const startTime = Date.now();
        const url = await this.loadSingleAsset(config);
        const loadTime = Date.now() - startTime;

        // Salva in cache se richiesto
        if (config.cache) {
          this.assetCache.set(config.path, {
            url,
            type: config.type,
            size: await this.getAssetSize(url),
            loadTime,
            lastAccessed: Date.now()
          });
        }

        return url;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Asset loading attempt ${attempt}/${config.retry} failed for ${config.path}:`, error);
        
        if (attempt < config.retry!) {
          // Backoff esponenziale
          await this.delay(Math.pow(2, attempt - 1) * 1000);
        }
      }
    }

    throw new Error(`Failed to load asset ${config.path} after ${config.retry} attempts: ${lastError.message}`);
  }

  /**
   * Caricamento singolo asset
   */
  private async loadSingleAsset(config: AssetConfig): Promise<string> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Asset loading timeout: ${config.path}`));
      }, config.timeout);

      switch (config.type) {
        case 'image':
          this.loadImage(config.path, timeout, resolve, reject);
          break;
        case 'style':
          this.loadStylesheet(config.path, timeout, resolve, reject);
          break;
        case 'script':
          this.loadScript(config.path, timeout, resolve, reject);
          break;
        case 'font':
          this.loadFont(config.path, timeout, resolve, reject);
          break;
        case 'data':
          this.loadData(config.path, timeout, resolve, reject);
          break;
        default:
          this.loadGeneric(config.path, timeout, resolve, reject);
      }
    });
  }

  /**
   * Caricamento immagine
   */
  private loadImage(
    path: string, 
    timeout: NodeJS.Timeout,
    resolve: (url: string) => void,
    reject: (error: Error) => void
  ) {
    const img = new Image();
    
    img.onload = () => {
      clearTimeout(timeout);
      
      // Crea object URL per gestione memoria
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(blob => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          reject(new Error('Failed to create blob from image'));
        }
      });
    };

    img.onerror = () => {
      clearTimeout(timeout);
      reject(new Error(`Failed to load image: ${path}`));
    };

    img.src = this.resolveAssetPath(path);
  }

  /**
   * Caricamento stylesheet
   */
  private loadStylesheet(
    path: string,
    timeout: NodeJS.Timeout,
    resolve: (url: string) => void,
    reject: (error: Error) => void
  ) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';

    link.onload = () => {
      clearTimeout(timeout);
      resolve(link.href);
    };

    link.onerror = () => {
      clearTimeout(timeout);
      reject(new Error(`Failed to load stylesheet: ${path}`));
    };

    link.href = this.resolveAssetPath(path);
    document.head.appendChild(link);
  }

  /**
   * Caricamento script
   */
  private loadScript(
    path: string,
    timeout: NodeJS.Timeout,
    resolve: (url: string) => void,
    reject: (error: Error) => void
  ) {
    const script = document.createElement('script');
    script.type = 'module';

    script.onload = () => {
      clearTimeout(timeout);
      resolve(script.src);
    };

    script.onerror = () => {
      clearTimeout(timeout);
      reject(new Error(`Failed to load script: ${path}`));
    };

    script.src = this.resolveAssetPath(path);
    document.head.appendChild(script);
  }

  /**
   * Caricamento font
   */
  private async loadFont(
    path: string,
    timeout: NodeJS.Timeout,
    resolve: (url: string) => void,
    reject: (error: Error) => void
  ) {
    try {
      const fontFace = new FontFace('CustomFont', `url(${this.resolveAssetPath(path)})`);
      await fontFace.load();
      document.fonts.add(fontFace);
      
      clearTimeout(timeout);
      resolve(fontFace.family);
    } catch (error) {
      clearTimeout(timeout);
      reject(new Error(`Failed to load font: ${path}`));
    }
  }

  /**
   * Caricamento dati
   */
  private async loadData(
    path: string,
    timeout: NodeJS.Timeout,
    resolve: (url: string) => void,
    reject: (error: Error) => void
  ) {
    try {
      const response = await fetch(this.resolveAssetPath(path));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      clearTimeout(timeout);
      resolve(url);
    } catch (error) {
      clearTimeout(timeout);
      reject(new Error(`Failed to load data: ${path} - ${error.message}`));
    }
  }

  /**
   * Caricamento generico
   */
  private loadGeneric(
    path: string,
    timeout: NodeJS.Timeout,
    resolve: (url: string) => void,
    reject: (error: Error) => void
  ) {
    this.loadData(path, timeout, resolve, reject);
  }

  /**
   * Precaricamento di asset
   */
  public async preloadAssets(configs: AssetConfig[]): Promise<void> {
    // Ordina per priorità
    const sortedConfigs = configs.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    
    this.preloadQueue.push(...sortedConfigs);
    
    if (!this.isPreloading) {
      this.processPreloadQueue();
    }
  }

  /**
   * Processamento coda preload
   */
  private async processPreloadQueue(): Promise<void> {
    this.isPreloading = true;

    while (this.preloadQueue.length > 0) {
      const config = this.preloadQueue.shift()!;
      
      try {
        await this.getAsset(config.path, config);
        console.log(`Preloaded asset: ${config.path}`);
      } catch (error) {
        console.warn(`Failed to preload asset: ${config.path}`, error);
      }
    }

    this.isPreloading = false;
  }

  /**
   * Gestione memoria automatica
   */
  private setupMemoryManagement(): void {
    // Pulizia periodica della cache
    setInterval(() => {
      this.cleanupUnusedAssets();
    }, 5 * 60 * 1000); // Ogni 5 minuti

    // Pulizia alla chiusura della pagina
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // Pulizia quando la memoria è bassa
    if ('memory' in performance) {
      setInterval(() => {
        const memInfo = (performance as any).memory;
        if (memInfo.usedJSHeapSize / memInfo.totalJSHeapSize > 0.8) {
          this.cleanupUnusedAssets(true);
        }
      }, 30000);
    }
  }

  /**
   * Pulizia asset inutilizzati
   */
  private cleanupUnusedAssets(aggressive = false): void {
    const now = Date.now();
    const maxAge = aggressive ? 10 * 60 * 1000 : 30 * 60 * 1000; // 10/30 minuti

    for (const [path, asset] of this.assetCache.entries()) {
      if (now - asset.lastAccessed > maxAge) {
        // Revoca URL se è un blob
        if (asset.url.startsWith('blob:')) {
          URL.revokeObjectURL(asset.url);
        }
        
        this.assetCache.delete(path);
        console.log(`Cleaned up unused asset: ${path}`);
      }
    }
  }

  /**
   * Pulizia completa
   */
  public cleanup(): void {
    // Revoca tutti gli URL blob
    for (const asset of this.assetCache.values()) {
      if (asset.url.startsWith('blob:')) {
        URL.revokeObjectURL(asset.url);
      }
    }

    this.assetCache.clear();
    this.loadingPromises.clear();
    this.preloadQueue = [];
  }

  /**
   * Utility methods
   */
  private detectAssetType(path: string): AssetConfig['type'] {
    const ext = path.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
        return 'image';
      case 'css':
        return 'style';
      case 'js':
      case 'mjs':
        return 'script';
      case 'woff':
      case 'woff2':
      case 'ttf':
      case 'eot':
        return 'font';
      default:
        return 'data';
    }
  }

  private resolveAssetPath(path: string): string {
    if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) {
      return path;
    }
    
    return `/assets/${path}`;
  }

  private async getAssetSize(url: string): Promise<number> {
    if (url.startsWith('blob:')) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return blob.size;
      } catch {
        return 0;
      }
    }
    return 0;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## Utilizzo nel Framework

### Nelle Estensioni

```typescript
@KimuComponent({
  tag: 'image-gallery',
  name: 'Image Gallery'
})
export class ImageGallery extends HTMLElement {
  private assetManager = KimuAssetManager.getInstance();
  private images: string[] = [];

  async connectedCallback() {
    await this.preloadCriticalAssets();
    this.render();
  }

  private async preloadCriticalAssets() {
    // Precarica asset critici
    await this.assetManager.preloadAssets([
      {
        path: 'image-gallery/spinner.svg',
        type: 'image',
        priority: 10,
        preload: true
      },
      {
        path: 'image-gallery/styles.css',
        type: 'style',
        priority: 9,
        preload: true
      }
    ]);
  }

  private async loadImage(imagePath: string): Promise<string> {
    return this.assetManager.getAsset(imagePath, {
      type: 'image',
      cache: true,
      retry: 2
    });
  }

  private async render() {
    const spinnerUrl = await this.assetManager.getAsset('image-gallery/spinner.svg');
    
    this.innerHTML = `
      <div class="gallery-container">
        <div class="loading" style="background-image: url(${spinnerUrl})">
          Caricamento...
        </div>
        <div class="gallery-grid" id="gallery"></div>
      </div>
    `;

    this.loadGalleryImages();
  }

  private async loadGalleryImages() {
    const gallery = this.querySelector('#gallery') as HTMLElement;
    
    for (const imagePath of this.images) {
      try {
        const imageUrl = await this.loadImage(imagePath);
        this.addImageToGallery(gallery, imageUrl);
      } catch (error) {
        console.warn(`Failed to load image: ${imagePath}`, error);
        this.addPlaceholderToGallery(gallery);
      }
    }
  }

  private addImageToGallery(gallery: HTMLElement, imageUrl: string) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.loading = 'lazy';
    img.className = 'gallery-image';
    gallery.appendChild(img);
  }
}
```

### Asset Configuration

```typescript
// Configurazione asset per estensione
export const EXTENSION_ASSETS = {
  critical: [
    {
      path: 'my-extension/main.css',
      type: 'style' as const,
      priority: 10,
      preload: true
    },
    {
      path: 'my-extension/logo.svg',
      type: 'image' as const,
      priority: 9,
      preload: true
    }
  ],
  
  lazy: [
    {
      path: 'my-extension/heavy-script.js',
      type: 'script' as const,
      priority: 1,
      preload: false
    },
    {
      path: 'my-extension/background.jpg',
      type: 'image' as const,
      priority: 0,
      preload: false
    }
  ]
};

// Utilizzo nella estensione
@KimuComponent({
  tag: 'my-extension',
  name: 'My Extension'
})
export class MyExtension extends HTMLElement {
  private assetManager = KimuAssetManager.getInstance();

  async connectedCallback() {
    // Precarica asset critici
    await this.assetManager.preloadAssets(EXTENSION_ASSETS.critical);
    this.render();
  }

  private async loadHeavyFeature() {
    // Carica asset pesanti solo quando necessari
    const scriptUrl = await this.assetManager.getAsset('my-extension/heavy-script.js');
    // Usa lo script...
  }
}
```

### Progressive Loading

```typescript
export class ProgressiveImageLoader {
  private assetManager = KimuAssetManager.getInstance();

  async loadProgressively(container: HTMLElement, imagePaths: string[]) {
    // 1. Carica placeholder
    const placeholderUrl = await this.assetManager.getAsset('common/placeholder.svg');
    this.showPlaceholder(container, placeholderUrl);

    // 2. Carica immagine a bassa risoluzione
    const lowResUrl = await this.assetManager.getAsset(`${imagePaths[0]}-thumb.jpg`);
    this.showImage(container, lowResUrl, 'low-res');

    // 3. Carica immagine ad alta risoluzione
    try {
      const highResUrl = await this.assetManager.getAsset(imagePaths[0]);
      this.showImage(container, highResUrl, 'high-res');
    } catch (error) {
      console.warn('Failed to load high-res image, keeping low-res');
    }
  }

  private showPlaceholder(container: HTMLElement, url: string) {
    container.innerHTML = `<img src="${url}" class="placeholder" alt="Loading..." />`;
  }

  private showImage(container: HTMLElement, url: string, quality: string) {
    const img = container.querySelector('img') as HTMLImageElement;
    img.src = url;
    img.className = quality;
  }
}
```

## Vantaggi

### Performance
- **Lazy Loading**: Carica solo asset necessari
- **Caching**: Evita ricaricamenti inutili  
- **Preloading**: Caricamento anticipato di asset critici
- **Progressive Loading**: Esperienza utente migliorata

### Robustezza
- **Retry Logic**: Gestione automatica dei fallimenti
- **Timeout**: Evita hang infiniti
- **Error Recovery**: Graceful degradation

### Gestione Memoria
- **Automatic Cleanup**: Pulizia automatica asset inutilizzati
- **Memory Monitoring**: Monitoraggio uso memoria
- **URL Revocation**: Gestione corretta blob URL

## Svantaggi

### Complessità
- **Overhead**: Logica di gestione asset complessa
- **State Management**: Tracking dello stato di caricamento
- **Configuration**: Configurazione dettagliata necessaria

### Memory Usage
- **Cache Size**: Cache può crescere molto
- **Blob URLs**: Possibile memory leak se non gestiti
- **Asset Duplication**: Possibili duplicazioni in cache

## Best Practices

### Prioritizzazione Asset

```typescript
const ASSET_PRIORITIES = {
  CRITICAL: 10,    // CSS critici, logo, icone essenziali
  HIGH: 7,         // Immagini above-the-fold
  MEDIUM: 5,       // Immagini below-the-fold
  LOW: 2,          // Asset opzionali
  BACKGROUND: 0    // Asset di background
};
```

### Configurazione Responsive

```typescript
const RESPONSIVE_CONFIG = {
  mobile: {
    maxImageSize: 500 * 1024,    // 500KB
    preloadLimit: 3,
    cacheSize: 50
  },
  desktop: {
    maxImageSize: 2 * 1024 * 1024, // 2MB
    preloadLimit: 10,
    cacheSize: 200
  }
};
```

### Monitoring

```typescript
class AssetMetrics {
  static trackLoading(path: string, startTime: number, success: boolean) {
    const loadTime = Date.now() - startTime;
    
    // Invia metriche al sistema di monitoring
    window.kimu?.analytics?.track('asset_load', {
      path,
      loadTime,
      success,
      userAgent: navigator.userAgent
    });
  }
}
```

## Riferimenti

- [KimuAssetManager](../core/kimu-asset-manager.md)
- [Lazy Loading Pattern](./lazy-loading.md)
- [Performance Optimization](../extensions/best-practices.md)
- [Memory Management](./memory-management.md)
