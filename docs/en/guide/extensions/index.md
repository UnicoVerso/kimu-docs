# KIMU Extensions

KIMU-CORE is built around the concepts of modularity and extensibility. Extensions are the heart of customization, expansion, and evolution of your application—without ever touching the core code.

## 🚀 Why Extensions?

- **Modularity:** Every feature, UI element, or logic block can be an extension. Add only what you need, keeping the app lightweight and focused.
- **Runtime loading:** Extensions can be loaded, updated, or removed even at runtime—without having to rebuild or redistribute the core.
- **Pure Web Components:** Each extension, once compiled, becomes a standard Web Component, compatible with any modern browser and framework. You can reuse extensions even outside of KIMU-CORE.
- **MVC Structure:** Clear separation between:
  - **Model:** logic and state (`component.ts`)
  - **View:** UI template (`view.html`)
  - **Controller:** lifecycle logic and interaction (`component.ts`)
  - **Style:** custom CSS (`style.css`)
- **Scalability:** You can build anything from a simple button to a complete app as an extension.
- **Community & sharing:** Extensions can be packaged, shared, and reused across projects and teams.
- **Isolation:** Each extension runs in its own scope, avoiding conflicts and facilitating maintenance.
- **Security:** Isolation reduces risks of collisions and vulnerabilities.
- **Educational & Embedded:** The lightweight and modular nature makes KIMU-CORE ideal for educational projects, rapid prototyping, and embedded applications.

## 📚 Extensions Guide

This guide is organized into logical sections to help you master extension development in KIMU:

### 🏁 [Get Started](./getting-started.md)
Learn the basic structure of an extension and create your first "Hello World".

### 🔧 [Extension Anatomy](./anatomy.md)
Deep dive into the fundamental components: decorator, component class, and templates.

### 🎭 [Development Patterns](./patterns.md)
Discover the most common patterns for different types of extensions: static, interactive, dynamic.

### 🔄 [Communication](./communication.md)
Learn how to make extensions communicate with each other using events and global store.

### 🎨 [Advanced Templates](./templates.md)
Master advanced techniques for dynamic and interactive HTML templates.

### 📦 [Lifecycle](./lifecycle.md)
Properly manage initialization, updates, and cleanup of extensions.

### 🚀 [Best Practices](./best-practices.md)
Follow best practices for robust, performant, and maintainable extensions.

## 🎯 What You Can Build

KIMU extensions can be:

- **UI Widgets:** Buttons, cards, forms, dashboards
- **Complete Applications:** Todo lists, chat, editors
- **Integrations:** External APIs, services, databases
- **Tools:** Calculators, converters, utilities
- **Games:** Puzzles, quizzes, simulations
- **Educational Components:** Interactive lessons, quizzes

## 🚀 Start Now!

Ready to create your first extension? Start with the [Getting Started Guide](./getting-started.md)!
