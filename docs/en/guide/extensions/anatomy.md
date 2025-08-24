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
  kimuVersion: '1.0.0'        // Required KIMU version
})
```

## 2. 🎯 Component Class: Logic and State

The component class manages the extension's logic:

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

## 3. 🎨 HTML Template: Dynamic UI

The HTML template defines the user interface with dynamic syntax:

```html
<div class="extension-container">
  <!-- 📝 Simple interpolation -->
  <h3>${name}</h3>
  <p>Value: ${counter}</p>
  
  <!-- 🔘 Event binding -->
  <button @click=${onIncrement}>Increment</button>
  <button @click=${onToggle}>Toggle Status</button>
  
  <!-- 🔀 Conditional rendering -->
  ${isActive ? `
    <div class="active-content">
      <p>Active content!</p>
    </div>
  ` : `
    <div class="inactive-content">
      <p>Inactive content</p>
    </div>
  `}
</div>
```

## 🔗 How It Works Together

1. **Registration:** `@KimuComponent` registers the extension in the system
2. **Instantiation:** KIMU creates a class instance when requested
3. **Rendering:** Template is populated with data from `getData()`
4. **Interaction:** Event handlers manage user actions
5. **Updates:** `refresh()` updates the interface when state changes

## 📚 Next Steps

Now that you know the basic anatomy, explore:

- **[Development Patterns](./patterns.md)** - Common patterns for different extension types
- **[Advanced Templates](./templates.md)** - Advanced interface techniques
- **[Lifecycle](./lifecycle.md)** - In-depth lifecycle management
