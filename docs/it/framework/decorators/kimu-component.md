# @KimuComponent

Decorator TypeScript per la registrazione automatica di Web Components nel framework KIMU.

## Descrizione

`@KimuComponent` è un **decorator di classe** che semplifica la creazione e registrazione di componenti KIMU. Applica automaticamente:

- **Registrazione Web Component**: `customElements.define()` automatico
- **Metadata attachment**: Associa metadata alla classe per uso runtime
- **Path resolution**: Calcola automaticamente path per template e stili
- **Convention over configuration**: Imposta default intelligenti

## Utilizzo Base

### Componente Semplice

```typescript
import { KimuComponent } from './core/kimu-component';
import { KimuComponentElement } from './core/kimu-component-element';

@KimuComponent({
    tag: 'hello-world',
    name: 'Hello World Component',
    version: '1.0.0'
})
export class HelloWorld extends KimuComponentElement {
    getData(): Record<string, any> {
        return {
            message: 'Ciao dal componente KIMU!'
        };
    }
}

// Il componente è automaticamente registrato e utilizzabile
// <hello-world></hello-world>
```

### Componente con Configurazione Completa

```typescript
@KimuComponent({
    tag: 'user-profile',
    name: 'User Profile Widget',
    version: '2.1.0',
    description: 'Mostra informazioni profilo utente',
    author: 'TeamDev',
    icon: '👤',
    path: 'widgets/user-profile',
    dependencies: ['icon-library', 'date-utils'],
    kimuVersion: '1.0.0'
})
export class UserProfile extends KimuComponentElement {
    // Implementazione componente
}
```

## Parametri Decorator

### Obbligatori

#### `tag: string`

Nome del tag HTML per il Web Component (deve contenere un trattino).

**Esempio:**
```typescript
@KimuComponent({
    tag: 'my-widget' // Diventa <my-widget></my-widget>
})
```

#### `name: string`

Nome descrittivo del componente per interfacce utente.

**Esempio:**
```typescript
@KimuComponent({
    tag: 'data-chart',
    name: 'Grafico Dati Interattivo'
})
```

### Opzionali

#### `version?: string`

Versione del componente (formato semver consigliato).

**Default:** `undefined`

```typescript
@KimuComponent({
    tag: 'my-component',
    name: 'My Component',
    version: '1.2.3'
})
```

#### `description?: string`

Descrizione del componente per documentazione.

```typescript
@KimuComponent({
    tag: 'search-box',
    name: 'Search Box',
    description: 'Componente di ricerca con autocompletamento e filtri avanzati'
})
```

#### `author?: string`

Autore o team responsabile del componente.

```typescript
@KimuComponent({
    tag: 'team-widget',
    name: 'Team Widget',
    author: 'Frontend Team'
})
```

#### `icon?: string`

Icona emoji o nome per rappresentare il componente.

```typescript
@KimuComponent({
    tag: 'notification-bell',
    name: 'Notification Bell',
    icon: '🔔'
})
```

#### `path?: string`

Path base del componente (per template, stili, assets).

**Default:** `extensions/${tag}`

```typescript
@KimuComponent({
    tag: 'custom-chart',
    name: 'Custom Chart',
    path: 'charts/custom-chart' // Cercherà in /extensions/charts/custom-chart/
})
```

#### `dependencies?: string[]`

Lista di estensioni richieste (caricate automaticamente).

```typescript
@KimuComponent({
    tag: 'advanced-form',
    name: 'Advanced Form',
    dependencies: ['validation-utils', 'date-picker', 'rich-editor']
})
```

#### `kimuVersion?: string`

Versione minima di KIMU richiesta.

```typescript
@KimuComponent({
    tag: 'new-feature',
    name: 'New Feature',
    kimuVersion: '1.2.0'
})
```

#### `internal?: boolean`

Se `true`, il componente è interno al framework (non visibile agli utenti).

**Default:** `false`

```typescript
@KimuComponent({
    tag: 'kimu-core-util',
    name: 'Core Utility',
    internal: true
})
```

## Convenzioni Automatiche

### Path Resolution

Il decorator imposta automaticamente i path per template e stili:

```typescript
@KimuComponent({
    tag: 'my-component',
    path: 'widgets/my-component'
})
// Imposta automaticamente:
// - basePath: 'widgets/my-component'
// - template: 'view.html'      → /extensions/widgets/my-component/view.html
// - style: 'style.css'         → /extensions/widgets/my-component/style.css
```

### Struttura File Attesa

```
extensions/
  my-component/
    component.ts     ← Contiene il decorator e la classe
    view.html        ← Template HTML (caricato automaticamente)
    style.css        ← Stili CSS (iniettati automaticamente)
    assets/          ← Asset del componente
    resources/       ← Risorse JSON/dati
```

