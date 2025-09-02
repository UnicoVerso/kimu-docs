# KimuComponentElement

Classe base astratta per tutti i componenti e estensioni del framework KIMU.

## Descrizione

`KimuComponentElement` è la classe fondamentale da cui derivano tutti i componenti KIMU. Estende `HTMLElement` e fornisce funzionalità essenziali per il lifecycle, rendering e gestione delle risorse.

**Caratteristiche principali:**
- Shadow DOM automatico per isolamento CSS/DOM
- Lifecycle hooks per gestione del ciclo di vita
- Sistema di rendering basato su template
- Gestione automatica di asset e dipendenze
- Utilità per query DOM e caricamento risorse

## Utilizzo Base

### Creare un Componente

```typescript
import { KimuComponentElement } from './core/kimu-component-element';
import { KimuComponent } from './core/kimu-component';

@KimuComponent({
    tag: 'my-component',
    name: 'Il Mio Componente',
    version: '1.0.0',
    path: 'my-component'
})
export class MyComponent extends KimuComponentElement {
    
    // Fornisce dati per il rendering
    getData(): Record<string, any> {
        return {
            title: 'Ciao KIMU!',
            timestamp: Date.now()
        };
    }
    
    // Hook di inizializzazione
    onInit(): void {
        console.log('Componente inizializzato');
    }
    
    // Hook dopo ogni render
    onRender(): void {
        console.log('Componente renderizzato');
        
        // Accesso agli elementi del template
        const button = this.$('button');
        if (button) {
            button.addEventListener('click', () => {
                this.refresh(); // Re-render
            });
        }
    }
    
    // Hook di distruzione
    onDestroy(): void {
        console.log('Componente distrutto');
    }
}
```

### Template HTML (`view.html`)

```html
<div class="container">
    <h1>${title}</h1>
    <p>Timestamp: ${timestamp}</p>
    <button>Aggiorna</button>
</div>
```

### Stili CSS (`style.css`)

```css
:host {
    display: block;
    padding: 20px;
}

.container {
    background: #f0f0f0;
    border-radius: 8px;
    padding: 16px;
}

button {
    background: #007acc;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}
```

## API

### Metodi Astratti

#### `getData(): Record<string, any>`

**Obbligatorio**: Fornisce i dati per il rendering del template.

**Ritorna:** `Record<string, any>` - Oggetto con i dati del componente

**Esempio:**
```typescript
getData(): Record<string, any> {
    return {
        username: this.getAttribute('username') || 'Guest',
        isLoggedIn: this.hasAttribute('logged-in'),
        items: this.items || []
    };
}
```

### Lifecycle Hooks

#### `onInit(): void`

Hook chiamato una volta dopo che il componente è stato connesso al DOM e inizializzato.

**Uso tipico:**
- Setup eventi
- Inizializzazione stato
- Configurazione iniziale

```typescript
onInit(): void {
    // Setup eventi globali
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Inizializzazione stato
    this.state = { count: 0 };
}
```

#### `onRender(): void`

Hook chiamato dopo ogni rendering del template.

**Uso tipico:**
- Binding eventi DOM
- Aggiornamento elementi dinamici
- Animazioni

```typescript
onRender(): void {
    // Binding eventi
    this.$('.btn-increment')?.addEventListener('click', () => {
        this.state.count++;
        this.refresh();
    });
    
    // Aggiornamento elementi
    const counter = this.$('.counter');
    if (counter) {
        counter.textContent = this.state.count.toString();
    }
}
```

#### `onDestroy(): void`

Hook chiamato quando il componente viene rimosso dal DOM.

**Uso tipico:**
- Cleanup eventi
- Cancellazione timer
- Rilascio risorse

```typescript
onDestroy(): void {
    // Cleanup eventi
    window.removeEventListener('resize', this.handleResize);
    
    // Cancellazione timer
    if (this.timer) {
        clearInterval(this.timer);
    }
}
```

### Metodi di Utilità

#### `$(selector: string): HTMLElement | null`

Shortcut per query del DOM all'interno del Shadow DOM.

**Parametri:**
- `selector: string` - Selettore CSS

**Ritorna:** `HTMLElement | null`

**Esempio:**
```typescript
onRender(): void {
    const button = this.$('button.primary');
    const inputs = this.shadowRoot?.querySelectorAll('input');
}
```

#### `refresh(): Promise<void>`

Forza un re-rendering del componente con i dati correnti.

**Uso:**
```typescript
// Aggiorna stato e re-renderizza
this.updateState();
await this.refresh();
```

#### `getMeta(): KimuExtensionMeta`

Ottiene i metadata associati al componente (definiti nel decorator).

**Ritorna:** `KimuExtensionMeta`

**Esempio:**
```typescript
onInit(): void {
    const meta = this.getMeta();
    console.log(`Componente: ${meta.name} v${meta.version}`);
}
```

### Metodi per Risorse

#### `loadResource(file: string): Promise<any>`

Carica una risorsa JSON dalla cartella `resources/` dell'estensione.

**Parametri:**
- `file: string` - Nome del file risorsa

**Ritorna:** `Promise<any>` - Contenuto JSON della risorsa

**Esempio:**
```typescript
async onInit(): Promise<void> {
    try {
        const config = await this.loadResource('config.json');
        const translations = await this.loadResource('i18n/it.json');
        
        this.setupWithConfig(config);
    } catch (error) {
        console.error('Errore caricamento risorse:', error);
    }
}
```

#### `loadAssetUrl(file: string): string`

Genera l'URL per un asset nella cartella `assets/` dell'estensione.

**Parametri:**
- `file: string` - Nome del file asset

**Ritorna:** `string` - URL completo dell'asset

