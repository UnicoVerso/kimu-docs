# Manifest delle Estensioni

Il manifest delle estensioni è il file che definisce tutte le estensioni disponibili nel framework KIMU. Serve come registro centrale per la discovery e il caricamento delle estensioni.

## File Manifest

Il file `extensions-manifest.json` si trova in `src/extensions/` e contiene un array di oggetti che descrivono ogni estensione:

```json
[
  {
    "tag": "kimu-home",
    "path": "kimu-home",
    "internal": true,
    "name": "KIMU Home Main App",
    "description": "Main interface container",
    "version": "1.0.0",
    "author": "UnicòVerso",
    "icon": "🏠",
    "kimuVersion": "1.0.0"
  },
  {
    "tag": "my-extension",
    "path": "my-extension", 
    "internal": false,
    "name": "My Extension",
    "description": "Una estensione di esempio",
    "version": "1.0.0",
    "author": "Developer",
    "icon": "🚀",
    "kimuVersion": "1.0.0",
    "dependencies": ["core-utils"],
    "permissions": ["storage", "network"],
    "category": "utility"
  }
]
```

## Proprietà del Manifest

### Proprietà Obbligatorie

#### `tag`
- **Tipo**: `string`
- **Descrizione**: Nome del custom element HTML
- **Formato**: kebab-case (es. `my-extension`)
- **Unico**: Deve essere univoco nel sistema

```json
{
  "tag": "my-extension"
}
```

#### `path`
- **Tipo**: `string`
- **Descrizione**: Percorso relativo alla cartella dell'estensione
- **Base**: Relativo a `src/extensions/`

```json
{
  "path": "my-extension"
}
```

#### `name`
- **Tipo**: `string`
- **Descrizione**: Nome leggibile dell'estensione
- **Utilizzo**: Mostrato nell'interfaccia utente

```json
{
  "name": "My Extension"
}
```

#### `version`
- **Tipo**: `string`
- **Descrizione**: Versione dell'estensione
- **Formato**: Semantic Versioning (es. `1.2.3`)

```json
{
  "version": "1.0.0"
}
```

#### `kimuVersion`
- **Tipo**: `string`
- **Descrizione**: Versione minima di KIMU richiesta
- **Controllo**: Verificata al caricamento

```json
{
  "kimuVersion": "1.0.0"
}
```

### Proprietà Opzionali

#### `internal`
- **Tipo**: `boolean`
- **Default**: `false`
- **Descrizione**: Indica se è un'estensione interna al framework
- **Uso**: Le estensioni interne hanno privilegi speciali

```json
{
  "internal": true
}
```

#### `description`
- **Tipo**: `string`
- **Descrizione**: Descrizione dettagliata delle funzionalità
- **Utilizzo**: Help, documentazione, store di estensioni

```json
{
  "description": "Una estensione per gestire le notifiche"
}
```

#### `author`
- **Tipo**: `string`
- **Descrizione**: Autore o organizzazione sviluppatrice

```json
{
  "author": "UnicòVerso"
}
```

#### `icon`
- **Tipo**: `string`
- **Descrizione**: Emoji o icona rappresentativa
- **Utilizzo**: Interfaccia utente, liste di estensioni

```json
{
  "icon": "🔔"
}
```

#### `category`
- **Tipo**: `string`
- **Descrizione**: Categoria funzionale dell'estensione
- **Valori**: `core`, `ui`, `utility`, `data`, `integration`

```json
{
  "category": "utility"
}
```

#### `dependencies`
- **Tipo**: `string[]`
- **Descrizione**: Lista delle estensioni richieste
- **Controllo**: Verificate al caricamento

```json
{
  "dependencies": ["core-utils", "ui-components"]
}
```

#### `permissions`
- **Tipo**: `string[]`
- **Descrizione**: Permessi richiesti dall'estensione
- **Valori**: `storage`, `network`, `filesystem`, `notifications`

```json
{
  "permissions": ["storage", "network"]
}
```

#### `config`
- **Tipo**: `object`
- **Descrizione**: Configurazione predefinita dell'estensione

```json
{
  "config": {
    "theme": "light",
    "autoStart": true,
    "maxItems": 10
  }
}
```

#### `assets`
- **Tipo**: `string[]`
- **Descrizione**: Lista degli asset da pre-caricare

```json
{
  "assets": ["icons/logo.svg", "styles/theme.css"]
}
```

#### `lazy`
- **Tipo**: `boolean`
- **Default**: `true`
- **Descrizione**: Se true, l'estensione viene caricata on-demand

```json
{
  "lazy": false
}
```

#### `priority`
- **Tipo**: `number`
- **Default**: `0`
- **Descrizione**: Priorità di caricamento (numeri più alti = priorità maggiore)

```json
{
  "priority": 10
}
```

## Esempio Completo

