# Estensioni

Il sistema di estensioni è il cuore del framework KIMU, che permette la modularità e l'estensibilità dell'applicazione. Ogni estensione è un componente autonomo che può essere caricato dinamicamente.

## Panoramica

Le estensioni in KIMU sono Web Components autonomi che seguono uno standard specifico per garantire compatibilità e integrazione seamless con il framework. Ogni estensione viene compilata separatamente e può essere caricata on-demand.

## Struttura delle Estensioni

```
src/extensions/
├── extensions-manifest.json     # Registro di tutte le estensioni
├── nome-estensione/
│   ├── component.ts            # Punto di ingresso principale
│   ├── styles.css             # Stili specifici (opzionale)
│   ├── assets/                # Risorse (immagini, icone, ecc.)
│   └── manifest.json          # Metadati dell'estensione
```

## Manifest delle Estensioni

Il file `extensions-manifest.json` contiene il registro di tutte le estensioni disponibili:

```json
[
  {
    "tag": "kimu-home",
    "path": "kimu-home",
    "internal": true,
    "name": "KIMU Main App",
    "description": "Main interface container",
    "version": "1.0.0",
    "author": "UnicòVerso",
    "icon": "🏠",
    "kimuVersion": "1.0.0"
  }
]
```

### Proprietà del Manifest

- **tag**: Nome del custom element HTML
- **path**: Percorso relativo alla cartella dell'estensione
- **internal**: Indica se è un'estensione interna al framework
- **name**: Nome leggibile dell'estensione
- **description**: Descrizione delle funzionalità
- **version**: Versione dell'estensione
- **author**: Autore o organizzazione
- **icon**: Emoji o icona rappresentativa
- **kimuVersion**: Versione minima di KIMU richiesta

## Lifecycle delle Estensioni

1. **Registrazione**: L'estensione viene registrata nel manifest
2. **Discovery**: KIMU scopre le estensioni disponibili
3. **Loading**: Caricamento lazy quando necessario
4. **Initialization**: Inizializzazione del Web Component
5. **Rendering**: Renderizzazione nell'interfaccia
6. **Cleanup**: Pulizia quando l'estensione viene rimossa

## Documentazione Dettagliata

- [Creare un'Estensione](./creating-extensions.md)
- [Lifecycle delle Estensioni](./extension-lifecycle.md)
- [Manifest delle Estensioni](./extension-manifest.md)
- [Build e Deployment](./build-deployment.md)
- [Best Practices](./best-practices.md)

## Esempi

### Estensione Base

```typescript
import { KimuComponent } from '../../core/kimu-component';

@KimuComponent({
  tag: 'my-extension',
  name: 'My Extension'
})
export class MyExtension extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<h1>Hello from My Extension!</h1>`;
  }
}
```

### Estensione con Stili

```typescript
import { KimuComponent } from '../../core/kimu-component';
import styles from './styles.css?inline';

@KimuComponent({
  tag: 'styled-extension',
  name: 'Styled Extension',
  styles
})
export class StyledExtension extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="container">
        <h1>Styled Extension</h1>
      </div>
    `;
  }
}
```

## Riferimenti

- [KimuExtensionManager](../core/kimu-extension-manager.md)
- [KimuComponent Decorator](../decorators/kimu-component.md)
- [KimuExtensionMeta Type](../types/kimu-extension-meta.md)
