# KimuAssetManager

KimuAssetManager is a singleton class that provides centralized asset management for the KIMU framework. It handles loading, caching, and optimization of various types of assets including images, stylesheets, scripts, and other resources.

## Overview

The Asset Manager provides:
- **Centralized asset loading** with unified API
- **Intelligent caching** to avoid redundant requests
- **Lazy loading** for performance optimization
- **Error handling and retry logic** for robust asset delivery
- **Memory management** with automatic cleanup
- **Asset preprocessing** and optimization

## Class Definition

```typescript
export class KimuAssetManager {
  private static instance: KimuAssetManager;
  private assetCache: Map<string, LoadedAsset> = new Map();
  private loadingPromises: Map<string, Promise<string>> = new Map();
  private memoryThreshold: number = 50 * 1024 * 1024; // 50MB
}
```

## Singleton Pattern

### getInstance()

```typescript
public static getInstance(): KimuAssetManager {
  if (!KimuAssetManager.instance) {
    KimuAssetManager.instance = new KimuAssetManager();
  }
  return KimuAssetManager.instance;
}
```

Gets the singleton instance of the asset manager.

**Returns**: `KimuAssetManager` - The singleton instance

## Core Asset Loading

### getAsset()

```typescript
public async getAsset(path: string, options?: AssetOptions): Promise<string> {
  // Check cache first
  const cached = this.assetCache.get(path);
  if (cached && !this.isExpired(cached)) {
    cached.lastAccessed = Date.now();
    return cached.url;
  }

  // Check if already loading
  if (this.loadingPromises.has(path)) {
    return this.loadingPromises.get(path)!;
  }

  // Start new loading
  const loadingPromise = this.loadAssetWithRetry(path, options);
  this.loadingPromises.set(path, loadingPromise);

  try {
    const url = await loadingPromise;
    this.cacheAsset(path, url, options);
    return url;
  } finally {
    this.loadingPromises.delete(path);
  }
}
```

Loads an asset from the given path, with caching and retry logic.

**Parameters**:
- `path` (string): The asset path relative to the assets directory
- `options` (AssetOptions): Loading options and configuration

**Returns**: `Promise<string>` - URL of the loaded asset

**Example**:
```typescript
const assetManager = KimuAssetManager.getInstance();

// Load an image
const imageUrl = await assetManager.getAsset('images/logo.png');

// Load with options
const scriptUrl = await assetManager.getAsset('scripts/module.js', {
  cache: true,
  retry: 3,
  timeout: 10000
});
```

## Asset Types

### loadImage()

```typescript
public async loadImage(path: string, options?: ImageOptions): Promise<string> {
  const fullOptions = {
    ...options,
    type: 'image',
    preprocessor: this.imagePreprocessor
  };
  
  return this.getAsset(path, fullOptions);
}
```

Specialized method for loading images with image-specific optimizations.

**Example**:
```typescript
// Load and optimize image
const imageUrl = await assetManager.loadImage('photos/hero.jpg', {
  maxWidth: 1920,
  quality: 0.8,
  format: 'webp'
});
```

### loadStylesheet()

```typescript
public async loadStylesheet(path: string, options?: StyleOptions): Promise<string> {
  const fullOptions = {
    ...options,
    type: 'stylesheet',
    preprocessor: this.cssPreprocessor
  };
  
  const url = await this.getAsset(path, fullOptions);
  
  // Auto-inject if requested
  if (options?.autoInject !== false) {
    this.injectStylesheet(url);
  }
  
  return url;
}
```

Loads CSS stylesheets with optional auto-injection.

**Example**:
```typescript
// Load and inject stylesheet
await assetManager.loadStylesheet('styles/theme.css', {
  autoInject: true,
  media: 'screen'
});
```

### loadScript()

```typescript
public async loadScript(path: string, options?: ScriptOptions): Promise<string> {
  const fullOptions = {
    ...options,
    type: 'script',
    preprocessor: this.scriptPreprocessor
  };
  
  const url = await this.getAsset(path, fullOptions);
  
  // Auto-execute if requested
  if (options?.autoExecute) {
    await this.executeScript(url, options);
  }
  
  return url;
}
```

Loads JavaScript files with optional auto-execution.

**Example**:
```typescript
// Load and execute script
await assetManager.loadScript('modules/analytics.js', {
  autoExecute: true,
  defer: true
});
```

### loadFont()

