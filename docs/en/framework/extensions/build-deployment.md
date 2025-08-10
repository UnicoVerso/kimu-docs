# Build and Deployment

This guide covers the build and deployment process for KIMU extensions, including tools, configurations, and best practices.

## Build Process

### Building a Single Extension

The KIMU framework provides dedicated scripts for compiling extensions:

```bash
# Compile a single extension
node scripts/build-extension.js my-extension

# Or use npm script (if configured)
npm run build:extension my-extension
```

### Building All Extensions

```bash
# Compile all extensions
node scripts/build-all-extensions.js

# Or use npm script
npm run build:extensions
```

## Build Configuration

### ESBuild Configuration

Extensions are compiled using ESBuild with the following configuration:

```javascript
// scripts/build-extension.js
const buildConfig = {
  entryPoints: [entry],         // src/extensions/name/component.ts
  bundle: true,                 // Bundle all dependencies
  minify: true,                 // Minify code
  format: 'esm',               // ES modules format
  outfile: outFile,            // dist/extensions/name/component.js
  platform: 'browser',        // Browser target
  target: 'es2020',           // ES2020 target
  sourcemap: true,            // Generate source maps
  external: [                 // External dependencies
    'kimu-core',
    'kimu-framework'
  ]
};
```

### Custom Configuration

You can customize the build by adding a `build.config.js` file in the extension folder:

```javascript
// src/extensions/my-extension/build.config.js
export default {
  // ESBuild customizations
  minify: false,              // Disable minification for debug
  sourcemap: 'inline',       // Inline source maps
  target: 'es2022',          // Newer target
  
  // Custom plugins
  plugins: [
    // CSS plugin
    cssPlugin(),
    // Asset plugin
    assetPlugin()
  ],
  
  // Global definitions
  define: {
    '__DEV__': 'true',
    '__VERSION__': '"1.0.0"'
  },
  
  // Additional external dependencies
  external: [
    'my-custom-lib'
  ]
};
```

## Output Structure

### Build Directory

```
dist/
├── extensions/
│   ├── my-extension/
│   │   ├── component.js        # Compiled entry point
│   │   ├── component.js.map    # Source map
│   │   ├── assets/             # Processed assets
│   │   │   ├── styles.css
│   │   │   └── images/
│   │   └── manifest.json       # Copied manifest
│   └── other-extension/
│       └── ...
└── core/                       # Core framework
    └── ...
```

### Compiled Manifest

During build, a compiled manifest is generated that includes additional information:

```json
{
  "tag": "my-extension",
  "path": "my-extension",
  "name": "My Extension",
  "version": "1.0.0",
  "buildInfo": {
    "buildTime": "2024-01-15T10:30:00Z",
    "buildHash": "abc123def456",
    "sourceSize": 15420,
    "minifiedSize": 8932,
    "gzipSize": 3241
  },
  "assets": [
    {
      "file": "component.js",
      "size": 8932,
      "hash": "sha256:def789..."
    }
  ]
}
```

## Asset Processing

### CSS Handling

```typescript
// CSS imported as string
import styles from './styles.css?inline';

@KimuComponent({
  tag: 'my-extension',
  styles // Automatically included
})
export class MyExtension extends HTMLElement {
  // ...
}
```

### Image Handling

```typescript
// Image imports
import logoUrl from './assets/logo.png';

export class MyExtension extends HTMLElement {
  render() {
    this.shadowRoot.innerHTML = `
      <img src="${logoUrl}" alt="Logo" />
    `;
  }
}
```

### Dynamic Assets

```typescript
import { KimuAssetManager } from '../../core/kimu-asset-manager';

export class MyExtension extends HTMLElement {
  private async loadDynamicAsset() {
    const assetManager = KimuAssetManager.getInstance();
    const imageUrl = await assetManager.getAsset('my-extension/dynamic-image.png');
    return imageUrl;
  }
}
```

## Environment Configuration

### Multi-Environment Configuration

```javascript
// scripts/build-extension.js
const environments = {
  development: {
    minify: false,
    sourcemap: true,
    define: {
      '__DEV__': 'true',
      '__API_URL__': '"http://localhost:3000"'
    }
  },
  
  production: {
    minify: true,
    sourcemap: false,
    define: {
      '__DEV__': 'false',
      '__API_URL__': '"https://api.production.com"'
    }
  },
  
  staging: {
    minify: true,
    sourcemap: true,
    define: {
      '__DEV__': 'false',
      '__API_URL__': '"https://api.staging.com"'
    }
  }
};

const env = process.env.NODE_ENV || 'development';
const config = environments[env];
```

### Usage in Extensions

