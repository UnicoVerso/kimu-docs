# Extension Anatomy

Let's dive deep into the fundamental components that make up a KIMU extension.

## 🔧 The Three Pillars

Every KIMU extension consists of three main elements:

1. **`@KimuComponent` Decorator** - Metadata and configuration
2. **Component Class** - Logic, state, and lifecycle
3. **HTML Template** - Dynamic user interface

## 1. 📋 @KimuComponent Decorator

The decorator is the heart of configuration. It defines all extension metadata:

```typescript
@KimuComponent({
  tag: 'my-extension',          // ✅ Required: unique Web Component name
  name: 'My Extension',         // ✅ UI name
  version: '1.0.0',           // ✅ Semantic versioning
  description: 'Description',  // Feature description
  icon: '🎯',                  // Emoji/unicode icon
  author: 'Developer',         // Author or team
  path: 'my-extension',        // Folder path (default: tag)
  internal: false,             // true = system, false = user
  kimuVersion: '1.0.0',        // Required KIMU version
  dependencies: ['child-ext-1', 'child-ext-2'] // Tags of child extensions
})
```

### Decorator Properties

| Property | Type | Required | Description |
|----------|------|:--------:|-------------|
| `tag` | `string` | ✅ | Unique Web Component name (kebab-case) |
| `name` | `string` | ✅ | Descriptive name for the interface |
| `version` | `string` | ✅ | Semantic version (e.g., "1.2.3") |
| `description` | `string` | ❌ | Feature description |
| `icon` | `string` | ❌ | Emoji or unicode icon |
| `author` | `string` | ❌ | Author or development team |
| `path` | `string` | ❌ | Folder path (default: tag) |
| `internal` | `boolean` | ❌ | If `true`, hidden from users |
| `kimuVersion` | `string` | ❌ | Minimum required KIMU version |
| `dependencies` | `string[]` | ❌ | Array of child extension tags |

### 🔗 Metadata Dependencies

The `dependencies` metadata is essential for building composite extensions. It is an array of strings containing the tags of child extensions included in the parent extension.

**How it works:**
- If your extension is a "parent" and contains other extensions as components, specify their tags in the `dependencies` field.
- Child extensions will be automatically loaded and made available in the HTML template (`view.html`).
- You can use child extensions as regular HTML tags inside your template.

**Practical example:**
```typescript
@KimuComponent({
  tag: 'dashboard-parent',
  name: 'Complete Dashboard',
  version: '1.0.0',
  dependencies: ['chart-widget', 'data-table', 'filter-panel'] // Child extensions
})
export class DashboardParent extends KimuComponentElement {
  // Parent component logic
}
```

In the `view.html` template:
```html
<div class="dashboard">
  <h2>Interactive Dashboard</h2>
  <!-- Use child extensions as HTML tags -->
  <chart-widget data="${chartData}"></chart-widget>
  <data-table items="${tableItems}"></data-table>
  <filter-panel @filter="${onFilter}"></filter-panel>
</div>
```

**Advantages:**
- ✅ Modularity: each component is independent
- ✅ Reusability: child extensions can be used elsewhere
- ✅ Maintainability: separate updates for each module
- ✅ Automatic loading: no need to manually manage dependencies

**Best practices:**
- Include only necessary dependencies
- Always document the role of each child extension
- Use descriptive tag names for dependencies

## 2. 🚀 Component Class

The main logic extends `KimuComponentElement` and implements the extension behavior:

```typescript
import { KimuComponentElement } from '../core/kimu-component-element';

@KimuComponent({
  tag: 'my-calculator',
  name: 'Smart Calculator',
  version: '1.0.0',
  description: 'Calculator with history',
  icon: '🧮',
  author: 'KIMU Team'
})
export class CalculatorExtension extends KimuComponentElement {
  // Private properties
  private result: number = 0;
  private history: string[] = [];
  
  // Component lifecycle
  onInit() {
    console.log('Calculator initialized');
    this.loadSettings();
  }
  
  onRender() {
    this.updateDisplay();
    this.bindEventListeners();
  }
  
  onDestroy() {
    this.saveSettings();
  }
  
  // Utility methods
  private loadSettings() {
    const saved = localStorage.getItem('calc-settings');
    if (saved) {
      this.history = JSON.parse(saved);
    }
  }
  
  private saveSettings() {
    localStorage.setItem('calc-settings', JSON.stringify(this.history));
  }
  
  private updateDisplay() {
    const display = this.$('#display');
    if (display) {
      display.textContent = this.result.toString();
    }
  }
  
  private bindEventListeners() {
    this.$('#btn-add')?.addEventListener('click', () => this.add());
    this.$('#btn-clear')?.addEventListener('click', () => this.clear());
  }
  
  // Public methods
  add() {
    // Addition logic
    this.result += 1;
    this.onRender();
  }
  
  clear() {
    this.result = 0;
    this.history = [];
    this.onRender();
  }
}
```

### Component Properties

The class can contain various types of properties:

| Type | Purpose | Example |
|------|---------|---------|
| **Private Properties** | Internal state | `private count: number = 0` |
| **Public Properties** | External API | `public isVisible: boolean = true` |
| **Static Properties** | Shared constants | `static readonly MAX_VALUE = 100` |
| **Getters/Setters** | Computed properties | `get formattedValue() { return... }` |

### Lifecycle Methods

| Method | When Called | Purpose |
|--------|-------------|---------|
| `onInit()` | Component creation | Initialization, load settings |
| `onRender()` | DOM update | Update interface, bind events |
| `onDestroy()` | Component removal | Cleanup, save settings |

### Utility Methods

KIMU provides built-in utility methods for common operations:

| Method | Purpose | Example |
|--------|---------|---------|
| `this.$('#id')` | Element selection | `this.$('#button')` |
| `this.$$('.class')` | Multiple selection | `this.$$('.item')` |
| `this.on('event', handler)` | Event registration | `this.on('click', this.onClick)` |
| `this.off('event', handler)` | Event removal | `this.off('click', this.onClick)` |
| `this.emit('event', data)` | Event emission | `this.emit('update', { value: 10 })` |
| `this.render()` | Force re-render | `this.render()` |

### 📊 Data Binding with getData()

The `getData()` method is the heart of data binding. It returns an object containing all data to pass to the HTML template:

```typescript
export class MyExtension extends KimuComponentElement {
  
  // 🔐 Private extension state
  private counter = 0;
  private isActive = true;

  // 📊 Main method: connects data to template
  getData() {
    return {
      // Simple data
      counter: this.counter,
      isActive: this.isActive,
      
      // Event handlers
      onIncrement: () => {
        this.counter++;
        this.refresh(); // Re-render extension
      },
      
      onToggle: () => {
        this.isActive = !this.isActive;
        this.refresh();
      }
    };
  }

  // 🔄 Lifecycle hooks
  onInit(): void {
    console.log('Extension initialized');
  }

  onRender(): void {
    console.log('Extension rendered');
  }

  onDestroy(): void {
    console.log('Extension disposed');
  }
}
```

**Key benefits of `getData()`:**
- ✅ **Reactive**: data changes trigger automatic re-renders
- ✅ **Clean**: separates data from template logic
- ✅ **Flexible**: supports any JavaScript data type
- ✅ **Safe**: data is encapsulated in the component

## 3. 🎨 HTML Template

The HTML template (`view.html`) defines the dynamic user interface with special template syntax:

