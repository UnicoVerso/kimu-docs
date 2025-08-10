# KimuEngine

Motore di rendering e gestione template che fornisce le funzionalità core per il rendering, caricamento template e gestione componenti dinamici.

## Descrizione

`KimuEngine` agisce come ponte tra il sistema di rendering (Lit) e il gestore di asset, fornendo API unificate per:

- Injection di stili in Shadow DOM
- Caricamento e compilazione template HTML
- Rendering reattivo con Lit
- Caricamento dinamico di componenti

**Tutti i metodi sono statici**, rendendo la classe un'utility centrale per operazioni di rendering.

## Utilizzo

### Injection di Stili

```typescript
import { KimuEngine } from './core/kimu-engine';

// Inietta stile in un componente
await KimuEngine.injectStyle(
    this,                           // Componente target
    'assets/theme.css',            // Path CSS
    'my-theme-style'               // ID univoco (opzionale)
);
```

### Caricamento Template

```typescript
// Carica e compila template HTML
const renderFunction = await KimuEngine.loadTemplate('/extensions/my-app/view.html');

// Usa la funzione di rendering
KimuEngine.render(this, { title: 'Ciao!' }, renderFunction);
```

### Rendering Diretto

```typescript
// Compila template da stringa
const templateString = '<h1>${title}</h1><p>${description}</p>';
const renderFn = KimuEngine.compileTemplate(templateString);

// Rendering con dati
KimuEngine.render(this, {
    title: 'Titolo Dinamico',
    description: 'Contenuto aggiornato'
}, renderFn);
```

## API

### Gestione Stili

#### `injectStyle(component, stylePath, styleId?): Promise<void>`

Inietta un file CSS nel Shadow DOM del componente.

**Parametri:**
- `component: HTMLElement` - Componente target
- `stylePath: string` - Path al file CSS
- `styleId: string | null` - ID univoco per lo style element (opzionale)

**Esempio:**
```typescript
// Inietta stile principale
await KimuEngine.injectStyle(this, 'assets/main.css', 'main-style');

// Inietta tema condizionale
if (isDarkMode) {
    await KimuEngine.injectStyle(this, 'assets/dark-theme.css', 'dark-theme');
}
```

### Gestione Template

#### `loadTemplate(path): Promise<Function>`

Carica un file HTML template e lo compila in una funzione di rendering Lit.

**Parametri:**
- `path: string` - Path al file template

**Ritorna:** `Promise<Function>` - Funzione di rendering compilata

**Esempio:**
```typescript
// In un componente
async connectedCallback(): Promise<void> {
    const templatePath = `/extensions/${this.getMeta().basePath}/view.html`;
    this._renderFn = await KimuEngine.loadTemplate(templatePath);
    this.refresh();
}
```

#### `compileTemplate(template): Function`

Compila una stringa HTML in una funzione di rendering Lit.

**Parametri:**
- `template: string` - Stringa HTML template

**Ritorna:** `Function` - Funzione di rendering

**Esempio:**
```typescript
// Template dinamico
const templateStr = `
    <div class="card">
        <h2>\${title}</h2>
        <p>\${description}</p>
        <button onclick="\${onClick}">\${buttonLabel}</button>
    </div>
`;

const renderFn = KimuEngine.compileTemplate(templateStr);

// Uso immediato
KimuEngine.render(this, {
    title: 'Card Dinamica',
    description: 'Generata runtime',
    buttonLabel: 'Clicca qui',
    onClick: 'handleClick()'
}, renderFn);
```

### Rendering

#### `render(component, data, renderFn): void`

Esegue il rendering reattivo usando Lit.

**Parametri:**
- `component: HTMLElement` - Componente target
- `data: Record<string, any>` - Dati per il template
- `renderFn: Function` - Funzione di rendering

**Esempio:**
```typescript
// Rendering con dati dinamici
const data = {
    users: ['Alice', 'Bob', 'Charlie'],
    currentTime: new Date().toLocaleString(),
    isLoggedIn: true
};

KimuEngine.render(this, data, this._renderFn);
```

### Caricamento Componenti

#### `loadComponent(tag, path): Promise<any>`

Carica un componente da un path specifico e lo registra se non già registrato.

**Parametri:**
- `tag: string` - Nome tag del componente
- `path: string` - Path al modulo del componente

**Ritorna:** `Promise<any>` - Modulo caricato

**Esempio:**
```typescript
// Caricamento dinamico componente
await KimuEngine.loadComponent(
    'custom-widget',
    '/extensions/widgets/custom-widget/component.js'
);

// Ora il componente può essere usato
const widget = document.createElement('custom-widget');
```

## Esempi Avanzati

### Sistema di Temi Dinamici

