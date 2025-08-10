# KimuRender

Sistema di rendering reattivo basato su Lit per la compilazione e rendering di template HTML dinamici.

## Descrizione

`KimuRender` fornisce un'interfaccia unificata per il sistema di rendering di KIMU, utilizzando **Lit** come motore sottostante. La classe gestisce:

- **Compilazione template**: Trasforma HTML in funzioni di rendering Lit
- **Rendering reattivo**: Aggiornamenti efficienti del DOM
- **Template dinamici**: Binding di dati JavaScript in template HTML

**Tutti i metodi sono statici**, rendendo la classe un'utility pura per operazioni di rendering.

## Utilizzo

### Rendering Base

```typescript
import { KimuRender } from './core/kimu-render';
import { html } from 'lit';

// Rendering diretto con Lit
const data = { title: 'Ciao KIMU!', count: 42 };
const renderFn = (html, data) => html`
    <h1>${data.title}</h1>
    <p>Contatore: ${data.count}</p>
`;

KimuRender.render(this, data, renderFn);
```

### Compilazione Template

```typescript
// Template come stringa
const templateString = `
    <div class="card">
        <h2>\${title}</h2>
        <p>\${description}</p>
        <span class="badge">\${status}</span>
    </div>
`;

// Compila in funzione di rendering
const renderFunction = KimuRender.compileTemplate(templateString);

// Usa la funzione compilata
KimuRender.render(this, {
    title: 'Card Dinamica',
    description: 'Contenuto generato runtime',
    status: 'Attivo'
}, renderFunction);
```

### Caricamento da File

```typescript
// Carica template da file HTML
const htmlTemplate = '<h1>${title}</h1><p>${content}</p>';
const renderFn = await KimuRender.loadTemplate(htmlTemplate);

// Rendering con dati
KimuRender.render(this, {
    title: 'Titolo dal Template',
    content: 'Contenuto caricato da file'
}, renderFn);
```

## API

### Rendering

#### `render(component, data, renderFn): void`

Esegue il rendering reattivo di un template nel Shadow DOM del componente.

**Parametri:**
- `component: HTMLElement` - Componente target con Shadow DOM
- `data: Record<string, any>` - Dati per il template binding
- `renderFn: Function` - Funzione di rendering Lit

**Esempio:**
```typescript
const component = this; // Riferimento al componente corrente
const data = {
    userName: 'Alice',
    notifications: 3,
    isOnline: true
};

const renderFn = (html, data) => html`
    <div class="user-status">
        <span class="name">${data.userName}</span>
        ${data.isOnline ? html`<span class="online">🟢 Online</span>` : html`<span class="offline">🔴 Offline</span>`}
        <span class="notifications">${data.notifications} notifiche</span>
    </div>
`;

KimuRender.render(component, data, renderFn);
```

### Compilazione Template

#### `compileTemplate(template): Function`

Compila una stringa HTML template in una funzione di rendering Lit.

**Parametri:**
- `template: string` - Template HTML con placeholder `${variabile}`

**Ritorna:** `Function` - Funzione di rendering `(html, data) => TemplateResult`

**Esempio:**
```typescript
// Template con logica condizionale
const template = `
    <div class="product">
        <h3>\${name}</h3>
        <p class="price">\${price} €</p>
        \${isAvailable ? '<span class="available">Disponibile</span>' : '<span class="unavailable">Esaurito</span>'}
        <button \${isAvailable ? '' : 'disabled'}>\${buttonText}</button>
    </div>
`;

const renderFn = KimuRender.compileTemplate(template);

// Uso con dati diversi
const products = [
    { name: 'Prodotto A', price: 29.99, isAvailable: true, buttonText: 'Acquista' },
    { name: 'Prodotto B', price: 19.99, isAvailable: false, buttonText: 'Non disponibile' }
];

products.forEach(product => {
    KimuRender.render(component, product, renderFn);
});
```

#### `loadTemplate(template): Function`

Carica un template HTML e lo compila in una funzione di rendering.

**Parametri:**
- `template: string` - Stringa HTML template

**Ritorna:** `Function` - Funzione di rendering compilata

**Esempio:**
```typescript
// Template caricato da variabile
const htmlContent = `
    <article class="blog-post">
        <header>
            <h1>\${title}</h1>
            <time datetime="\${publishDate}">\${formattedDate}</time>
        </header>
        <main>\${content}</main>
        <footer>
            <span>Autore: \${author}</span>
            <span>Tag: \${tags.join(', ')}</span>
        </footer>
    </article>
`;

const renderFn = await KimuRender.loadTemplate(htmlContent);

KimuRender.render(this, {
    title: 'Il mio post',
    publishDate: '2025-01-15',
    formattedDate: '15 Gennaio 2025',
    content: 'Contenuto del post...',
    author: 'Marco',
    tags: ['tutorial', 'javascript', 'kimu']
}, renderFn);
```