```typescript
declare const __DEV__: boolean;
declare const __API_URL__: string;

export class MyExtension extends HTMLElement {
  private debug = __DEV__;
  private apiUrl = __API_URL__;
  
  private log(message: string) {
    if (this.debug) {
      console.log(`[MyExtension] ${message}`);
    }
  }
}
```

## Watch Mode

### Development Server

```bash
# Start watch mode for development
node scripts/watch-extensions.js

# Watch single extension
node scripts/watch-extension.js my-extension
```

### Watch Configuration

```javascript
// scripts/watch-extension.js
import { build } from 'esbuild';

const watchConfig = {
  ...buildConfig,
  watch: {
    onRebuild(error, result) {
      if (error) {
        console.error('❌ Build failed:', error);
      } else {
        console.log('✅ Build succeeded');
        // Hot reload if configured
        notifyHotReload();
      }
    }
  }
};
```

## Deployment

### Local Deployment

```bash
# Copy files to development directory
npm run deploy:local

# Equivalent to:
cp -r dist/extensions/* ../kimu-app/public/extensions/
```

### CDN Deployment

```bash
# Upload to CDN
npm run deploy:cdn

# Equivalent to:
aws s3 sync dist/extensions/ s3://kimu-extensions/v1.0.0/
```

### Registry Deployment

```bash
# Publish to extension registry
npm run publish:extension my-extension

# Equivalent to:
kimu publish my-extension --version 1.0.0
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/build-extensions.yml
name: Build Extensions

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint extensions
      run: npm run lint:extensions
    
    - name: Test extensions
      run: npm run test:extensions
    
    - name: Build extensions
      run: npm run build:extensions
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: built-extensions
        path: dist/extensions/
    
    - name: Deploy to staging
      if: github.ref == 'refs/heads/main'
      run: npm run deploy:staging
```

### Validation Pipeline

```bash
# Validate all extensions
npm run validate:extensions

# Includes:
# - Syntax check
# - Manifest validation
# - Dependency check
# - Size limits
# - Performance check
```

## Optimization

### Code Splitting

```typescript
// Lazy loading of heavy components
export class MyExtension extends HTMLElement {
  private async loadHeavyComponent() {
    const { HeavyComponent } = await import('./heavy-component');
    return new HeavyComponent();
  }
}
```

### Tree Shaking

```javascript
// build.config.js
export default {
  treeShaking: true,
  sideEffects: false,
  
  // Helps tree shaking
  external: [
    'lodash-es', // Use ES modules version
    'rxjs/operators' // Specific imports
  ]
};
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run analyze:bundle my-extension

# Generate detailed report
npm run bundle:report
```

## Testing

### Unit Testing

```bash
# Test single extension
npm run test:extension my-extension

# Test all extensions
npm run test:extensions
```

### E2E Testing

```bash
# End-to-end testing
npm run test:e2e:extensions

# Include deployment test
npm run test:deployment
```

## Monitoring

### Build Metrics

```javascript
// scripts/build-metrics.js
const metrics = {
  buildTime: Date.now() - startTime,
  bundleSize: fs.statSync(outputFile).size,
  dependencies: getDependencyCount(),
  warnings: warningsCount,
  errors: errorsCount
};

// Send metrics
sendMetrics(metrics);
```

### Performance Monitoring

```typescript
// Runtime performance monitoring
export class MyExtension extends HTMLElement {
  connectedCallback() {
    const startTime = performance.now();
    
    this.render();
    
    const endTime = performance.now();
    this.reportMetric('render-time', endTime - startTime);
  }
  
  private reportMetric(name: string, value: number) {
    // Send metric to monitoring system
  }
}
```

## Troubleshooting

### Common Build Errors

```bash
# Clean build cache
npm run clean:build

# Rebuild from scratch
npm run rebuild:extensions

# Debug verbose build
DEBUG=true npm run build:extension my-extension
```

### Dependency Issues

```bash
# Check dependencies
npm run check:deps

# Update dependencies
npm run update:deps

# Resolve conflicts
npm run resolve:deps
```

## Best Practices

1. **Versioning**: Use semantic versioning for artifacts
2. **Caching**: Implement intelligent caching to speed up builds
3. **Parallelization**: Compile extensions in parallel when possible
4. **Validation**: Always validate before deployment
5. **Monitoring**: Monitor build performance and bundle size
6. **Documentation**: Document custom configurations
7. **Testing**: Automated testing for every build

## References

- [Creating an Extension](./creating-extensions.md)
- [Extension Manifest](./extension-manifest.md)
- [Best Practices](./best-practices.md)
- [KimuAssetManager](../core/kimu-asset-manager.md)
