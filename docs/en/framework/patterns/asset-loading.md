# Asset Loading Pattern

The Asset Loading pattern manages efficient loading of resources (images, CSS, JavaScript, fonts, etc.) in modular applications, optimizing performance and user experience.

## Problem

In modern applications with many extensions, asset loading presents several challenges:

- **Performance**: Loading unnecessary assets slows down the application
- **Dependencies**: Assets may depend on other assets
- **Caching**: Need to avoid unnecessary reloads
- **Lazy Loading**: Load assets only when needed
- **Error Handling**: Handle loading failures
- **Progressive Loading**: Prioritize critical assets
- **Memory Management**: Avoid accumulation of unused assets

## Solution

The Asset Loading pattern implements:

1. **Lazy Loading**: On-demand loading
2. **Caching**: Intelligent asset caching
3. **Preloading**: Anticipatory loading of critical assets
4. **Prioritization**: Loading priority management
5. **Error Recovery**: Robust error handling
6. **Memory Management**: Automatic memory cleanup

## Implementation in KIMU

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
   * Loads a single asset
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

    // Check cache
    if (fullConfig.cache && this.assetCache.has(path)) {
      const cached = this.assetCache.get(path)!;
      cached.lastAccessed = Date.now();
      return cached.url;
    }

    // Check if already loading
    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path)!;
    }

    // Start new loading
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
   * Loading with automatic retry
   */
  private async loadAssetWithRetry(config: AssetConfig): Promise<string> {
    let lastError: Error;

    for (let attempt = 1; attempt <= config.retry!; attempt++) {
      try {
        const startTime = Date.now();
        const url = await this.loadSingleAsset(config);
        const loadTime = Date.now() - startTime;

        // Save to cache if requested
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
          // Exponential backoff
          await this.delay(Math.pow(2, attempt - 1) * 1000);
        }
      }
    }

    throw new Error(`Failed to load asset ${config.path} after ${config.retry} attempts: ${lastError.message}`);
  }

  /**
   * Single asset loading
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
   * Image loading
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
      
      // Create object URL for memory management
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
   * Stylesheet loading
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
   * Script loading
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
   * Font loading
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
   * Data loading
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
   * Generic loading
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
   * Asset preloading
   */
  public async preloadAssets(configs: AssetConfig[]): Promise<void> {
    // Sort by priority
    const sortedConfigs = configs.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    
    this.preloadQueue.push(...sortedConfigs);
    
    if (!this.isPreloading) {
      this.processPreloadQueue();
    }
  }

  /**
   * Process preload queue
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
   * Automatic memory management
   */
  private setupMemoryManagement(): void {
    // Periodic cache cleanup
    setInterval(() => {
      this.cleanupUnusedAssets();
    }, 5 * 60 * 1000); // Every 5 minutes

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // Cleanup when memory is low
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
   * Cleanup unused assets
   */
  private cleanupUnusedAssets(aggressive = false): void {
    const now = Date.now();
    const maxAge = aggressive ? 10 * 60 * 1000 : 30 * 60 * 1000; // 10/30 minutes

    for (const [path, asset] of this.assetCache.entries()) {
      if (now - asset.lastAccessed > maxAge) {
        // Revoke URL if it's a blob
        if (asset.url.startsWith('blob:')) {
          URL.revokeObjectURL(asset.url);
        }
        
        this.assetCache.delete(path);
        console.log(`Cleaned up unused asset: ${path}`);
      }
    }
  }

  /**
   * Complete cleanup
   */
  public cleanup(): void {
    // Revoke all blob URLs
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

## Usage in Framework

### In Extensions

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
    // Preload critical assets
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
          Loading...
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
// Asset configuration for extension
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

// Usage in extension
@KimuComponent({
  tag: 'my-extension',
  name: 'My Extension'
})
export class MyExtension extends HTMLElement {
  private assetManager = KimuAssetManager.getInstance();

  async connectedCallback() {
    // Preload critical assets
    await this.assetManager.preloadAssets(EXTENSION_ASSETS.critical);
    this.render();
  }

  private async loadHeavyFeature() {
    // Load heavy assets only when needed
    const scriptUrl = await this.assetManager.getAsset('my-extension/heavy-script.js');
    // Use the script...
  }
}
```

### Progressive Loading

```typescript
export class ProgressiveImageLoader {
  private assetManager = KimuAssetManager.getInstance();

  async loadProgressively(container: HTMLElement, imagePaths: string[]) {
    // 1. Load placeholder
    const placeholderUrl = await this.assetManager.getAsset('common/placeholder.svg');
    this.showPlaceholder(container, placeholderUrl);

    // 2. Load low-resolution image
    const lowResUrl = await this.assetManager.getAsset(`${imagePaths[0]}-thumb.jpg`);
    this.showImage(container, lowResUrl, 'low-res');

    // 3. Load high-resolution image
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

## Advantages

### Performance
- **Lazy Loading**: Load only necessary assets
- **Caching**: Avoid unnecessary reloads  
- **Preloading**: Anticipatory loading of critical assets
- **Progressive Loading**: Improved user experience

### Robustness
- **Retry Logic**: Automatic failure handling
- **Timeout**: Avoid infinite hangs
- **Error Recovery**: Graceful degradation

### Memory Management
- **Automatic Cleanup**: Automatic cleanup of unused assets
- **Memory Monitoring**: Memory usage monitoring
- **URL Revocation**: Proper blob URL management

## Disadvantages

### Complexity
- **Overhead**: Complex asset management logic
- **State Management**: Loading state tracking
- **Configuration**: Detailed configuration needed

### Memory Usage
- **Cache Size**: Cache can grow large
- **Blob URLs**: Possible memory leaks if not managed
- **Asset Duplication**: Possible cache duplications

## Best Practices

### Asset Prioritization

```typescript
const ASSET_PRIORITIES = {
  CRITICAL: 10,    // Critical CSS, logo, essential icons
  HIGH: 7,         // Above-the-fold images
  MEDIUM: 5,       // Below-the-fold images
  LOW: 2,          // Optional assets
  BACKGROUND: 0    // Background assets
};
```

### Responsive Configuration

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
    
    // Send metrics to monitoring system
    window.kimu?.analytics?.track('asset_load', {
      path,
      loadTime,
      success,
      userAgent: navigator.userAgent
    });
  }
}
```

## References

- [KimuAssetManager](../core/kimu-asset-manager.md)
- [Performance Optimization](../extensions/best-practices.md)
- [Singleton Pattern](./singleton-pattern.md)
- [Observer Pattern](./observer-pattern.md)
