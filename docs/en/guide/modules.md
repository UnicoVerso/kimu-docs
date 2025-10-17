# Modules

## What is a Module?
A module is a "container" that collects everything needed for a specific feature or area of the application. It helps organize reusable and shared code.

> **Note:** A module can export multiple services, helpers, constants, providers, etc. A service is a single class/function with a specific responsibility.

### What can a module contain?
- **Services**: classes with a specific responsibility (e.g., data management, localization, authentication)
- **Helpers**: support functions to simplify common operations
- **APIs**: public methods to interact with the module
- **Data providers**: classes or functions that provide data to the application
- **Constants and configurations**: static values, options, settings
- **Resources**: data files, localized strings, templates

Modules are designed to be imported and used by extensions, components, and other modules. The typical structure is a dedicated folder (e.g., `/src/modules/`) containing everything needed for the functionality.

---

## How to create a new module
1. Create a folder in `/src/modules/` (e.g., `my-module/`)
2. Create a `module.ts` or `index.ts` file that exports services and public APIs
3. Implement one or more services, helpers, constants, resources
4. (Optional) Register the module in the manifest if required

**Example structure:**
```
src/
  modules/
    my-module/
      my-service.ts
      helpers.ts
      config.ts
      module.ts
```

---

## Module Management with the Module Manager

KIMU-Core includes a Module Manager that allows you to dynamically load and use modules in a centralized way. This keeps the core lightweight and makes it easy to extend functionality.

### Example: Loading the i18n module

```typescript
const i18nModule = await app.moduleManager.loadModule('i18n');
const i18nService = i18nModule.getService();
await i18nService.setLang('en');
console.log(i18nService.translate('welcome'));
```

The Module Manager ensures the module is instantiated only once (singleton) and provides the public services defined by the module itself.

---

### Practical Example of a Module
i18n (internationalization) can include:
- A class `KimuI18nService` that manages languages and translations (service)
- Helper functions to format dates and numbers
- Resource files with localized strings
- Constants for supported languages
All these are exported by the module and can be used by extensions and components via the Module Manager.

---

## What is a Service?
A service is a class or function that performs a single responsibility (e.g., translation, data management, authentication). Services are designed to be reusable, testable, and easily replaceable.

### Practical Example of a Service
`KimuI18nService` is a class that exposes methods like `translate(key)`, `setLang(lang)`, `getLang()`. It is instantiated only once and used wherever translation is needed.

---

## Other Features in Modules
Besides services, a module can export:
- Helper functions (e.g., `formatDate`, `parseNumber`)
- Data providers (e.g., `LocaleProvider`)
- Constants and configurations (e.g., `SUPPORTED_LANGUAGES`)
- Resource files (e.g., `translations.json`)

---

## Example Structure
```
src/
  core/
    kimu-module-manager.ts   // module manager
  modules/
    i18n/
      kimu-i18n-service.ts   // i18n service
      module.ts              // module entrypoint
      helpers.ts             // support functions
      resources.json         // data
      index.ts               // exports everything
```

---

## Best practices
- Keep base services in modules.
- Use the Module Manager to integrate and scale features.
- Leverage modularity to add, replace, or update features without changing the core or extensions.

---

## FAQ
- **Can I have multiple services in a module?** Yes, you can export multiple classes/functions.
- **How do I share data between modules?** Through public services or events.
- **Are modules always loaded?** No, they are loaded only when needed (lazy loading).

---

## Glossary
- **Module**: container of services, helpers, constants, resources.
- **Service**: class/function with a single responsibility.
- **Provider**: data or resource provider.
- **Helper**: support function.

---

# Advanced Modular Management in KIMU-Core

## Module Management System

KIMU-Core adopts an advanced system for managing optional modules via a central repository, automated scripts, and dedicated manifests. This allows you to install/remove modules without modifying the core and keeps the build lightweight and customized.

### Directory Structure

```
kimu-core/
├── src/
│   ├── modules/                  # Active modules (included in the build)
│   │   ├── modules-manifest.json # List of installed modules
│   │   ├── i18n/                 # i18n module (default installed)
│   │   └── .gitkeep
│   └── modules-repository/       # Repository of available modules (NOT in build)
│       ├── router/               # Router module available
│       │   ├── module.ts
│       │   ├── router.ts
│       │   ├── manifest.json
│       │   └── README.md
│       └── ...                   # Other future modules
└── scripts/
    ├── install-module.js         # Module installation script
    ├── remove-module.js          # Module removal script
    └── list-modules.js           # Module listing script
```

### Main Commands

- `npm run list:modules` — Shows installed and available modules
- `npm run install:module <name>` — Installs a module from the repository
- `npm run remove:module <name>` — Removes an installed module

### How It Works

