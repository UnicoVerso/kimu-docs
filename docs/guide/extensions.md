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

@KimuComponent({
  tag: 'hello-world',
  name: 'Hello World',
  version: '1.0.0',
  description: 'A simple hello world extension',
  author: 'Your Name',
  icon: '👋',
  path: 'hello-world',
  dependencies: []
})
export class HelloWorld extends KimuComponentElement {
  // Custom logic here
}
```

**view.html**
```html
<div class="hello-world">
  <h1>Hello, World!</h1>
</div>
```

**style.css**
```css
.hello-world {
  color: #2196f3;
  font-family: sans-serif;
}
```


## 🛠️ How Extensions Work

- **Registration:** Each extension uses the `@KimuComponent` decorator to provide metadata. This allows automatic discovery and integration.
- **Compilation:** During build, extensions are compiled into pure Web Components. At runtime, they are registered and rendered dynamically. The result is a reusable HTML custom element.
- **Manifest:** The `extensions-manifest.json` file tracks installed/available extensions, their state, and dependencies.
- **Runtime loading:** New extensions can be loaded via API or UI, without restarting the app. This enables hot-reload and rapid prototyping.
- **Isolation:** Each extension runs in its own scope, avoiding conflicts and making maintenance easier.
- **Dependency management:** You can declare dependencies between extensions or modules, ensuring correct load order.
- **Testing & Debug:** Extensions can be tested independently. KIMU-CORE aims to provide tools for live debugging and inspection.


## 🔄 Lifecycle & Interaction

- **Initialization:** On startup, the extension runs its `init` logic, sets up state, and renders the view.
- **Update:** It can react to state changes, events, or external triggers, updating the view and logic.
- **Destruction:** When removed, it frees resources and listeners to avoid memory leaks.
- **Communication:** You can listen to custom events, react to state changes, and trigger actions in other extensions via events, shared stores, or service injection.
- **Hooks:** Lifecycle hooks (`onInit`, `onUpdate`, `onDestroy`, etc.) are available for fine-grained control.



## 🌐 Sharing & Distribution

- Extensions can be packaged and distributed as standalone modules.
- You can create a library of reusable extensions for your team or the community.
- KIMU-CORE will support an online playground for real-time development and testing.
- Extensions can be published to npm, shared via zip, or loaded from remote URLs.



## 📦 The `extensions-manifest.json` File

The `extensions-manifest.json` file (located in `src/extensions/`) is the registry for all available and installed extensions. It contains metadata such as:

- Extension name, tag, version, author, description
- Path to the extension folder
- Dependencies and state (enabled/disabled)

**Example entry:**
```json
{
  "hello-world": {
    "tag": "hello-world",
    "name": "Hello World",
    "version": "1.0.0",
    "author": "Your Name",
    "description": "A simple hello world extension",
    "path": "hello-world",
    "dependencies": [],
    "enabled": true
  }
}
```



### Adding an Extension Manually

1. Create a new folder in `src/extensions/` with the required files (`component.ts`, `view.html`, `style.css`).
2. Add a new entry to `extensions-manifest.json` with the correct metadata.
3. Make sure the `enabled` field is set to `true` if you want it loaded at runtime.
4. Run the build script to compile the extension(s).



## 🛠️ Build Scripts Overview

KIMU-CORE provides several scripts in the `scripts/` folder to help you build and manage extensions:

- **build-extension.js**: Builds a single extension. Use this to compile only the extension you are working on.
- **build-all-extensions.js**: Builds all extensions found in the manifest. Use this for a full rebuild of all extensions.
- **clear-kimu-build.js**: Cleans the build output, removing previous compiled files.
- **generate-kimu-build-config.js**: Generates configuration files needed for the build process.

For more details on each script and advanced usage, see the upcoming [Scripts Guide](./scripts.md).



## 🏷️ Extension Metadata

Each extension must declare a set of metadata, both in its `@KimuComponent` decorator and in the `extensions-manifest.json` file. Metadata are essential for:

- Automatic discovery and registration of extensions
- Displaying extension info in the UI
- Managing dependencies and compatibility
- Enabling or disabling extensions at runtime
- Versioning and updates



### Main Metadata Fields

| Field         | Description                                                      |
|-------------- |------------------------------------------------------------------|
| `tag`         | Unique HTML tag for the Web Component (e.g. `hello-world`)        |
| `name`        | Human-readable name of the extension                              |
| `version`     | Extension version (semantic versioning recommended)               |
| `author`      | Author or maintainer name                                        |
| `description` | Short description of the extension                               |
| `icon`        | Icon (emoji or SVG) for UI listing                               |
| `path`        | Folder name/path inside `src/extensions/`                        |
| `dependencies`| Array of required extensions or modules                          |
| `enabled`     | Boolean, whether the extension is active                         |

Other custom metadata fields can be added as needed for advanced scenarios.

**Tip:** Always keep metadata up to date to ensure smooth integration and management.



## 💡 Best Practices

- Keep each extension focused on a single responsibility.
- Use clear and descriptive metadata in the decorator.
- Document dependencies and usage.
- Test extensions independently before integration.
- Share and reuse extensions to speed up development.
- Take advantage of runtime loading for rapid prototyping and feature toggling.
- Prefer stateless components when possible for easier testing and reuse.
- Maintain MVC separation between logic, view, and style.
- Avoid direct DOM manipulation—use the Web Component API and KIMU-CORE helpers.
- Consider accessibility and performance in your design.



## 📚 Further Reading

## ❓ FAQ & Advanced Topics

- **Can I load extensions from remote sources?** Yes, if they follow the manifest and build conventions.
- **How do I debug an extension?** Use browser dev tools and KIMU-CORE's live debugger (coming soon).
- **Can extensions depend on each other?** Yes, declare dependencies in the decorator.
- **How do I share state between extensions?** Use shared stores or service injection.
- **Can I override core behavior?** Only via extension points and hooks—the core remains untouched.
- **Can I use third-party libraries?** Yes, but keep dependencies minimal for portability.
- **How do I test extensions?** Write unit tests for logic and use the playground for UI testing.
- **Are extensions secure?** Each extension runs isolated, but always validate input and follow security best practices.
- **Can I use extensions outside KIMU-CORE?** Yes, they are standard Web Components.
- **What is the build output?** Each extension is compiled into a custom element (Web Component), with logic, view, and style encapsulated.

## 🗺️ Roadmap & Future Features

- Online playground and live editor
- Extension marketplace and sharing platform
- Advanced debugging and profiling tools
- Improved dependency management
- Support for embedded, mobile, and more environments
- Advanced documentation and tutorials

For details, see also [API Reference](./api.md), [Architecture](./architecture.md), [Lifecycle](./lifecycle.md), [Modules](./modules.md), [Helpers & Services](./helpers.md)
