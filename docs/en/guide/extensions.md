# Extensions

KIMU-CORE is built around the concepts of modularity and extensibility. Extensions are the heart of customization, expansion, and evolution of your application—without ever touching the core code.

## 🚀 Why Extensions?

- **Modularity:** Every feature, UI element, or logic block can be an extension. Add only what you need, keeping your app light and focused.
- **Runtime loading:** Extensions can be loaded, updated, or removed even while the app is running—no need to rebuild or redeploy the core.
- **Pure Web Component:** Each extension, once compiled, becomes a standard Web Component, compatible with any modern browser and framework. You can reuse extensions even outside KIMU-CORE.
- **MVC structure:** Clear separation between:
  - **Model:** logic and state (`component.ts`)
  - **View:** UI template (`view.html`)
  - **Controller:** lifecycle and interaction logic (`component.ts`)
  - **Style:** custom CSS (`style.css`)
- **Scalability:** You can build anything, from a simple button to a complete app as an extension.
- **Community & sharing:** Extensions can be packaged, shared, and reused across projects and teams.
- **Isolation:** Each extension runs in its own scope, avoiding conflicts and making maintenance easier.
- **Security:** Isolation reduces risks of collision and vulnerabilities.
- **Educational & Embedded:** The lightweight and modular nature makes KIMU-CORE ideal for educational projects, rapid prototyping, and embedded applications.

## 🧩 Extension Structure
Each extension is a folder inside `src/extensions/` with at least these files:

```
extensions/
  my-extension/
    component.ts      # Logic, metadata, controller
    view.html         # UI template
    style.css         # Styles
```

### Example: Hello World Extension

**component.ts**
```typescript
import { KimuComponent } from '../../core/kimu-component';
import { KimuComponentElement } from '../../core/kimu-component-element';
