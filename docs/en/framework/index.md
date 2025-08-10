# Framework Reference

Complete technical documentation of the KIMU framework for developers.

## 🧠 Core Classes

The fundamental classes that constitute the heart of the framework:

- **[KimuApp](./core/kimu-app.md)** - Singleton for application configuration and lifecycle
- **[KimuComponentElement](./core/kimu-component-element.md)** - Base class for all components
- **[KimuEngine](./core/kimu-engine.md)** - Rendering engine and template management
- **[KimuExtensionManager](./core/kimu-extension-manager.md)** - Dynamic extension manager
- **[KimuRender](./core/kimu-render.md)** - Lit-based rendering system
- **[KimuAssetManager](./core/kimu-asset-manager.md)** - Asset and resource management
- **[KimuStore](./core/kimu-store.md)** - Data persistence with IndexedDB

## 🏷️ Decorators

Decorators for component registration and configuration:

- **[@KimuComponent](./decorators/kimu-component.md)** - Decorator for Web Components registration

## 📋 Types and Interfaces

TypeScript definitions for typing and metadata:

- **[KimuExtensionMeta](./types/kimu-extension-meta.md)** - Extension metadata
- **[KimuAsset](./types/kimu-asset.md)** - Asset and resource types
- **[KimuLang](./types/kimu-lang.md)** - Supported language configuration

## 🧩 Extension System

Complete guide to KIMU's modular system:

- **[Extension Overview](./extensions/index.md)** - Introduction to the extension system
- **[Creating an Extension](./extensions/creating-extensions.md)** - Step-by-step guide to develop extensions
- **[Extension Lifecycle](./extensions/extension-lifecycle.md)** - Complete extension lifecycle
- **[Extension Manifest](./extensions/extension-manifest.md)** - Configuration and metadata
- **[Build and Deployment](./extensions/build-deployment.md)** - Compilation and distribution
- **[Best Practices](./extensions/best-practices.md)** - Guidelines and recommended practices

## 🏗️ Architectural Patterns

Patterns and best practices used in the framework:

- **[Pattern Overview](./patterns/index.md)** - Introduction to architectural patterns
- **[Singleton Pattern](./patterns/singleton-pattern.md)** - Managing unique instances in the framework
- **[Observer Pattern](./patterns/observer-pattern.md)** - Notification and communication system
- **[Asset Loading Pattern](./patterns/asset-loading.md)** - Efficient resource loading

---

## 🎯 How to Use This Section

This documentation is organized for:

- **Developers** who want to extend KIMU
- **Contributors** who want to improve the framework
- **Architects** who want to understand the internal design

Each section includes:
- Complete functionality description
- Practical code examples
- Best practices and patterns
- Reference links

> 💡 **Tip**: Start with [KimuApp](./core/kimu-app.md) to understand the general architecture, then explore [KimuComponentElement](./core/kimu-component-element.md) to learn how to create components.
