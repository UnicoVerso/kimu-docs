# Modules

## What is a Module?
A module is a "container" that collects everything needed for a specific feature or area of the application. It helps organize reusable and shared code.

### What can a module contain?
- **Services**: classes with a specific responsibility (e.g., data management, localization, authentication)
- **Helpers**: support functions to simplify common operations
- **APIs**: public methods to interact with the module
- **Data providers**: classes or functions that provide data to the application
- **Constants and configurations**: static values, options, settings
- **Resources**: data files, localized strings, templates

Modules are designed to be imported and used by extensions, components, and other modules. The typical structure is a dedicated folder (e.g., `/src/modules/`) containing everything needed for the functionality.

### Practical Example of a Module
The localization module (`i18n`) can include:
- A class `I18nService` that manages languages and translations (service)
- Helper functions to format dates and numbers
- Resource files with localized strings
- Constants for supported languages
All these are exported by the module and can be used by extensions and components.

---

## What is a Service?
A service is a class or function that performs a single responsibility (e.g., translation, data management, authentication). Services are designed to be reusable, testable, and easily replaceable.

### Practical Example of a Service
`I18nService` is a class that exposes methods like `translate(key)`, `setLanguage(lang)`, `getCurrentLanguage()`. It is instantiated only once and used wherever translation is needed.

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
  modules/
    i18n/
      I18nService.ts   // service
      helpers.ts       // support functions
      resources.json   // data
      index.ts         // exports everything
```