## Esempi Avanzati

### Componente con Asset Esterni

```typescript
@KimuComponent({
    tag: 'rich-editor',
    name: 'Rich Text Editor',
    version: '3.0.0',
    description: 'Editor di testo ricco con formattazione avanzata',
    author: 'Editor Team',
    icon: '📝',
    path: 'editors/rich-editor',
    dependencies: ['icon-library'],
    external: {
        css: [
            { path: 'https://cdn.quilljs.com/1.3.6/quill.snow.css', id: 'quill-theme' }
        ],
        js: [
            { path: 'https://cdn.quilljs.com/1.3.6/quill.min.js', id: 'quill-lib' }
        ]
    }
})
export class RichEditor extends KimuComponentElement {
    private editor: any;
    
    onInit(): void {
        // Quill è disponibile grazie al caricamento automatico degli asset esterni
        this.editor = new (window as any).Quill(this.$('.editor-container'), {
            theme: 'snow'
        });
    }
    
    getData(): Record<string, any> {
        return {
            placeholder: 'Inizia a scrivere...'
        };
    }
}
```

### Sistema di Componenti Modulari

```typescript
// Componente base
@KimuComponent({
    tag: 'base-card',
    name: 'Base Card',
    path: 'ui/base-card',
    internal: true // Componente interno per riuso
})
export class BaseCard extends KimuComponentElement {
    getData(): Record<string, any> {
        return {
            title: this.getAttribute('title') || '',
            content: this.getAttribute('content') || ''
        };
    }
}

// Componente che estende il base
@KimuComponent({
    tag: 'user-card',
    name: 'User Card',
    path: 'components/user-card',
    dependencies: ['base-card'] // Dipende dal componente base
})
export class UserCard extends KimuComponentElement {
    async onInit(): Promise<void> {
        // Carica dati utente
        const userData = await this.loadResource('user-data.json');
        this.userData = userData;
    }
    
    getData(): Record<string, any> {
        return {
            userName: this.userData?.name || 'Unknown User',
            avatar: this.loadAssetUrl('default-avatar.png'),
            isOnline: this.userData?.status === 'online'
        };
    }
}
```

### Componente con Internazionalizzazione

```typescript
@KimuComponent({
    tag: 'multilang-component',
    name: 'Multilingual Component',
    version: '1.0.0',
    path: 'i18n/multilang',
    languages: {
        default: 'en',
        supported: {
            'en': { code: 'en', name: 'English', file: 'en.json' },
            'it': { code: 'it', name: 'Italiano', file: 'it.json' },
            'es': { code: 'es', name: 'Español', file: 'es.json' }
        }
    }
})
export class MultilangComponent extends KimuComponentElement {
    private translations: Record<string, any> = {};
    
    async onInit(): Promise<void> {
        // Carica traduzioni
        const lang = this.getAttribute('lang') || 'en';
        try {
            this.translations = await this.loadResource(`i18n/${lang}.json`);
        } catch {
            // Fallback alla lingua di default
            this.translations = await this.loadResource('i18n/en.json');
        }
    }
    
    getData(): Record<string, any> {
        return {
            welcome: this.translations.welcome || 'Welcome',
            description: this.translations.description || 'Description'
        };
    }
}
```

### Factory Pattern per Componenti

```typescript
class ComponentFactory {
    static createDataWidget(config: any) {
        @KimuComponent({
            tag: `data-widget-${config.type}`,
            name: `Data Widget - ${config.displayName}`,
            version: '1.0.0',
            path: `widgets/data-${config.type}`,
            dependencies: config.dependencies || []
        })
        class DynamicDataWidget extends KimuComponentElement {
            getData(): Record<string, any> {
                return {
                    widgetType: config.type,
                    title: config.title,
                    dataSource: config.dataSource
                };
            }
        }
        
        return DynamicDataWidget;
    }
}

// Creazione dinamica di componenti
const ChartWidget = ComponentFactory.createDataWidget({
    type: 'chart',
    displayName: 'Chart',
    title: 'Data Chart',
    dataSource: '/api/chart-data',
    dependencies: ['chart-library']
});

const TableWidget = ComponentFactory.createDataWidget({
    type: 'table',
    displayName: 'Table',
    title: 'Data Table',
    dataSource: '/api/table-data',
    dependencies: ['table-library']
});
```

## Funzionamento Interno

### Processo di Registrazione

1. **Decorator Execution**: Il decorator viene eseguito quando la classe è definita
2. **Path Resolution**: Calcola `basePath`, `template`, `style` se non specificati
3. **Metadata Attachment**: Allega `__kimu_meta__` alla classe
4. **Web Component Registration**: Chiama `customElements.define(tag, class)`