```html
<div class="extension-container">
  <!-- 📝 Simple interpolation -->
  <h3>${name}</h3>
  <p>Counter value: ${counter}</p>
  
  <!-- 🔘 Event binding -->
  <button @click=${onIncrement} class="btn-primary">
    + Increment
  </button>
  
  <button @click=${onToggle} class="btn-secondary">
    Toggle: ${isActive ? 'ON' : 'OFF'}
  </button>
  
  <!-- 🔀 Conditional rendering -->
  ${isActive ? `
    <div class="status-active">
      <h4>🟢 Status: Active</h4>
      <p>The component is currently active and processing data.</p>
      
      <!-- 🔁 Lists and iteration -->
      <ul class="feature-list">
        ${features.map(feature => `
          <li class="feature-item">
            <span class="icon">${feature.icon}</span>
            <span class="name">${feature.name}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  ` : `
    <div class="status-inactive">
      <h4>🔴 Status: Inactive</h4>
      <p>The component is currently inactive.</p>
    </div>
  `}
  
  <!-- 📋 Form inputs with two-way binding -->
  <div class="input-section">
    <label for="user-input">Enter value:</label>
    <input 
      id="user-input"
      type="text" 
      value="${inputValue}"
      @input=${onInputChange}
      placeholder="Type something..."
    />
  </div>
  
  <!-- 🎯 Child components usage -->
  ${dependencies.length > 0 ? `
    <div class="child-components">
      <h4>Child Components:</h4>
      <!-- Use child extensions as HTML tags -->
      <chart-widget data="${chartData}"></chart-widget>
      <data-table items="${tableItems}"></data-table>
    </div>
  ` : ''}
</div>
```

### Template Syntax

KIMU uses a modern, powerful template syntax:

| Syntax | Purpose | Example |
|--------|---------|---------|
| `${expression}` | **Data interpolation** | `${user.name}` |
| `@event=${handler}` | **Event binding** | `@click=${onClick}` |
| `` ${condition ? `html` : `other`} `` | **Conditional rendering** | `${isVisible ? 'Show' : 'Hide'}` |
| `${array.map(...).join('')}` | **List rendering** | `${items.map(item => ...)}` |
| `<child-tag></child-tag>` | **Child components** | `<my-widget></my-widget>` |

### Advanced Template Examples

**Conditional classes:**
```html
<div class="item ${isActive ? 'active' : 'inactive'}">
  Content
</div>
```

**Dynamic attributes:**
```html
<input 
  type="text" 
  disabled="${isReadonly}"
  placeholder="${placeholderText}"
/>
```

**Complex iterations:**
```html
${users.filter(u => u.active).map(user => `
  <div class="user-card">
    <img src="${user.avatar}" alt="${user.name}" />
    <h4>${user.name}</h4>
    <p>${user.role}</p>
    <button @click=${() => onUserSelect(user.id)}>
      Select
    </button>
  </div>
`).join('')}
```

## 🔗 Complete Integration Example

Here's how all three components work together in a practical calculator:

### Decorator + Class:
```typescript
@KimuComponent({
  tag: 'smart-calculator',
  name: 'Smart Calculator',
  version: '2.1.0',
  description: 'Calculator with history and memory',
  icon: '🧮',
  author: 'KIMU Team'
})
export class SmartCalculator extends KimuComponentElement {
  private currentValue: number = 0;
  private operation: string = '';
  private previousValue: number = 0;
  private history: string[] = [];

  getData() {
    return {
      // Data
      currentValue: this.currentValue,
      previousValue: this.previousValue,
      operation: this.operation,
      history: this.history,
      hasHistory: this.history.length > 0,
      
      // Event handlers
      onNumberClick: (num: number) => {
        this.currentValue = this.currentValue * 10 + num;
        this.refresh();
      },
      
      onOperationClick: (op: string) => {
        this.operation = op;
        this.previousValue = this.currentValue;
        this.currentValue = 0;
        this.refresh();
      },
      
      onEqualsClick: () => {
        const result = this.calculate();
        this.history.push(`${this.previousValue} ${this.operation} ${this.currentValue} = ${result}`);
        this.currentValue = result;
        this.operation = '';
        this.previousValue = 0;
        this.refresh();
      },
      
      onClearClick: () => {
        this.currentValue = 0;
        this.operation = '';
        this.previousValue = 0;
        this.refresh();
      },
      
      onClearHistoryClick: () => {
        this.history = [];
        this.refresh();
      }
    };
  }
  
  private calculate(): number {
    switch (this.operation) {
      case '+': return this.previousValue + this.currentValue;
      case '-': return this.previousValue - this.currentValue;
      case '*': return this.previousValue * this.currentValue;
      case '/': return this.currentValue !== 0 ? this.previousValue / this.currentValue : 0;
      default: return this.currentValue;
    }
  }
}
```

### Template:
```html
<div class="smart-calculator">
  <!-- Display -->
  <div class="display">
    <div class="current-value">${currentValue}</div>
    <div class="operation-display">
      ${operation ? `${previousValue} ${operation}` : ''}
    </div>
  </div>
  
  <!-- Number buttons -->
  <div class="buttons-grid">
    ${[7,8,9,4,5,6,1,2,3,0].map(num => `
      <button class="btn-number" @click=${() => onNumberClick(num)}>
        ${num}
      </button>
    `).join('')}
    
    <!-- Operation buttons -->
    <button class="btn-operation" @click=${() => onOperationClick('+')}>+</button>
    <button class="btn-operation" @click=${() => onOperationClick('-')}>-</button>
    <button class="btn-operation" @click=${() => onOperationClick('*')}>×</button>
    <button class="btn-operation" @click=${() => onOperationClick('/')}>/</button>
    
    <!-- Action buttons -->
    <button class="btn-action" @click=${onEqualsClick}>=</button>
    <button class="btn-action" @click=${onClearClick}>C</button>
  </div>
  
  <!-- History -->
  ${hasHistory ? `
    <div class="history-section">
      <h4>Calculation History</h4>
      <ul class="history-list">
        ${history.map(entry => `
          <li class="history-item">${entry}</li>
        `).join('')}
      </ul>
      <button class="btn-clear-history" @click=${onClearHistoryClick}>
        Clear History
      </button>
    </div>
  ` : ''}
</div>
```

## 🔗 How It All Works Together

1. **🏷️ Registration:** `@KimuComponent` registers the extension in the KIMU system
2. **🏗️ Instantiation:** KIMU creates a class instance when the extension is requested
3. **🎨 Rendering:** HTML template is populated with data from `getData()`
4. **⚡ Interaction:** Event handlers manage user actions and update the state
5. **🔄 Updates:** `refresh()` re-renders the interface when state changes
6. **🧹 Cleanup:** `onDestroy()` is called when the extension is removed

## ✨ Best Practices

### Structure
- ✅ Keep the decorator metadata complete and descriptive
- ✅ Use TypeScript for type safety in the component class
- ✅ Separate concerns: logic in class, presentation in template
- ✅ Use meaningful names for properties and methods

### Performance
- ✅ Minimize the frequency of `refresh()` calls
- ✅ Use conditional rendering for complex sections
- ✅ Avoid heavy computations in `getData()`
- ✅ Implement proper cleanup in `onDestroy()`

### Maintainability
- ✅ Document complex logic with comments
- ✅ Use consistent naming conventions
- ✅ Break down large components into smaller ones
- ✅ Test extension behavior thoroughly

## 📚 Next Steps

Now that you understand the complete anatomy, explore:

- **[Development Patterns](./patterns.md)** - Common patterns for different extension types
- **[Advanced Templates](./templates.md)** - Advanced templating techniques and optimizations
- **[Lifecycle Management](./lifecycle.md)** - In-depth component lifecycle and state management
- **[Component Communication](./communication.md)** - How components interact with each other

