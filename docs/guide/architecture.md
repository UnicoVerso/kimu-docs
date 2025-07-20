# Architecture

KIMU-CORE is designed to be lightweight, modular, and highly extensible.
This section describes the internal structure, main components, and how they interact to provide a minimal yet powerful UI framework.


## 📁 Project Structure

```
src/
  core/
    kimu-app.ts
    kimu-component.ts
    kimu-component-element.ts
    kimu-engine.ts
    kimu-render.ts
    kimu-asset-manage.ts
    kimu-extension-manager.ts
    kimu-store.ts
    kimu-types.ts
  extensions/
    extensions-manifest.json
    kimu-app/
      component.ts
      view.html
      style.css
  config/
  assets/
  index.html
  main.ts
```


## 🧩 Main Components

- **KimuComponentElement**  
  The base class for all components. Provides lifecycle, rendering, and state management.

- **KimuComponent (decorator)**  
  Used to define metadata for components and extensions (tag, name, version, etc.).

- **KimuApp**  
  The main application container, implemented as an extension.

- **KimuEngine**  
  The core engine that initializes the app, manages the main loop, and coordinates components.

- **KimuRender**  
  Responsible for rendering logic and updating the DOM efficiently.

- **KimuAssetManage**  
  Manages static assets (images, styles, etc.) and their loading.

- **KimuExtensionManager**  
  Handles registration, loading, and lifecycle of extensions.

- **KimuStore**  
  Provides a minimal state management system.

- **KimuTypes**  
  Contains shared TypeScript types and interfaces used across the framework.

## 🧩 Extensions

- Extensions are modules that add new logic, UI, or features.
- Each extension is a folder with at least:
  - `component.ts` (logic and metadata)
  - `view.html` (UI template)
  - `style.css` (styles)
- Extensions are registered via metadata and loaded dynamically.


## 🔗 Relationships

- All UI elements extend `KimuComponentElement`.
- Extensions use the `@KimuComponent` decorator for registration.
- The `KimuExtensionManager` discovers and loads extensions at runtime.
- The core never depends on extensions, but extensions can use helpers, modules, and services.


## 🛠️ Modularity & Extensibility

- The core is minimal: only essential logic is included.
- Everything else (UI, logic, helpers, services) is added via extensions or modules.
- Helpers and modules can be shared between extensions.


## 🗂️ Configuration & Build

- Uses Vite for development and build.
- TypeScript for type safety and maintainability.
- Extensions and configuration are bundled at build time, but new extensions can be loaded at runtime.


## �️ UML Diagrams

### Main Class Diagram

```mermaid
classDiagram
  KimuComponentElement <|-- KimuApp
  KimuComponentElement <|-- (Other Extensions)
  KimuApp : +metadata
  KimuApp : +render()
  KimuComponentElement : +lifecycle
  KimuComponentElement : +state
  KimuComponent <.. KimuApp : <<decorator>>
  KimuExtensionManager : +registerExtension()
  KimuExtensionManager : +loadExtension()
  KimuEngine : +init()
  KimuEngine : +start()
  KimuEngine --> KimuExtensionManager
  KimuEngine --> KimuStore
  KimuExtensionManager --> KimuComponentElement
  KimuApp --> KimuStore
  KimuStore : +state
```

### Extension Structure

```mermaid
classDiagram
  class ExtensionFolder {
    component.ts
    view.html
    style.css
  }
  ExtensionFolder <|-- KimuApp
  ExtensionFolder <|-- (Other Extensions)
```


## 🧭 Design Principles

- **Minimalism:** Only the essential logic is in the core; everything else is an extension or module.
- **Runtime Extensibility:** New features can be added at runtime without recompiling the core.
- **Separation of Concerns:** UI, logic, and helpers/services are clearly separated.
- **Web Standards:** Uses Web Components and modern JavaScript/TypeScript.


## 🧩 Helpers, Modules & Services

- **Helpers:** Utility functions for formatting, logging, etc. Used by core and extensions.
- **Modules:** Reusable logic blocks (e.g., authentication, data management) that can be shared.
- **Services:** Provide support features (e.g., notifications, i18n, animation) and can be injected into extensions.


## 🔒 Security & Best Practices

- Extensions are sandboxed and loaded dynamically.
- State management is minimal and explicit.
- Follows best practices for modular JavaScript and TypeScript.
