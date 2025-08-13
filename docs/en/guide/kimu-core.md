<p align="center">
  <img src="/images/logo_kimu.png" alt="KIMU Logo" width="180" />
</p>
<br>
<br>

# KIMU-CORE

KIMU-CORE is the technical heart of the KIMU framework—a runtime engine designed to be ultra-minimal, modular, and web-native.


## What is KIMU-CORE?

KIMU-CORE is the lightweight, modular runtime that powers the entire KIMU framework. It's carefully crafted to be:

- **Small**: Core build is less than 20kB
- **Elegant**: Built on native Web Components
- **Self-sufficient**: No external dependencies
- **Modular**: Everything is an extension

> "Minimal doesn't mean limited. It means intentional."


## Core Features

- **Ultra-lightweight**: Less than 20kB, no unnecessary code
- **Web-native**: Built entirely on Web Components and browser standards
- **No dependencies**: Only Lit is used for rendering; no other libraries required
- **Modular**: Every feature is an extension, loaded dynamically
- **Declarative**: UI is built as a sum of independent, composable modules
- **Dynamic extension system**: HTML, JS, and CSS modules are loaded on demand
- **Instant startup**: No heavy initialization, fast and ready
- **State & asset management**: Local state, memory cache, and asset loader included
- **Designed for clarity**: Minimal, readable, and maintainable code

## Main Classes

- `KimuApp`: Singleton for configuration and app lifecycle
- `KimuEngine`: Rendering, template management, dynamic component loading
- `KimuComponentElement`: Base class for all components/extensions
- `KimuComponent` (decorator): Registers Web Components as extensions
- `KimuRender`: Lit-based rendering utilities
- `KimuAssetManager`: Loads and injects assets (CSS, HTML, JS)

## Example: Minimal Extension

```typescript
@KimuComponent({
  tag: 'kimu-home',
  name: 'KIMU Home Main App',
  version: '1.0.0',
  path: 'kimu-home',
})
export class KimuApp extends KimuComponentElement {
  // Minimal component, ready to be extended
}
```