## Template Syntax

### Interpolazione Variabili

```html
<!-- Interpolazione semplice -->
<h1>${title}</h1>
<p>${description}</p>

<!-- Espressioni JavaScript -->
<span>${count * 2}</span>
<p>${user.name.toUpperCase()}</p>

<!-- Chiamate a funzioni -->
<time>${formatDate(timestamp)}</time>
```

### Rendering Condizionale

```html
<!-- Operatore ternario -->
<span class="${isActive ? 'active' : 'inactive'}">${status}</span>

<!-- Rendering condizionale con template -->
${isLoggedIn ? '<div class="user-menu">Menu</div>' : '<button>Login</button>'}

<!-- Condizioni complesse -->
${user.isAdmin ? '<button class="admin">Pannello Admin</button>' : ''}
```

### Liste e Iterazioni

```html
<!-- Rendering array -->
<ul>
    ${items.map(item => `<li>${item.name}</li>`).join('')}
</ul>

<!-- Con indice -->
${products.map((product, index) => `
    <div class="product-${index}">
        <h3>${product.name}</h3>
        <p>${product.price}€</p>
    </div>
`).join('')}
```

### Attributi Dinamici

```html
<!-- Attributi condizionali -->
<button ${isDisabled ? 'disabled' : ''} onclick="${handleClick}">
    ${buttonText}
</button>

<!-- Classi dinamiche -->
<div class="card ${isHighlighted ? 'highlighted' : ''} ${size}">
    Contenuto
</div>

<!-- Stili inline -->
<div style="color: ${textColor}; background: ${bgColor};">
    Testo colorato
</div>
```

## Esempi Avanzati

### Template con Componenti Annidati

```typescript
class NestedComponentRenderer {
    static createCardTemplate(): string {
        return `
            <div class="card">
                <header class="card-header">
                    <h3>\${title}</h3>
                    <span class="badge \${badgeClass}">\${badgeText}</span>
                </header>
                <main class="card-body">
                    \${content}
                </main>
                <footer class="card-footer">
                    <button class="btn btn-primary" onclick="\${onPrimaryAction}">
                        \${primaryLabel}
                    </button>
                    <button class="btn btn-secondary" onclick="\${onSecondaryAction}">
                        \${secondaryLabel}
                    </button>
                </footer>
            </div>
        `;
    }
    
    static renderCard(component: HTMLElement, cardData: any): void {
        const template = this.createCardTemplate();
        const renderFn = KimuRender.compileTemplate(template);
        
        KimuRender.render(component, cardData, renderFn);
    }
}

// Uso
NestedComponentRenderer.renderCard(this, {
    title: 'Scheda Prodotto',
    badgeClass: 'badge-success',
    badgeText: 'Nuovo',
    content: 'Descrizione dettagliata del prodotto...',
    primaryLabel: 'Acquista',
    secondaryLabel: 'Wishlist',
    onPrimaryAction: 'this.handlePurchase()',
    onSecondaryAction: 'this.addToWishlist()'
});
```

### Template Factory

```typescript
class TemplateFactory {
    private static templates = new Map<string, Function>();
    
    static registerTemplate(name: string, templateString: string): void {
        const renderFn = KimuRender.compileTemplate(templateString);
        this.templates.set(name, renderFn);
    }
    
    static render(component: HTMLElement, templateName: string, data: any): void {
        const renderFn = this.templates.get(templateName);
        if (!renderFn) {
            throw new Error(`Template '${templateName}' non trovato`);
        }
        
        KimuRender.render(component, data, renderFn);
    }
    
    static preloadTemplates(): void {
        // Template per lista
        this.registerTemplate('list', `
            <div class="list-container">
                <h2>\${title}</h2>
                <ul class="list">
                    \${items.map(item => \`<li class="list-item">\${item}</li>\`).join('')}
                </ul>
            </div>
        `);
        
        // Template per form
        this.registerTemplate('form', `
            <form class="form">
                <h2>\${formTitle}</h2>
                \${fields.map(field => \`
                    <div class="field">
                        <label>\${field.label}</label>
                        <input type="\${field.type}" name="\${field.name}" placeholder="\${field.placeholder}">
                    </div>
                \`).join('')}
                <button type="submit">\${submitLabel}</button>
            </form>
        `);
        
        // Template per griglia
        this.registerTemplate('grid', `
            <div class="grid" style="grid-template-columns: repeat(\${columns}, 1fr);">
                \${items.map(item => \`
                    <div class="grid-item">
                        <h3>\${item.title}</h3>
                        <p>\${item.description}</p>
                    </div>
                \`).join('')}
            </div>
        `);
    }
}

