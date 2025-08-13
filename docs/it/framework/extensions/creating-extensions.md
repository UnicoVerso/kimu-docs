# Creare un'Estensione

Questa guida ti accompagna passo dopo passo nella creazione di una nuova estensione per il framework KIMU.

## Prerequisiti

- Conoscenza base di TypeScript
- Familiarità con i Web Components
- Framework KIMU configurato e funzionante

## Passo 1: Struttura dell'Estensione

Crea una nuova cartella nella directory `src/extensions/`:

```bash
mkdir src/extensions/my-extension
cd src/extensions/my-extension
```

## Passo 2: File Component Principale

Crea il file `component.ts` che sarà il punto di ingresso:

```typescript
import { KimuComponent } from '../../core/kimu-component';

@KimuComponent({
  tag: 'my-extension',
  name: 'My Extension',
  version: '1.0.0',
  description: 'Una semplice estensione di esempio'
})
export class MyExtension extends HTMLElement {
  private shadowRoot: ShadowRoot;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  private render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        
        .container {
          text-align: center;
        }
        
        .title {
          color: var(--kimu-primary-color, #007acc);
          margin-bottom: 1rem;
        }
        
        .button {
          background: var(--kimu-accent-color, #00d4aa);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        
        .button:hover {
          opacity: 0.8;
        }
      </style>
      
      <div class="container">
        <h2 class="title">My Extension</h2>
        <p>Questa è la mia prima estensione KIMU!</p>
        <button class="button" id="actionBtn">Clicca qui</button>
        <div id="output"></div>
      </div>
    `;
  }

  private setupEventListeners() {
    const button = this.shadowRoot.querySelector('#actionBtn');
    const output = this.shadowRoot.querySelector('#output');

    button?.addEventListener('click', () => {
      if (output) {
        output.innerHTML = `<p>Bottone cliccato alle ${new Date().toLocaleTimeString()}!</p>`;
      }
    });
  }

  private cleanup() {
    // Pulisci event listeners, timer, etc.
    console.log('MyExtension cleanup');
  }
}
```

## Passo 3: Registrare l'Estensione

Aggiungi l'estensione al file `extensions-manifest.json`:

```json
[
  {
    "tag": "kimu-app",
    "path": "kimu-app",
    "internal": true,
    "name": "KIMU Main App",
    "description": "Main interface container",
    "version": "1.0.0",
    "author": "UnicòVerso",
    "icon": "🏠",
    "kimuVersion": "1.0.0"
  },
  {
    "tag": "my-extension",
    "path": "my-extension",
    "internal": false,
    "name": "My Extension",
    "description": "Una semplice estensione di esempio",
    "version": "1.0.0",
    "author": "Il Mio Nome",
    "icon": "🚀",
    "kimuVersion": "1.0.0"
  }
]
```

## Passo 4: Compilare l'Estensione

Usa lo script di build per compilare la tua estensione:

```bash
npm run build:extension my-extension
```

Oppure usa direttamente lo script Node.js:

```bash
node scripts/build-extension.js my-extension
```

## Passo 5: Testare l'Estensione

Puoi testare la tua estensione includendola in una pagina HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="dist/extensions/my-extension/component.js"></script>
</head>
<body>
  <my-extension></my-extension>
</body>
</html>
```

## Funzionalità Avanzate

### Gestione degli Asset

Se la tua estensione ha bisogno di asset (immagini, file, ecc.), crea una cartella `assets/`:

```typescript
import { KimuAssetManager } from '../../core/kimu-asset-manager';

@KimuComponent({
  tag: 'my-extension',
  name: 'My Extension'
})
export class MyExtension extends HTMLElement {
  private async loadAssets() {
    const assetManager = KimuAssetManager.getInstance();
    const imageUrl = await assetManager.getAsset('my-extension/logo.png');
    
    const img = this.shadowRoot.querySelector('#logo') as HTMLImageElement;
    if (img) {
      img.src = imageUrl;
    }
  }

  connectedCallback() {
    this.render();
    this.loadAssets();
  }
}
```

### Comunicazione tra Estensioni

Usa il sistema di eventi di KIMU per comunicare tra estensioni:

```typescript
// Inviare un evento
this.dispatchEvent(new CustomEvent('my-extension:action', {
  bubbles: true,
  detail: { data: 'some data' }
}));

// Ascoltare eventi
document.addEventListener('other-extension:event', (event) => {
  console.log('Ricevuto evento:', event.detail);
});
```

### Gestione dello Stato

Integra con KimuStore per la gestione dello stato globale:

```typescript
import { KimuStore } from '../../core/kimu-store';

@KimuComponent({
  tag: 'stateful-extension',
  name: 'Stateful Extension'
})
export class StatefulExtension extends HTMLElement {
  private store = KimuStore.getInstance();
  private unsubscribe?: () => void;

  connectedCallback() {
    this.render();
    
    // Sottoscrivi ai cambiamenti dello stato
    this.unsubscribe = this.store.subscribe('myExtension', (state) => {
      this.updateUI(state);
    });
  }

  disconnectedCallback() {
    // Annulla la sottoscrizione
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private updateState(newData: any) {
    this.store.setState('myExtension', {
      ...this.store.getState('myExtension'),
      ...newData
    });
  }

  private updateUI(state: any) {
    // Aggiorna l'UI basandoti sullo stato
  }
}
```

## Best Practices

1. **Usa Shadow DOM**: Garantisce l'isolamento degli stili
2. **Gestisci il Lifecycle**: Implementa correttamente `connectedCallback` e `disconnectedCallback`
3. **Pulisci le Risorse**: Rimuovi event listeners e timer nella disconnessione
4. **Usa TypeScript**: Sfrutta la tipizzazione per un codice più robusto
5. **Testa l'Estensione**: Scrivi test per le funzionalità principali
6. **Documenta l'API**: Documenta props, eventi e metodi pubblici

## Debugging

### Strumenti di Debug

```typescript
// Abilita logging dettagliato
@KimuComponent({
  tag: 'my-extension',
  name: 'My Extension',
  debug: true // Abilita logging
})
export class MyExtension extends HTMLElement {
  // ...
}
```

### Console Logging

```typescript
private log(message: string, data?: any) {
  if (this.debug) {
    console.log(`[MyExtension] ${message}`, data || '');
  }
}
```

## Riferimenti

- [Extension Lifecycle](./extension-lifecycle.md)
- [Extension Manifest](./extension-manifest.md)
- [KimuComponent Decorator](../decorators/kimu-component.md)
- [Best Practices](./best-practices.md)