**Esempio:**
```typescript
getData(): Record<string, any> {
    return {
        logoUrl: this.loadAssetUrl('logo.png'),
        iconUrl: this.loadAssetUrl('icons/user.svg')
    };
}
```

## Lifecycle Completo

```typescript
@KimuComponent({
    tag: 'advanced-component',
    name: 'Componente Avanzato',
    path: 'advanced-component',
    dependencies: ['base-utils'] // Carica dipendenze prima
})
export class AdvancedComponent extends KimuComponentElement {
    private state: any = {};
    private timer?: number;
    
    // 1. Dati per il template
    getData(): Record<string, any> {
        return {
            ...this.state,
            timestamp: new Date().toLocaleString()
        };
    }
    
    // 2. Inizializzazione (una volta)
    async onInit(): Promise<void> {
        // Carica configurazione
        const config = await this.loadResource('config.json');
        this.state = { ...config.defaultState };
        
        // Setup timer
        this.timer = window.setInterval(() => {
            this.refresh();
        }, 1000);
        
        console.log('✅ Componente inizializzato');
    }
    
    // 3. Dopo ogni render
    onRender(): void {
        // Binding eventi
        this.$('.update-btn')?.addEventListener('click', () => {
            this.handleUpdate();
        });
        
        console.log('🎨 Componente renderizzato');
    }
    
    // 4. Cleanup (quando rimosso)
    onDestroy(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        console.log('🗑️ Componente distrutto');
    }
    
    private handleUpdate(): void {
        this.state.counter = (this.state.counter || 0) + 1;
        this.refresh();
    }
}
```

## Best Practices

### Gestione Stato

```typescript
// ✅ Stato locale nel componente
private state = {
    count: 0,
    isLoading: false
};

// ✅ Aggiornamento stato con refresh
updateCount(newCount: number): void {
    this.state.count = newCount;
    this.refresh(); // Re-render con nuovi dati
}
```

### Gestione Eventi

```typescript
// ✅ Binding eventi in onRender
onRender(): void {
    // Remove old listeners se necessario
    this.$('.btn')?.removeEventListener('click', this.handleClick);
    
    // Add new listeners
    this.$('.btn')?.addEventListener('click', this.handleClick.bind(this));
}

// ✅ Cleanup in onDestroy
onDestroy(): void {
    this.$('.btn')?.removeEventListener('click', this.handleClick);
}
```

### Caricamento Asincrono

```typescript
async onInit(): Promise<void> {
    try {
        // ✅ Caricamento parallelo risorse
        const [config, translations, userData] = await Promise.all([
            this.loadResource('config.json'),
            this.loadResource('i18n/it.json'),
            this.fetchUserData()
        ]);
        
        this.setupComponent(config, translations, userData);
        
    } catch (error) {
        this.handleError(error);
    }
}
```

## Ottimizzazioni e Performance

### Configurazione Ottimizzazioni

KIMU-Core include ottimizzazioni sicure per migliorare performance e affidabilità senza aumentare la complessità.

#### `configureOptimizations(settings): void` (Statico)

Configura le ottimizzazioni globali per tutti i componenti.

**Parametri:**
- `settings: object` - Impostazioni di ottimizzazione

**Opzioni disponibili:**
```typescript
KimuComponentElement.configureOptimizations({
    enableTemplateCache: true,      // Cache template compilati (default: true)
    enableFileCache: true,          // Cache file caricati (default: true)
    enableRenderDebouncing: true,   // Debouncing render (default: true)
    enableErrorBoundaries: true,    // Isolamento errori (default: true)
    cacheMaxSize: 50,              // Limite cache template (default: 50)
    enableAssetPreloading: false   // Precaricamento asset (default: false)
});
```

### Error Boundaries

I componenti hanno isolamento automatico degli errori per prevenire crash a cascata.

#### `onError(error: Error): void` (Opzionale)

Hook per gestione personalizzata degli errori di rendering.

```typescript
export class MyComponent extends KimuComponentElement {
    // Gestione errori personalizzata
    onError(error: Error): void {
        console.error(`Errore in ${this.tagName}:`, error);
        
        // Report errore a servizio di analisi
        this.reportError(error);
        
        // Notifica utente (UI fallback viene mostrata automaticamente)
        this.showUserNotification('Componente temporaneamente non disponibile');
    }
    
    private reportError(error: Error) {
        // Invio errore a servizio di logging
        fetch('/api/errors', {
            method: 'POST',
            body: JSON.stringify({
                component: this.tagName,
                error: error.message,
                stack: error.stack
            })
        });
    }
}
```

### Preloading Asset

Migliorare le performance precaricando asset critici.

#### `preloadAssets(paths: string[]): Promise<void>` (Statico)

Precarica asset per migliorare performance percepite.

```typescript
// Durante l'inizializzazione dell'app
await KimuComponentElement.preloadAssets([
    'extensions/dashboard/view.html',
    'extensions/dashboard/style.css',
    'extensions/sidebar/view.html',
    'assets/theme.css'
]);
```

### Debug e Monitoring

#### `getOptimizationSettings(): object` (Statico)

Restituisce le impostazioni correnti di ottimizzazione per debugging.

```typescript
// Verifica configurazione
console.log('Ottimizzazioni attive:', 
    KimuComponentElement.getOptimizationSettings());
```

#### `forceRefresh(): Promise<void>`

Forza un refresh immediato saltando ottimizzazioni (utile per debugging).

```typescript
// Debug: refresh forzato
await this.forceRefresh();
```

## Vedi Anche

- **[@KimuComponent](../decorators/kimu-component.md)** - Decorator per registrazione
- **[KimuEngine](./kimu-engine.md)** - Motore di rendering
- **[Creare Estensioni](../extensions/creating-extensions.md)** - Guida estensioni
- **[Asset Loading](../patterns/asset-loading.md)** - Pattern caricamento asset
