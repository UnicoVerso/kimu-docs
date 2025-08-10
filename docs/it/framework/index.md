# Riferimenti Framework

Documentazione tecnica completa del framework KIMU per sviluppatori.

## 🧠 Classi Core

Le classi fondamentali che costituiscono il cuore del framework:

- **[KimuApp](./core/kimu-app.md)** - Singleton per configurazione e lifecycle dell'applicazione
- **[KimuComponentElement](./core/kimu-component-element.md)** - Classe base per tutti i componenti
- **[KimuEngine](./core/kimu-engine.md)** - Motore di rendering e gestione template
- **[KimuExtensionManager](./core/kimu-extension-manager.md)** - Gestore dinamico delle estensioni
- **[KimuRender](./core/kimu-render.md)** - Sistema di rendering basato su Lit
- **[KimuAssetManager](./core/kimu-asset-manager.md)** - Gestione asset e risorse
- **[KimuStore](./core/kimu-store.md)** - Persistenza dati con IndexedDB

## 🏷️ Decoratori

Decoratori per la registrazione e configurazione dei componenti:

- **[@KimuComponent](./decorators/kimu-component.md)** - Decorator per registrazione Web Components

## 📋 Tipi e Interfacce

Definizioni TypeScript per tipizzazione e metadata:

- **[KimuExtensionMeta](./types/kimu-extension-meta.md)** - Metadata delle estensioni
- **[KimuAsset](./types/kimu-asset.md)** - Tipi per asset e risorse
- **[KimuLang](./types/kimu-lang.md)** - Configurazione lingue supportate

## 🧩 Sistema di Estensioni

Guida completa al sistema modulare di KIMU:

- **[Panoramica Estensioni](./extensions/index.md)** - Introduzione al sistema di estensioni
- **[Creare un'Estensione](./extensions/creating-extensions.md)** - Guida passo-passo per sviluppare estensioni
- **[Lifecycle delle Estensioni](./extensions/extension-lifecycle.md)** - Ciclo di vita completo delle estensioni
- **[Manifest delle Estensioni](./extensions/extension-manifest.md)** - Configurazione e metadati
- **[Build e Deployment](./extensions/build-deployment.md)** - Compilazione e distribuzione
- **[Best Practices](./extensions/best-practices.md)** - Linee guida e pratiche consigliate

## 🏗️ Pattern Architetturali

Pattern e best practices utilizzati nel framework:

- **[Panoramica Pattern](./patterns/index.md)** - Introduzione ai pattern architetturali
- **[Singleton Pattern](./patterns/singleton-pattern.md)** - Gestione istanze uniche nel framework
- **[Observer Pattern](./patterns/observer-pattern.md)** - Sistema di notifiche e comunicazione
- **[Asset Loading Pattern](./patterns/asset-loading.md)** - Caricamento efficiente delle risorse

---

## 🎯 Come Utilizzare questa Sezione

Questa documentazione è organizzata per:

- **Sviluppatori** che vogliono estendere KIMU
- **Contributori** che vogliono migliorare il framework
- **Architetti** che vogliono comprendere il design interno

Ogni sezione include:
- Descrizione completa della funzionalità
- Esempi di codice pratici
- Best practices e pattern
- Link di approfondimento

> 💡 **Suggerimento**: Inizia con [KimuApp](./core/kimu-app.md) per comprendere l'architettura generale, poi esplora [KimuComponentElement](./core/kimu-component-element.md) per imparare a creare componenti.