```typescript
public async loadFont(path: string, options?: FontOptions): Promise<FontFace> {
  const fontFace = new FontFace(
    options?.family || 'CustomFont',
    `url(${this.resolveAssetPath(path)})`,
    options?.descriptors
  );
  
  await fontFace.load();
  document.fonts.add(fontFace);
  
  return fontFace;
}
```

Loads web fonts and adds them to the document font set.

**Example**:
```typescript
// Load custom font
const font = await assetManager.loadFont('fonts/custom.woff2', {
  family: 'CustomFont',
  weight: '400',
  style: 'normal'
});
```

## Bulk Operations

### preloadAssets()

```typescript
public async preloadAssets(
  assets: Array<string | AssetDescriptor>,
  options?: PreloadOptions
): Promise<void> {
  const loadPromises = assets.map(async (asset) => {
    try {
      if (typeof asset === 'string') {
        await this.getAsset(asset);
      } else {
        await this.getAsset(asset.path, asset.options);
      }
    } catch (error) {
      if (!options?.ignoreErrors) {
        throw error;
      }
      console.warn(`Failed to preload asset: ${asset}`, error);
    }
  });

  if (options?.parallel !== false) {
    await Promise.all(loadPromises);
  } else {
    for (const promise of loadPromises) {
      await promise;
    }
  }
}
```

Preloads multiple assets for better performance.

**Example**:
```typescript
// Preload critical assets
await assetManager.preloadAssets([
  'images/logo.svg',
  'styles/critical.css',
  { 
    path: 'images/hero.jpg', 
    options: { priority: 'high' } 
  }
], {
  parallel: true,
  ignoreErrors: true
});
```

### loadAssetGroup()

```typescript
public async loadAssetGroup(groupName: string): Promise<AssetGroup> {
  const group = this.assetGroups.get(groupName);
  if (!group) {
    throw new Error(`Asset group '${groupName}' not found`);
  }

  const loadedAssets = new Map<string, string>();
  
  for (const [key, assetPath] of group.assets) {
    try {
      const url = await this.getAsset(assetPath, group.options);
      loadedAssets.set(key, url);
    } catch (error) {
      console.error(`Failed to load asset '${key}' in group '${groupName}':`, error);
      if (!group.options?.ignoreErrors) {
        throw error;
      }
    }
  }

  return {
    name: groupName,
    assets: loadedAssets,
    metadata: group.metadata
  };
}
```

Loads predefined groups of related assets.

## Caching System

### Cache Management

```typescript
private cacheAsset(path: string, url: string, options?: AssetOptions): void {
  if (options?.cache === false) return;

  const asset: LoadedAsset = {
    url,
    size: 0, // Will be calculated
    loadTime: Date.now(),
    lastAccessed: Date.now(),
    expiresAt: options?.ttl ? Date.now() + options.ttl : undefined,
    metadata: options?.metadata || {}
  };

  this.assetCache.set(path, asset);
  this.scheduleMemoryCheck();
}
```

### Cache Invalidation

```typescript
public invalidateCache(path?: string): void {
  if (path) {
    // Invalidate specific asset
    const asset = this.assetCache.get(path);
    if (asset && asset.url.startsWith('blob:')) {
      URL.revokeObjectURL(asset.url);
    }
    this.assetCache.delete(path);
  } else {
    // Invalidate all cached assets
    for (const asset of this.assetCache.values()) {
      if (asset.url.startsWith('blob:')) {
        URL.revokeObjectURL(asset.url);
      }
    }
    this.assetCache.clear();
  }
}
```

### Memory Management

```typescript
private scheduleMemoryCheck(): void {
  if (this.memoryCheckScheduled) return;
  
  this.memoryCheckScheduled = true;
  setTimeout(() => {
    this.performMemoryCheck();
    this.memoryCheckScheduled = false;
  }, 5000);
}

private performMemoryCheck(): void {
  const totalSize = this.calculateCacheSize();
  
  if (totalSize > this.memoryThreshold) {
    this.evictLeastRecentlyUsed();
  }
}

private evictLeastRecentlyUsed(): void {
  const entries = Array.from(this.assetCache.entries())
    .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);
  
  const toEvict = entries.slice(0, Math.floor(entries.length * 0.3));
  
  for (const [path] of toEvict) {
    this.invalidateCache(path);
  }
  
  console.log(`Evicted ${toEvict.length} assets from cache`);
}
```

## Error Handling and Retry Logic

### Retry with Backoff

