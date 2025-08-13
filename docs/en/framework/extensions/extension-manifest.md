# Extension Manifest

The extension manifest is the file that defines all available extensions in the KIMU framework. It serves as a central registry for extension discovery and loading.

## Manifest File

The `extensions-manifest.json` file is located in `src/extensions/` and contains an array of objects describing each extension:

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
    "description": "A sample extension",
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

## Manifest Properties

### Required Properties

#### `tag`
- **Type**: `string`
- **Description**: HTML custom element name
- **Format**: kebab-case (e.g., `my-extension`)
- **Unique**: Must be unique in the system

```json
{
  "tag": "my-extension"
}
```

#### `path`
- **Type**: `string`
- **Description**: Relative path to the extension folder
- **Base**: Relative to `src/extensions/`

```json
{
  "path": "my-extension"
}
```

#### `name`
- **Type**: `string`
- **Description**: Human-readable extension name
- **Usage**: Shown in user interface

```json
{
  "name": "My Extension"
}
```

#### `version`
- **Type**: `string`
- **Description**: Extension version
- **Format**: Semantic Versioning (e.g., `1.2.3`)

```json
{
  "version": "1.0.0"
}
```

#### `kimuVersion`
- **Type**: `string`
- **Description**: Minimum required KIMU version
- **Check**: Verified at load time

```json
{
  "kimuVersion": "1.0.0"
}
```

### Optional Properties

#### `internal`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Indicates if it's a framework-internal extension
- **Usage**: Internal extensions have special privileges

```json
{
  "internal": true
}
```

#### `description`
- **Type**: `string`
- **Description**: Detailed description of functionality
- **Usage**: Help, documentation, extension store

```json
{
  "description": "An extension for managing notifications"
}
```

#### `author`
- **Type**: `string`
- **Description**: Author or developing organization

```json
{
  "author": "UnicòVerso"
}
```

#### `icon`
- **Type**: `string`
- **Description**: Representative emoji or icon
- **Usage**: User interface, extension lists

```json
{
  "icon": "🔔"
}
```

#### `category`
- **Type**: `string`
- **Description**: Functional category of the extension
- **Values**: `core`, `ui`, `utility`, `data`, `integration`

```json
{
  "category": "utility"
}
```

#### `dependencies`
- **Type**: `string[]`
- **Description**: List of required extensions
- **Check**: Verified at load time

```json
{
  "dependencies": ["core-utils", "ui-components"]
}
```

#### `permissions`
- **Type**: `string[]`
- **Description**: Permissions required by the extension
- **Values**: `storage`, `network`, `filesystem`, `notifications`

```json
{
  "permissions": ["storage", "network"]
}
```

#### `config`
- **Type**: `object`
- **Description**: Default extension configuration

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
- **Type**: `string[]`
- **Description**: List of assets to preload

```json
{
  "assets": ["icons/logo.svg", "styles/theme.css"]
}
```

#### `lazy`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: If true, the extension is loaded on-demand

```json
{
  "lazy": false
}
```

#### `priority`
- **Type**: `number`
- **Default**: `0`
- **Description**: Loading priority (higher numbers = higher priority)

```json
{
  "priority": 10
}
```

## Complete Example

```json
{
  "tag": "notification-manager",
  "path": "notification-manager",
  "internal": false,
  "name": "Notification Manager", 
  "description": "Manages application notifications with support for different types and persistence",
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

## Manifest Validation

### TypeScript Schema

```typescript
interface ExtensionManifest {
  // Required properties
  tag: string;
  path: string;
  name: string;
  version: string;
  kimuVersion: string;
  
  // Optional properties
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

### Runtime Validation

```typescript
function validateManifest(manifest: any): ExtensionManifest {
  // Required checks
  if (!manifest.tag || typeof manifest.tag !== 'string') {
    throw new Error('Tag is required and must be a string');
  }
  
  if (!manifest.tag.match(/^[a-z][a-z0-9-]*$/)) {
    throw new Error('Tag must be kebab-case');
  }
  
  if (!manifest.version || !isValidSemVer(manifest.version)) {
    throw new Error('Valid semantic version is required');
  }
  
  // Dependency checks
  if (manifest.dependencies) {
    validateDependencies(manifest.dependencies);
  }
  
  return manifest as ExtensionManifest;
}
```

## Version Management

### Compatibility

```typescript
function isCompatibleVersion(
  required: string, 
  current: string
): boolean {
  const [reqMajor, reqMinor] = required.split('.').map(Number);
  const [curMajor, curMinor] = current.split('.').map(Number);
  
  // Major version must match
  if (reqMajor !== curMajor) {
    return false;
  }
  
  // Minor version must be >= required
  return curMinor >= reqMinor;
}
```

### Updates

```typescript
interface UpdateInfo {
  currentVersion: string;
  availableVersion: string;
  updateType: 'major' | 'minor' | 'patch';
  breaking: boolean;
  changelog: string;
}

function checkForUpdates(manifest: ExtensionManifest): Promise<UpdateInfo | null> {
  // Update checking logic
}
```

## Manifest Loading

### KimuExtensionManager

```typescript
class KimuExtensionManager {
  private async loadManifest(): Promise<ExtensionManifest[]> {
    const response = await fetch('/src/extensions/extensions-manifest.json');
    const manifests = await response.json();
    
    return manifests.map(validateManifest);
  }
  
  private async processManifest(manifest: ExtensionManifest) {
    // Check version compatibility
    if (!this.isCompatibleVersion(manifest.kimuVersion)) {
      console.warn(`Extension ${manifest.tag} requires KIMU ${manifest.kimuVersion}`);
      return;
    }
    
    // Check dependencies
    if (!await this.checkDependencies(manifest.dependencies)) {
      console.error(`Extension ${manifest.tag} has unmet dependencies`);
      return;
    }
    
    // Register the extension
    this.registerExtension(manifest);
  }
}
```

## Best Practices

1. **Versioning**: Use semantic versioning for clarity
2. **Dependencies**: Minimize dependencies to reduce complexity
3. **Permissions**: Request only strictly necessary permissions
4. **Descriptions**: Write clear and useful descriptions
5. **Categorization**: Use appropriate categories to facilitate discovery
6. **Lazy Loading**: Enable lazy loading for better performance
7. **Configuration**: Provide sensible default configurations

## Development Tools

### Manifest Generator

```bash
node scripts/generate-manifest.js my-extension
```

### Validator

```bash
node scripts/validate-manifest.js
```

### Updater

```bash
node scripts/update-manifest.js my-extension --version 1.2.0
```

## References

- [Creating an Extension](./creating-extensions.md)
- [Extension Lifecycle](./extension-lifecycle.md)
- [Build and Deployment](./build-deployment.md)
- [KimuExtensionManager](../core/kimu-extension-manager.md)