- **Installation:**
  1. The module is copied from `modules-repository/<name>` to `modules/<name>`
  2. `modules-manifest.json` is updated
  3. The module will be included in the next build

- **Removal:**
  1. The module folder is deleted from `modules/<name>`
  2. `modules-manifest.json` is updated
  3. The module remains available in the repository for future installations

### Example Central Manifest

```json
{
  "installedModules": [
    {
      "name": "i18n",
      "version": "1.0.0",
      "path": "i18n",
      "installedAt": "2025-01-17T00:00:00.000Z"
    },
    {
      "name": "router",
      "version": "1.0.0",
      "path": "router",
      "installedAt": "2025-10-17T20:20:55.120Z"
    }
  ],
  "availableModules": [],
  "lastUpdate": "2025-10-17T20:20:55.120Z"
}
```

## Module Manifest

The manifest of a KIMU module is a `manifest.json` file that describes all the essential information for management, installation, and compatibility. It is fundamental for the operation of installation/removal scripts and for correct inclusion in the build.

### Structure and Fields of the Manifest

Generic example:
```json
{
  "name": "module-name",
  "version": "1.0.0",
  "description": "Detailed description of the module",
  "author": "Author or team",
  "license": "MPL-2.0",
  "dependencies": [],
  "kimuCoreVersion": "^0.3.0",
  "keywords": ["keywords", "module"],
  "repository": {
    "type": "git",
    "url": "https://github.com/UnicoVerso/kimu-core",
    "directory": "src/modules/module-name"
  }
}
```

#### Required fields
- `name`: Unique name of the module (e.g. "i18n", "router")
- `version`: Semantic version of the module (e.g. "1.0.0")
- `description`: Short description of the functionality
- `author`: Author or development team
- `license`: Module license (e.g. "MPL-2.0")
- `dependencies`: Array of names of other required modules (can be empty)
- `kimuCoreVersion`: Minimum compatible version of kimu-core

#### Optional fields
- `keywords`: Keywords for search and categorization
- `repository`: Information about the GitHub repository or other VCS

### Example i18n Manifest
```json
{
  "name": "i18n",
  "version": "1.0.0",
  "description": "Internationalization module for KIMU applications with multi-language support and dynamic translation system",
  "author": "KIMU Team",
  "license": "MPL-2.0",
  "dependencies": [],
  "kimuCoreVersion": "^0.3.0",
  "keywords": ["i18n", "internationalization", "localization", "translation", "multilingual", "language"],
  "repository": {
    "type": "git",
    "url": "https://github.com/UnicoVerso/kimu-core",
    "directory": "src/modules/i18n"
  }
}
```

### Manifest Usage
- The installation/removal scripts read the manifest to check compatibility, dependencies, and information to display to the user.
- The manifest is used to update the central manifest (`modules-manifest.json`) after each installation/removal.
- Fields like `dependencies` and `kimuCoreVersion` will allow future automatic dependency resolution and version checking.

### Best Practices for Creation
- Always fill in all required fields.
- Update the version for every significant change to the module.
- Use clear descriptions and useful keywords.
- Document any dependencies on other modules.
- Keep the manifest updated and consistent with the module code.

### Manifest Checklist
- [x] Unique name
- [x] Semantic version
- [x] Clear description
- [x] Author and license
- [x] Dependencies (if present)
- [x] Minimum kimu-core version
- [x] Keywords and repository (optional)

---

### Best Practices

- Never modify `modules-repository/` directly
- Install only the modules you need to reduce build size
- Always commit `modules-manifest.json` to track used modules
- Use only the provided scripts to install/remove modules
- Document dependencies in the module manifest

### Developer Workflow

1. Create a new module in `modules-repository/`
2. Test installation with `npm run install:module <name>`
3. Develop and test
4. Remove with `npm run remove:module <name>`
5. The module remains available in the repository

### User Workflow

1. See available modules with `npm run list:modules`
2. Install only what you need
3. Build with only the installed modules

### Advantages

- Lighter and customized build
- Optional and easily managed modules
- Central repository always intact
- Simplified development and testing

### Usage Examples

```bash
# New project - only core + i18n
npm run build                    # ~50KB

# Add router
npm run install:module router
npm run build                    # ~58KB

# Remove router
npm run remove:module router
npm run build                    # ~50KB
```

### Module FAQ

- **Can I install/remove modules without touching the core?** Yes, everything happens via scripts and repository.
- **Are modules included in the build only if installed?** Yes, the build reads only active modules.
- **Can I create custom modules?** Yes, just follow the structure and add the manifest.

---

For details and the complete guide, also see:
- [docs/MODULE_MANAGEMENT.md] in the kimu-core project
- [src/modules/README.md] and [src/modules-repository/README.md] in the kimu-core project

---

**This section is updated with all rules and workflows for KIMU-Core module management.**