```typescript
private async loadAssetWithRetry(
  path: string, 
  options?: AssetOptions
): Promise<string> {
  const maxRetries = options?.retry ?? 3;
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await this.loadSingleAsset(path, options);
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await this.delay(delay);
        console.warn(`Asset load attempt ${attempt + 1} failed for ${path}, retrying...`);
      }
    }
  }

  throw new Error(`Failed to load asset ${path} after ${maxRetries} attempts: ${lastError.message}`);
}
```

### Fallback Assets

```typescript
public async getAssetWithFallback(
  primaryPath: string,
  fallbackPaths: string[],
  options?: AssetOptions
): Promise<string> {
  const allPaths = [primaryPath, ...fallbackPaths];
  
  for (const path of allPaths) {
    try {
      return await this.getAsset(path, options);
    } catch (error) {
      console.warn(`Failed to load asset: ${path}`, error);
    }
  }
  
  throw new Error('All asset sources failed to load');
}
```

## Asset Processing

### Image Optimization

```typescript
private async imagePreprocessor(
  imageData: Blob,
  options?: ImageOptions
): Promise<Blob> {
  if (!options?.optimize) return imageData;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const img = new Image();
  
  img.src = URL.createObjectURL(imageData);
  await new Promise(resolve => img.onload = resolve);
  
  // Apply optimizations
  if (options.maxWidth && img.width > options.maxWidth) {
    const ratio = options.maxWidth / img.width;
    canvas.width = options.maxWidth;
    canvas.height = img.height * ratio;
  } else {
    canvas.width = img.width;
    canvas.height = img.height;
  }
  
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  return new Promise(resolve => {
    canvas.toBlob(resolve, 'image/jpeg', options.quality || 0.8);
  });
}
```

## Usage in Extensions

### Extension Asset Loading

```typescript
@KimuComponent({
  tag: 'media-gallery',
  name: 'Media Gallery'
})
export class MediaGallery extends HTMLElement {
  private assetManager = KimuAssetManager.getInstance();
  
  async connectedCallback() {
    // Preload critical assets
    await this.preloadAssets();
    this.render();
  }
  
  private async preloadAssets() {
    await this.assetManager.preloadAssets([
      'media-gallery/loader.svg',
      'media-gallery/styles.css',
      'media-gallery/icons.woff2'
    ]);
  }
  
  private async loadMedia(mediaPath: string) {
    try {
      const mediaUrl = await this.assetManager.getAsset(mediaPath, {
        cache: true,
        retry: 2
      });
      
      this.displayMedia(mediaUrl);
    } catch (error) {
      this.showErrorPlaceholder();
    }
  }
}
```

### Dynamic Asset Loading

```typescript
export class DynamicThemeLoader {
  private assetManager = KimuAssetManager.getInstance();
  
  async loadTheme(themeName: string) {
    try {
      // Load theme assets
      const [stylesheet, config] = await Promise.all([
        this.assetManager.loadStylesheet(`themes/${themeName}/style.css`),
        this.assetManager.getAsset(`themes/${themeName}/config.json`)
      ]);
      
      // Apply theme
      this.applyTheme(config);
      
    } catch (error) {
      console.error('Theme loading failed:', error);
      // Fallback to default theme
      await this.loadTheme('default');
    }
  }
}
```

## Best Practices

1. **Preload Critical Assets**: Load essential assets early
2. **Use Fallbacks**: Always provide fallback assets
3. **Cache Wisely**: Balance memory usage with performance
4. **Handle Errors**: Gracefully handle loading failures
5. **Optimize Images**: Compress and resize images appropriately
6. **Lazy Load**: Load non-critical assets on demand

## Events

The asset manager emits custom events:

- `kimu:asset-loading` - When asset loading starts
- `kimu:asset-loaded` - When asset loads successfully
- `kimu:asset-error` - When asset loading fails
- `kimu:cache-eviction` - When cache cleanup occurs

## Configuration

```typescript
interface AssetManagerConfig {
  cacheSize: number;
  defaultTimeout: number;
  retryAttempts: number;
  enableOptimization: boolean;
  cdnBaseUrl?: string;
}

// Configure asset manager
KimuAssetManager.configure({
  cacheSize: 100 * 1024 * 1024, // 100MB
  defaultTimeout: 15000,
  retryAttempts: 3,
  enableOptimization: true
});
```

## Related Components

- [Asset Loading Pattern](../patterns/asset-loading.md) - Architectural pattern for asset management
- [KimuApp](./kimu-app.md) - Application initialization with asset preloading
- [Extension Development](../extensions/creating-extensions.md) - Using assets in extensions
- [Performance Optimization](../extensions/best-practices.md) - Asset optimization strategies