```typescript
class ThemeManager {
    static async applyTheme(component: HTMLElement, themeName: string): Promise<void> {
        // Rimuovi tema precedente
        const oldTheme = component.shadowRoot?.getElementById('current-theme');
        if (oldTheme) {
            oldTheme.remove();
        }
        
        // Carica nuovo tema
        await KimuEngine.injectStyle(
            component,
            `assets/themes/${themeName}.css`,
            'current-theme'
        );
    }
}

// Uso
await ThemeManager.applyTheme(this, 'dark');
```

### Template Condizionali

```typescript
class ConditionalRenderer {
    static async renderByCondition(
        component: HTMLElement, 
        condition: string, 
        data: any
    ): Promise<void> {
        // Seleziona template basato su condizione
        const templateMap = {
            'loading': 'templates/loading.html',
            'error': 'templates/error.html',
            'success': 'templates/content.html'
        };
        
        const templatePath = templateMap[condition] || templateMap['error'];
        const renderFn = await KimuEngine.loadTemplate(templatePath);
        
        KimuEngine.render(component, data, renderFn);
    }
}

// Uso
await ConditionalRenderer.renderByCondition(this, 'loading', {
    message: 'Caricamento in corso...'
});
```

### Template Builder Dinamico

```typescript
class TemplateBuilder {
    private static buildListTemplate(items: any[]): string {
        const itemTemplates = items.map((_, index) => 
            `<li class="item">\${items[${index}].name}</li>`
        ).join('');
        
        return `
            <div class="list-container">
                <h3>\${title}</h3>
                <ul class="items">
                    ${itemTemplates}
                </ul>
            </div>
        `;
    }
    
    static renderDynamicList(component: HTMLElement, data: any): void {
        const template = this.buildListTemplate(data.items);
        const renderFn = KimuEngine.compileTemplate(template);
        
        KimuEngine.render(component, data, renderFn);
    }
}

// Uso
TemplateBuilder.renderDynamicList(this, {
    title: 'Lista Dinamica',
    items: [
        { name: 'Item 1' },
        { name: 'Item 2' },
        { name: 'Item 3' }
    ]
});
```

### Rendering con Performance Monitoring

```typescript
class PerformantRenderer {
    static async renderWithProfiling(
        component: HTMLElement,
        data: any,
        renderFn: Function,
        label = 'render'
    ): Promise<void> {
        // Start profiling
        performance.mark(`${label}-start`);
        
        try {
            KimuEngine.render(component, data, renderFn);
            
            // End profiling
            performance.mark(`${label}-end`);
            performance.measure(label, `${label}-start`, `${label}-end`);
            
            const measure = performance.getEntriesByName(label)[0];
            console.log(`🎯 Rendering ${label}: ${measure.duration.toFixed(2)}ms`);
            
        } catch (error) {
            console.error(`❌ Errore rendering ${label}:`, error);
        } finally {
            // Cleanup
            performance.clearMarks(`${label}-start`);
            performance.clearMarks(`${label}-end`);
            performance.clearMeasures(label);
        }
    }
}
```

## Integrazione con Lit

`KimuEngine` utilizza internamente **Lit** per il rendering reattivo:

```typescript
import { html, render as litRender, TemplateResult } from 'lit';

// Il template compilato usa la sintassi Lit
const template = html`
    <div class="component">
        <h1>${data.title}</h1>
        <p>${data.content}</p>
    </div>
`;

// Rendering nel Shadow DOM
litRender(template, component.shadowRoot!);
```

## Best Practices

### ✅ Gestione Errori

```typescript
try {
    const renderFn = await KimuEngine.loadTemplate(templatePath);
    KimuEngine.render(this, data, renderFn);
} catch (error) {
    console.error('Errore rendering:', error);
    // Fallback template
    const fallbackFn = KimuEngine.compileTemplate('<p>Errore di caricamento</p>');
    KimuEngine.render(this, {}, fallbackFn);
}
```

### ✅ Caching Template

```typescript
private static templateCache = new Map<string, Function>();

static async getCachedTemplate(path: string): Promise<Function> {
    if (!this.templateCache.has(path)) {
        const renderFn = await KimuEngine.loadTemplate(path);
        this.templateCache.set(path, renderFn);
    }
    return this.templateCache.get(path)!;
}
```

### ✅ Lazy Loading Componenti

```typescript
static async loadComponentLazy(tag: string): Promise<void> {
    if (!customElements.get(tag)) {
        const path = `/extensions/${tag}/component.js`;
        await KimuEngine.loadComponent(tag, path);
    }
}
```

## Vedi Anche

- **[KimuRender](./kimu-render.md)** - Sistema di rendering Lit
- **[KimuAssetManager](./kimu-asset-manager.md)** - Gestione asset
- **[KimuComponentElement](./kimu-component-element.md)** - Classe base componenti
- **[Asset Loading](../patterns/asset-loading.md)** - Pattern caricamento
