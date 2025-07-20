# 🔄 Component Lifecycle in KIMU-CORE

Understanding the lifecycle of a component is essential for building robust and maintainable extensions and UI elements in KIMU-CORE.


## Lifecycle Phases

1. **Creation**
   - The component is instantiated and its constructor is called.
   - Initial properties and state are set.

2. **Initialization**
   - Lifecycle hooks (e.g., `onInit`, `connectedCallback`) are triggered.
   - The component is registered and ready to interact with other parts of the system.

3. **Rendering**
   - The component's template is rendered to the DOM.
   - Any dynamic data or bindings are applied.

4. **Update**
   - When state or properties change, the component re-renders or updates only the affected parts.
   - Hooks like `onUpdate` or `attributeChangedCallback` may be called.

5. **Destruction**
   - When the component is removed from the DOM, cleanup hooks (e.g., `onDestroy`, `disconnectedCallback`) are called.
   - Resources, listeners, and timers are released.


## Example Lifecycle Hooks

```typescript
class MyComponent extends KimuComponentElement {
  constructor() {
    super();
    // Initialization logic
  }

  connectedCallback() {
    super.connectedCallback();
    // Called when added to the DOM
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Called when removed from the DOM
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // React to attribute changes
  }
}
```


## Best Practices

- Use lifecycle hooks to manage resources, listeners, and side effects.
- Avoid heavy logic in constructors; prefer `connectedCallback` or `onInit`.
- Always clean up in `disconnectedCallback` or `onDestroy` to prevent memory leaks.


For more details, see the [Main Components](./architecture.md#main-components) section or explore the source code in `core/kimu-component-element.ts`.
