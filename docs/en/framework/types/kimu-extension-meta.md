# KimuExtensionMeta

TypeScript interface that defines metadata and configuration for KIMU extensions.

## Description

`KimuExtensionMeta` is the central interface for defining KIMU extension properties. It is used in:

- **@KimuComponent Decorator**: Component configuration
- **JSON Manifest**: Available extensions definition
- **ExtensionManager**: Runtime extension management
- **Persistent Store**: Metadata storage in IndexedDB

## Complete Definition

```typescript
interface KimuExtensionMeta {
  tag: string;              // Unique identifier and HTML tag
  name: string;             // Descriptive name for UI
  version?: string;         // Component version (semver)
  description?: string;     // Functionality description
  author?: string;          // Author or team
  icon?: string;            // Emoji icon or path
  source?: string;          // Origin: 'local' | 'git' | 'marketplace'
  link?: string;            // Documentation/repository URL
  path?: string;            // Base path for resources
  basePath?: string;        // Calculated path (internal)
  kimuVersion?: string;     // Required KIMU version
  enabled?: boolean;        // If extension is enabled
  installed?: boolean;      // If extension is installed
  internal?: boolean;       // If internal to framework
  template?: string;        // HTML template path
  style?: string;           // CSS file path
  external?: KimuGroupAsset; // External assets to load
  dependencies?: string[];  // Dependent extensions
  languages?: KimuExtensionLanguages; // i18n configuration
}
```

## Properties

### Identification

#### `tag: string` *(required)*

Unique extension identifier and Web Component HTML tag name.

**Rules:**
- Must contain at least one dash (Web Components standard)
- Should be globally unique
- Used as primary key in database

**Examples:**
```typescript
{
  tag: "user-profile"        // <user-profile></user-profile>
}

{
  tag: "myapp-data-chart"    // With namespace to avoid conflicts
}
```

#### `name: string` *(required)*

Descriptive extension name for user interfaces and documentation.

**Examples:**
```typescript
{
  tag: "user-widget",
  name: "User Profile Widget"
}

{
  tag: "chart-component", 
  name: "Interactive Data Chart Component"
}
```

### Versioning

#### `version?: string`

Extension version (semantic versioning format recommended).

**Recommended format:** `MAJOR.MINOR.PATCH`

**Examples:**
```typescript
{
  tag: "my-component",
  version: "1.0.0"      // First stable release
}

{
  tag: "beta-feature",
  version: "2.1.0-beta.3"  // Pre-release
}
```

#### `kimuVersion?: string`

Minimum KIMU version required for the extension.

**Examples:**
```typescript
{
  tag: "advanced-widget",
  kimuVersion: "1.2.0"  // Requires KIMU 1.2.0+
}
```

### Descriptive Metadata

#### `description?: string`

Detailed description of extension functionality.

**Examples:**
```typescript
{
  tag: "search-component",
  name: "Smart Search",
  description: "Advanced search component with autocomplete, filters and real-time results"
}
```

#### `author?: string`

Author, team or organization responsible for the extension.

**Examples:**
```typescript
{
  tag: "company-widget",
  author: "Frontend Team - Acme Corp"
}

{
  tag: "open-component", 
  author: "Community Contributors"
}
```

#### `icon?: string`

Icon to represent the extension (emoji, Unicode, or path).

**Examples:**
```typescript
{
  tag: "notification-bell",
  icon: "🔔"           // Emoji
}

{
  tag: "user-profile",
  icon: "👤"           // Unicode
}

{
  tag: "custom-widget",
  icon: "assets/widget-icon.svg"  // Relative path
}
```

### Origin and Links

#### `source?: string`

Extension origin type.

**Supported values:**
- `'local'` - Developed locally
- `'git'` - From Git repository
- `'marketplace'` - From extensions marketplace

**Examples:**
```typescript
{
  tag: "custom-component",
  source: "local"
}

{
  tag: "community-widget",
  source: "git"
}
```

#### `link?: string`

URL for documentation, repository or extension website.