```typescript
export function KimuComponent(meta: KimuExtensionMeta) {
  return function <T extends CustomElementConstructor>(target: T) {
    // 1. Calcola path base
    const basePath = meta.path ?? `extensions/${meta.tag}`;
    
    // 2. Imposta default per template e style
    meta.basePath = basePath;
    meta.template = meta.template ?? 'view.html';
    meta.style = meta.style ?? 'style.css';
    
    // 3. Registra Web Component
    customElements.define(meta.tag, target);
    
    // 4. Allega metadata
    (target as any).__kimu_meta__ = meta;
  };
}
```

### Accesso ai Metadata

```typescript
export class MyComponent extends KimuComponentElement {
    onInit(): void {
        const meta = this.getMeta(); // Fornito da KimuComponentElement
        console.log(`Componente: ${meta.name} v${meta.version}`);
        console.log(`Path: ${meta.basePath}`);
        console.log(`Dipendenze:`, meta.dependencies);
    }
}
```

## Pattern di Utilizzo

### ✅ Componente Base Riutilizzabile

```typescript
@KimuComponent({
    tag: 'ui-button',
    name: 'UI Button',
    path: 'ui/button'
})
export class UIButton extends KimuComponentElement {
    getData(): Record<string, any> {
        return {
            label: this.getAttribute('label') || 'Button',
            variant: this.getAttribute('variant') || 'primary',
            disabled: this.hasAttribute('disabled'),
            onClick: this.getAttribute('onclick') || ''
        };
    }
}

// Uso: <ui-button label="Salva" variant="success" onclick="save()"></ui-button>
```

### ✅ Componente con Stato

```typescript
@KimuComponent({
    tag: 'counter-widget',
    name: 'Counter Widget',
    version: '1.0.0'
})
export class CounterWidget extends KimuComponentElement {
    private count = 0;
    
    getData(): Record<string, any> {
        return {
            count: this.count,
            canDecrement: this.count > 0
        };
    }
    
    onRender(): void {
        this.$('.increment')?.addEventListener('click', () => {
            this.count++;
            this.refresh();
        });
        
        this.$('.decrement')?.addEventListener('click', () => {
            if (this.count > 0) {
                this.count--;
                this.refresh();
            }
        });
    }
}
```

### ✅ Componente Data-Driven

```typescript
@KimuComponent({
    tag: 'api-list',
    name: 'API List Component',
    dependencies: ['http-client']
})
export class ApiList extends KimuComponentElement {
    private items: any[] = [];
    private loading = false;
    
    async onInit(): Promise<void> {
        await this.loadData();
    }
    
    private async loadData(): Promise<void> {
        this.loading = true;
        this.refresh();
        
        try {
            const apiUrl = this.getAttribute('api-url');
            const response = await fetch(apiUrl);
            this.items = await response.json();
        } catch (error) {
            console.error('Errore caricamento dati:', error);
            this.items = [];
        } finally {
            this.loading = false;
            this.refresh();
        }
    }
    
    getData(): Record<string, any> {
        return {
            items: this.items,
            loading: this.loading,
            hasItems: this.items.length > 0
        };
    }
}
```

## Best Practices

### ✅ Naming Convention

```typescript
// ✅ Tag con namespace
@KimuComponent({ tag: 'myapp-user-card' })  // Evita conflitti

// ✅ Nomi descrittivi
@KimuComponent({ 
    tag: 'data-visualization-chart',
    name: 'Data Visualization Chart Component'
})

// ❌ Tag troppo generici
@KimuComponent({ tag: 'card' })  // Troppo generico
```

### ✅ Versioning

```typescript
@KimuComponent({
    tag: 'api-client',
    version: '2.1.0',        // Semantic versioning
    kimuVersion: '1.0.0'     // Compatibilità KIMU
})
```

### ✅ Documentazione

```typescript
@KimuComponent({
    tag: 'complex-widget',
    name: 'Complex Business Widget',
    description: 'Widget per gestione complessa dei dati aziendali con funzionalità di export, filtro e aggregazione',
    author: 'Business Team',
    version: '1.3.2',
    dependencies: ['data-utils', 'export-service', 'ui-library']
})
```

## Vedi Anche

- **[KimuComponentElement](../core/kimu-component-element.md)** - Classe base per componenti
- **[KimuExtensionMeta](../types/kimu-extension-meta.md)** - Interfaccia metadata
- **[Creare Estensioni](../extensions/creating-extensions.md)** - Guida sviluppo
- **[Web Components](../patterns/web-components.md)** - Pattern Web Components
