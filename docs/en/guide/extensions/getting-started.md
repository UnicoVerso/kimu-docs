# Getting Started

This guide will walk you through creating your first KIMU extension, step by step.

## 🧩 Extension Structure

Each extension is a folder inside `src/extensions/` with at least these files:

```
extensions/
  my-extension/
    component.ts      # Logic, metadata, controller
    view.html         # UI template
    style.css         # Styles
```

### Required Files

| File | Description | Required |
|------|-------------|:--------:|
| `component.ts` | Main class with metadata and logic | ✅ |
| `view.html` | HTML interface template | ✅ |
| `style.css` | Custom stylesheets | ❌ |

## 🚀 Your First "Hello World"

Let's create a simple extension together to understand the basic concepts.

### 1. Create the Folder

```bash
mkdir src/extensions/hello-world
```

### 2. TypeScript Component (`component.ts`)

```typescript
import { KimuComponent } from '../../core/kimu-component';
import { KimuComponentElement } from '../../core/kimu-component-element';

@KimuComponent({
  tag: 'hello-world',           // Unique HTML tag (required)
  name: 'Hello World',          // Descriptive name
  version: '1.0.0',            // Semantic version
  description: 'My first KIMU extension',
  icon: '👋',                  // Emoji icon
  author: 'Your name',         // Author
  path: 'hello-world',         // Folder path
  internal: false              // false = visible to users
})
export class HelloWorld extends KimuComponentElement {
  
  // Main method: exposes data and handlers to template
  getData() {
    return {
      message: 'Hello World from KIMU!',
      timestamp: new Date().toLocaleString()
    };
  }

  // Lifecycle hook (optional)
  onInit(): void {
    console.log('Hello World extension initialized');
  }
}
```

### 3. HTML Template (`view.html`)

```html
<div class="hello-container">
  <h2>🚀 ${message}</h2>
  <p>Created on: ${timestamp}</p>
</div>
```

### 4. CSS Styles (`style.css`)

```css
.hello-container {
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.hello-container h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}
```

## 🎯 Testing the Extension

1. **Save all files** in the `src/extensions/hello-world/` folder
2. **Restart the development server**:
   ```bash
   npm run dev
   ```
3. **Open the app** and look for "Hello World" in the extensions list
4. **Add the extension** to the layout—you should see your message!

## 🔍 What Happens Under the Hood?

1. **Registration:** The `@KimuComponent` decorator automatically registers the extension
2. **Compilation:** KIMU compiles the extension into a standard Web Component
3. **Rendering:** The `getData()` method provides data to the `view.html` template
4. **Styling:** CSS is encapsulated in the extension's Shadow DOM

## ✨ Next Steps

Now that you've created your first extension, you can:

- **[Deep dive into anatomy](./anatomy.md)** to better understand the components
- **[Discover patterns](./patterns.md)** for different types of extensions  
- **[Learn communication](./communication.md)** between extensions
- **[Explore advanced templates](./templates.md)** for more complex UIs

## 🎉 Congratulations!

You just created your first KIMU extension! 🚀

The next step is to explore the [detailed anatomy](./anatomy.md) to better understand each component.