```json
{
  "tag": "notification-manager",
  "path": "notification-manager",
  "internal": false,
  "name": "Notification Manager", 
  "description": "Gestisce le notifiche dell'applicazione con supporto per diversi tipi e persistenza",
  "version": "2.1.0",
  "author": "UnicòVerso Team",
  "icon": "🔔",
  "kimuVersion": "1.0.0",
  "category": "utility",
  "dependencies": ["core-storage"],
  "permissions": ["storage", "notifications"],
  "lazy": true,
  "priority": 5,
  "config": {
    "maxNotifications": 50,
    "autoClose": true,
    "closeDelay": 5000,
    "position": "top-right",
    "enableSound": false
  },
  "assets": [
    "icons/notification.svg",
    "sounds/notification.mp3"
  ],
  "keywords": ["notifications", "alerts", "messages"],
  "homepage": "https://docs.kimu.dev/extensions/notification-manager",
  "repository": "https://github.com/unicoverso/kimu-extensions",
  "license": "MPL-2.0"
}
```

## Validazione del Manifest

### Schema TypeScript

```typescript
interface ExtensionManifest {
  // Proprietà obbligatorie
  tag: string;
  path: string;
  name: string;
  version: string;
  kimuVersion: string;
  
  // Proprietà opzionali
  internal?: boolean;
  description?: string;
  author?: string;
  icon?: string;
  category?: 'core' | 'ui' | 'utility' | 'data' | 'integration';
  dependencies?: string[];
  permissions?: Permission[];
  lazy?: boolean;
  priority?: number;
  config?: Record<string, any>;
  assets?: string[];
  keywords?: string[];
  homepage?: string;
  repository?: string;
  license?: string;
}

type Permission = 'storage' | 'network' | 'filesystem' | 'notifications';
```

### Validazione Runtime

```typescript
function validateManifest(manifest: any): ExtensionManifest {
  // Controlli obbligatori
  if (!manifest.tag || typeof manifest.tag !== 'string') {
    throw new Error('Tag is required and must be a string');
  }
  
  if (!manifest.tag.match(/^[a-z][a-z0-9-]*$/)) {
    throw new Error('Tag must be kebab-case');
  }
  
  if (!manifest.version || !isValidSemVer(manifest.version)) {
    throw new Error('Valid semantic version is required');
  }
  
  // Controlli dipendenze
  if (manifest.dependencies) {
    validateDependencies(manifest.dependencies);
  }
  
  return manifest as ExtensionManifest;
}
```

## Gestione delle Versioni

### Compatibilità

```typescript
function isCompatibleVersion(
  required: string, 
  current: string
): boolean {
  const [reqMajor, reqMinor] = required.split('.').map(Number);
  const [curMajor, curMinor] = current.split('.').map(Number);
  
  // Major version deve corrispondere
  if (reqMajor !== curMajor) {
    return false;
  }
  
  // Minor version deve essere >= richiesta
  return curMinor >= reqMinor;
}
```

### Aggiornamenti

```typescript
interface UpdateInfo {
  currentVersion: string;
  availableVersion: string;
  updateType: 'major' | 'minor' | 'patch';
  breaking: boolean;
  changelog: string;
}

function checkForUpdates(manifest: ExtensionManifest): Promise<UpdateInfo | null> {
  // Logica di controllo aggiornamenti
}
```

## Caricamento del Manifest

### KimuExtensionManager

```typescript
class KimuExtensionManager {
  private async loadManifest(): Promise<ExtensionManifest[]> {
    const response = await fetch('/src/extensions/extensions-manifest.json');
    const manifests = await response.json();
    
    return manifests.map(validateManifest);
  }
  
  private async processManifest(manifest: ExtensionManifest) {
    // Controlla compatibilità versione
    if (!this.isCompatibleVersion(manifest.kimuVersion)) {
      console.warn(`Extension ${manifest.tag} requires KIMU ${manifest.kimuVersion}`);
      return;
    }
    
    // Controlla dipendenze
    if (!await this.checkDependencies(manifest.dependencies)) {
      console.error(`Extension ${manifest.tag} has unmet dependencies`);
      return;
    }
    
    // Registra l'estensione
    this.registerExtension(manifest);
  }
}
```

## Best Practices

1. **Versioning**: Usa semantic versioning per chiarezza
2. **Dipendenze**: Minimizza le dipendenze per ridurre la complessità
3. **Permessi**: Richiedi solo i permessi strettamente necessari
4. **Descrizioni**: Scrivi descrizioni chiare e utili
5. **Categorizzazione**: Usa categorie appropriate per facilitare la discovery
6. **Lazy Loading**: Abilita il lazy loading per performance migliori
7. **Configurazione**: Fornisci configurazioni predefinite sensate

## Strumenti di Sviluppo

### Generatore di Manifest

```bash
node scripts/generate-manifest.js my-extension
```

### Validatore

```bash
node scripts/validate-manifest.js
```

### Updater

```bash
node scripts/update-manifest.js my-extension --version 1.2.0
```

## Riferimenti

- [Creare un'Estensione](./creating-extensions.md)
- [Extension Lifecycle](./extension-lifecycle.md)
- [Build e Deployment](./build-deployment.md)
- [KimuExtensionManager](../core/kimu-extension-manager.md)
