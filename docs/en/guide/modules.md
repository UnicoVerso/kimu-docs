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