// Inizializzazione
TemplateFactory.preloadTemplates();

// Uso
TemplateFactory.render(this, 'list', {
    title: 'Lista Attività',
    items: ['Completare documentazione', 'Testare componenti', 'Deploy produzione']
});
```

### Rendering con Performance

```typescript
class PerformantRenderer {
    private static renderCache = new Map<string, any>();
    
    static async renderWithCache(
        component: HTMLElement,
        templateKey: string,
        data: any,
        cacheKey?: string
    ): Promise<void> {
        const actualCacheKey = cacheKey || JSON.stringify(data);
        
        // Verifica cache
        if (this.renderCache.has(actualCacheKey)) {
            const cachedResult = this.renderCache.get(actualCacheKey);
            component.shadowRoot!.innerHTML = cachedResult;
            return;
        }
        
        // Rendering normale
        const renderFn = await this.getTemplate(templateKey);
        KimuRender.render(component, data, renderFn);
        
        // Salva in cache
        const rendered = component.shadowRoot!.innerHTML;
        this.renderCache.set(actualCacheKey, rendered);
    }
    
    private static async getTemplate(key: string): Promise<Function> {
        // Logica per ottenere template by key
        return KimuRender.compileTemplate('<div>Template placeholder</div>');
    }
    
    static clearCache(): void {
        this.renderCache.clear();
    }
}
```

### Template con Event Handling

```typescript
class InteractiveRenderer {
    static createInteractiveTemplate(): string {
        return `
            <div class="interactive-component">
                <h2>\${title}</h2>
                <div class="controls">
                    <button onclick="this.getRootNode().host.handleIncrement()">+</button>
                    <span class="counter">\${count}</span>
                    <button onclick="this.getRootNode().host.handleDecrement()">-</button>
                </div>
                <div class="actions">
                    <button onclick="this.getRootNode().host.handleReset()" class="reset">Reset</button>
                    <button onclick="this.getRootNode().host.handleSave()" class="save">Salva</button>
                </div>
            </div>
        `;
    }
    
    static setupInteractiveComponent(component: any): void {
        // Aggiungi metodi al componente
        component.handleIncrement = () => {
            component.state.count++;
            component.refresh();
        };
        
        component.handleDecrement = () => {
            component.state.count--;
            component.refresh();
        };
        
        component.handleReset = () => {
            component.state.count = 0;
            component.refresh();
        };
        
        component.handleSave = () => {
            console.log('Valore salvato:', component.state.count);
        };
        
        // Imposta template
        const template = this.createInteractiveTemplate();
        const renderFn = KimuRender.compileTemplate(template);
        
        component._interactiveRenderFn = renderFn;
    }
}
```

## Integrazione con Lit

`KimuRender` utilizza Lit internamente per garantire:

- **Rendering efficiente**: Aggiornamenti DOM ottimizzati
- **Reattività**: Binding reattivo dei dati
- **Template literals**: Sintassi naturale per HTML

```typescript
import { html, render as litRender, TemplateResult } from 'lit';

// Il rendering finale usa Lit
static render(component: HTMLElement, data: Record<string, any>, renderFn: Function): void {
    const template = renderFn(html, data);
    litRender(template, component.shadowRoot!);
}
```

## Best Practices

### ✅ Template Modulari

```typescript
// Dividi template complessi in parti riutilizzabili
const headerTemplate = '<header><h1>${title}</h1></header>';
const contentTemplate = '<main>${content}</main>';
const footerTemplate = '<footer>${footerText}</footer>';

const fullTemplate = `
    ${headerTemplate}
    ${contentTemplate}
    ${footerTemplate}
`;
```

### ✅ Gestione Errori

```typescript
try {
    const renderFn = KimuRender.compileTemplate(templateString);
    KimuRender.render(component, data, renderFn);
} catch (error) {
    console.error('Errore rendering:', error);
    // Fallback template
    const fallbackFn = KimuRender.compileTemplate('<p>Errore rendering</p>');
    KimuRender.render(component, {}, fallbackFn);
}
```

### ✅ Performance

```typescript
// Cache delle funzioni di rendering
private static renderFnCache = new Map<string, Function>();

static getCachedRenderFn(template: string): Function {
    if (!this.renderFnCache.has(template)) {
        const renderFn = KimuRender.compileTemplate(template);
        this.renderFnCache.set(template, renderFn);
    }
    return this.renderFnCache.get(template)!;
}
```

## Vedi Anche

- **[KimuEngine](./kimu-engine.md)** - Motore di rendering superiore
- **[KimuComponentElement](./kimu-component-element.md)** - Classe base componenti
- **[Template Patterns](../patterns/template-patterns.md)** - Pattern per template
- **[Asset Loading](../patterns/asset-loading.md)** - Caricamento template