**Examples:**
```typescript
{
  tag: "open-widget",
  link: "https://github.com/username/kimu-widget"
}

{
  tag: "docs-component",
  link: "https://docs.example.com/components/docs-component"
}
```

### Paths and Resources

#### `path?: string`

Base path for extension resources (templates, styles, assets).

**Default:** `extensions/${tag}`

**Examples:**
```typescript
{
  tag: "user-card",
  path: "components/user-card"
  // Resources in: /extensions/components/user-card/
}

{
  tag: "admin-panel",
  path: "admin/panels/main"
  // Resources in: /extensions/admin/panels/main/
}
```

#### `basePath?: string` *(calculated)*

Complete path calculated automatically (internal use).

#### `template?: string`

HTML template file name.

**Default:** `"view.html"`

**Examples:**
```typescript
{
  tag: "custom-view",
  template: "custom-template.html"
}

{
  tag: "multi-view",
  template: "main-view.html"
}
```

#### `style?: string`

CSS file name for styles.

**Default:** `"style.css"`

**Examples:**
```typescript
{
  tag: "themed-component",
  style: "dark-theme.css"
}

{
  tag: "responsive-widget",
  style: "responsive-styles.css"
}
```

### Extension State

#### `enabled?: boolean`

Indicates if the extension is enabled.

**Default:** `true`

**Examples:**
```typescript
{
  tag: "experimental-feature",
  enabled: false    // Disabled by default
}

{
  tag: "production-widget",
  enabled: true     // Enabled
}
```

#### `installed?: boolean`

Indicates if the extension is installed in the system.

**Default:** `false`

#### `internal?: boolean`

Indicates if the extension is internal to the framework (not visible to users).

**Default:** `false`

**Examples:**
```typescript
{
  tag: "kimu-core-utils",
  internal: true    // Internal utility
}

{
  tag: "user-component",
  internal: false   // Visible to users
}
```

### External Assets

#### `external?: KimuGroupAsset`

Defines external assets (CSS/JS) to load automatically.

**Structure:**
```typescript
{
  external: {
    css: [
      { path: "https://cdn.example.com/styles.css", id: "external-styles" }
    ],
    js: [
      { path: "https://cdn.example.com/library.js", id: "external-lib" }
    ]
  }
}
```

### Dependencies

#### `dependencies?: string[]`

List of required extension tags (loaded automatically).

**Examples:**
```typescript
{
  tag: "advanced-form",
  dependencies: [
    "input-validator",
    "date-picker", 
    "file-uploader"
  ]
}

{
  tag: "dashboard-widget",
  dependencies: [
    "chart-library",
    "data-fetcher"
  ]
}
```

### Internationalization

#### `languages?: KimuExtensionLanguages`

Configuration for multilingual support.

**Structure:**
```typescript
{
  languages: {
    default: "en",
    supported: {
      "en": { code: "en", name: "English", file: "en.json" },
      "it": { code: "it", name: "Italiano", file: "it.json" },
      "es": { code: "es", name: "Español", file: "es.json" }
    }
  }
}
```

## Complete Examples

### Basic Extension

```typescript
const basicExtension: KimuExtensionMeta = {
  tag: "hello-world",
  name: "Hello World Component",
  version: "1.0.0",
  description: "Sample component for KIMU introduction",
  author: "KIMU Team",
  icon: "👋"
};
```

### Advanced Extension

```typescript
const advancedExtension: KimuExtensionMeta = {
  tag: "data-dashboard",
  name: "Advanced Data Dashboard",
  version: "2.3.1",
  description: "Complete dashboard for data visualization and analysis with interactive charts",
  author: "Data Analytics Team",
  icon: "📊",
  source: "git",
  link: "https://github.com/company/data-dashboard",
  path: "dashboards/advanced-data",
  kimuVersion: "1.1.0",
  enabled: true,
  template: "dashboard-view.html",
  style: "dashboard-theme.css",
  external: {
    css: [
      { path: "https://cdn.chartjs.org/chart.js/3.9.1/chart.min.css", id: "chartjs-css" }
    ],
    js: [
      { path: "https://cdn.chartjs.org/chart.js/3.9.1/chart.min.js", id: "chartjs-lib" }
    ]
  },
  dependencies: [
    "data-fetcher",
    "export-utils",
    "notification-system"
  ],
  languages: {
    default: "en",
    supported: {
      "en": { code: "en", name: "English", file: "en.json" },
      "it": { code: "it", name: "Italiano", file: "it.json" }
    }
  }
};
```

