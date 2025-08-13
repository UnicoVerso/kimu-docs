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
    kimu-asset-manager.ts
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
