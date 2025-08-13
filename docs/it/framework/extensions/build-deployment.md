# Build e Deployment

Questa guida copre il processo di build e deployment delle estensioni KIMU, inclusi strumenti, configurazioni e best practices.

## Processo di Build

### Build di una Singola Estensione

Il framework KIMU fornisce script dedicati per compilare le estensioni:

```bash
# Compila una singola estensione
node scripts/build-extension.js my-extension

# Oppure usa npm script (se configurato)
npm run build:extension my-extension
```

### Build di Tutte le Estensioni

```bash
# Compila tutte le estensioni
node scripts/build-all-extensions.js

# Oppure usa npm script
npm run build:extensions
```

## Configurazione di Build

### ESBuild Configuration

Le estensioni vengono compilate usando ESBuild con la seguente configurazione:

```javascript
// scripts/build-extension.js
const buildConfig = {
  entryPoints: [entry],         // src/extensions/nome/component.ts
  bundle: true,                 // Bundle tutte le dipendenze
  minify: true,                 // Minifica il codice
  format: 'esm',               // Formato ES modules
  outfile: outFile,            // dist/extensions/nome/component.js
  platform: 'browser',        // Target browser
  target: 'es2020',           // Target ES2020
  sourcemap: true,            // Genera source maps
  external: [                 // Dipendenze esterne
    'kimu-core',
    'kimu-framework'
  ]
};
```

### Configurazione Personalizzata

Puoi personalizzare la build aggiungendo un file `build.config.js` nella cartella dell'estensione:

```javascript
// src/extensions/my-extension/build.config.js
export default {
  // Personalizzazioni ESBuild
  minify: false,              // Disabilita minificazione per debug
  sourcemap: 'inline',       // Source maps inline
  target: 'es2022',          // Target più recente
  
  // Plugin personalizzati
  plugins: [
    // Plugin per CSS
    cssPlugin(),
    // Plugin per asset
    assetPlugin()
  ],
  
  // Definizioni globali
  define: {
    '__DEV__': 'true',
    '__VERSION__': '"1.0.0"'
  },
  
  // Dipendenze esterne aggiuntive
  external: [
    'my-custom-lib'
  ]
};
```

## Struttura di Output

### Directory di Build

```
dist/
├── extensions/
│   ├── my-extension/
│   │   ├── component.js        # Entry point compilato
│   │   ├── component.js.map    # Source map
│   │   ├── assets/             # Asset processati
│   │   │   ├── styles.css
│   │   │   └── images/
│   │   └── manifest.json       # Manifest copiato
│   └── other-extension/
│       └── ...
└── core/                       # Core framework
    └── ...
```

### Manifest Compilato

Durante il build, viene generato un manifest compilato che include informazioni aggiuntive:

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

### Gestione CSS

```typescript
// CSS importato come stringa
import styles from './styles.css?inline';

@KimuComponent({
  tag: 'my-extension',
  styles // Incluso automaticamente
})
export class MyExtension extends HTMLElement {
  // ...
}
```

### Gestione Immagini

```typescript
// Import di immagini
import logoUrl from './assets/logo.png';

export class MyExtension extends HTMLElement {
  render() {
    this.shadowRoot.innerHTML = `
      <img src="${logoUrl}" alt="Logo" />
    `;
  }
}
```

### Asset Dinamici

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

### Configurazione Multi-Environment

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

### Utilizzo nelle Estensioni

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
# Avvia watch mode per sviluppo
node scripts/watch-extensions.js

# Watch singola estensione
node scripts/watch-extension.js my-extension
```

### Configurazione Watch

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
        // Hot reload se configurato
        notifyHotReload();
      }
    }
  }
};
```

## Deployment

### Deployment Locale

```bash
# Copia file nella directory di sviluppo
npm run deploy:local

# Equivalente a:
cp -r dist/extensions/* ../kimu-app/public/extensions/
```

### Deployment CDN

```bash
# Upload su CDN
npm run deploy:cdn

# Equivalente a:
aws s3 sync dist/extensions/ s3://kimu-extensions/v1.0.0/
```

### Deployment Registry

```bash
# Publica nel registry delle estensioni
npm run publish:extension my-extension

# Equivalente a:
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
# Valida tutte le estensioni
npm run validate:extensions

# Include:
# - Syntax check
# - Manifest validation
# - Dependency check
# - Size limits
# - Performance check
```

## Ottimizzazione

### Code Splitting

```typescript
// Lazy loading di componenti pesanti
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
  
  // Aiuta il tree shaking
  external: [
    'lodash-es', // Usa versione ES modules
    'rxjs/operators' // Import specifici
  ]
};
```

### Bundle Analysis

```bash
# Analizza bundle size
npm run analyze:bundle my-extension

# Genera report dettagliato
npm run bundle:report
```

## Testing

### Unit Testing

```bash
# Test singola estensione
npm run test:extension my-extension

# Test tutte le estensioni
npm run test:extensions
```

### E2E Testing

```bash
# Test end-to-end
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

// Invia metriche
sendMetrics(metrics);
```

### Performance Monitoring

```typescript
// Monitoraggio performance runtime
export class MyExtension extends HTMLElement {
  connectedCallback() {
    const startTime = performance.now();
    
    this.render();
    
    const endTime = performance.now();
    this.reportMetric('render-time', endTime - startTime);
  }
  
  private reportMetric(name: string, value: number) {
    // Invia metrica al sistema di monitoring
  }
}
```

## Troubleshooting

### Build Errors Comuni

```bash
# Pulisci cache build
npm run clean:build

# Rebuild da zero
npm run rebuild:extensions

# Debug build verbose
DEBUG=true npm run build:extension my-extension
```

### Dependency Issues

```bash
# Controlla dipendenze
npm run check:deps

# Aggiorna dipendenze
npm run update:deps

# Risolvi conflitti
npm run resolve:deps
```

## Best Practices

1. **Versioning**: Usa semantic versioning per gli artifact
2. **Caching**: Implementa cache intelligente per accelerare i build
3. **Parallelization**: Compila estensioni in parallelo quando possibile
4. **Validation**: Valida sempre prima del deployment
5. **Monitoring**: Monitor build performance e bundle size
6. **Documentation**: Documenta configurazioni custom
7. **Testing**: Test automated per ogni build

## Riferimenti

- [Creare un'Estensione](./creating-extensions.md)
- [Extension Manifest](./extension-manifest.md)
- [Best Practices](./best-practices.md)
- [KimuAssetManager](../core/kimu-asset-manager.md)