### System Extension

```typescript
const systemExtension: KimuExtensionMeta = {
  tag: "kimu-error-handler",
  name: "KIMU Error Handler",
  version: "1.0.0",
  description: "Central error handling system for the framework",
  author: "KIMU Core Team", 
  icon: "⚠️",
  path: "system/error-handler",
  internal: true,  // Not visible to users
  enabled: true,
  kimuVersion: "1.0.0"
};
```

## Usage in Manifest

The extensions manifest (`extensions-manifest.json`) contains an array of `KimuExtensionMeta`:

```json
[
  {
    "tag": "kimu-home",
    "name": "KIMU Home Main App", 
    "version": "1.0.0",
    "path": "kimu-home",
    "internal": true,
    "author": "UnicòVerso",
    "icon": "🏠"
  },
  {
    "tag": "user-widget",
    "name": "User Widget",
    "version": "1.2.0", 
    "path": "widgets/user",
    "description": "Widget for user profile management",
    "dependencies": ["icon-library"]
  }
]
```

## Validation and Security

### Required Validation

```typescript
function validateExtensionMeta(meta: KimuExtensionMeta): boolean {
  // Required and valid tag
  if (!meta.tag || !meta.tag.includes('-')) {
    throw new Error('Tag required and must contain a dash');
  }
  
  // Required name
  if (!meta.name) {
    throw new Error('Name required');
  }
  
  // Valid version if present
  if (meta.version && !isValidSemver(meta.version)) {
    throw new Error('Invalid version format');
  }
  
  return true;
}
```

### Path Sanitization

```typescript
function sanitizePaths(meta: KimuExtensionMeta): KimuExtensionMeta {
  return {
    ...meta,
    path: meta.path?.replace(/[^a-zA-Z0-9\/\-_]/g, ''),
    template: meta.template?.replace(/[^a-zA-Z0-9\-_.]/g, ''),
    style: meta.style?.replace(/[^a-zA-Z0-9\-_.]/g, '')
  };
}
```

## Best Practices

### ✅ Naming Convention

```typescript
{
  tag: "myapp-user-profile",      // Namespace to avoid conflicts
  name: "User Profile Component", // Descriptive name
  version: "1.2.3"               // Semantic versioning
}
```

### ✅ Complete Documentation

```typescript
{
  tag: "data-table",
  name: "Advanced Data Table",
  description: "Data table with sorting, filtering, pagination and export",
  author: "Frontend Team",
  version: "2.1.0",
  link: "https://docs.company.com/components/data-table"
}
```

### ✅ Dependency Management

```typescript
{
  tag: "complex-widget",
  dependencies: [
    "base-utils",     // Base utilities always needed
    "ui-components"   // Reusable UI components
  ],
  kimuVersion: "1.0.0"  // Framework compatibility
}
```

### ✅ Asset Management

```typescript
{
  tag: "chart-widget",
  external: {
    css: [
      { path: "https://cdn.chartjs.org/chart.min.css", id: "chart-css" }
    ],
    js: [
      { path: "https://cdn.chartjs.org/chart.min.js", id: "chart-js" }
    ]
  }
}
```

## See Also

- **[@KimuComponent](../decorators/kimu-component.md)** - Decorator that uses this interface
- **[KimuAsset](./kimu-asset.md)** - Types for external assets
- **[KimuLang](./kimu-lang.md)** - Language configuration
- **[Manifest](../extensions/manifest.md)** - Extension manifest structure
