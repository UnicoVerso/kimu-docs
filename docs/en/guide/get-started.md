# 🚀 Get Started with KIMU Core

Welcome to **KIMU – Keep It Minimal UI Framework**!  

This guide will walk you through the basic steps to download, install, and run the core-framework for the first time.

## 🔧 Prerequisites

Before you start, make sure the following tools are installed on your system:

- [**Git**](https://git-scm.com/) – to clone the repository and manage code versions  
  Recommended: version ≥ 2.30

- [**Node.js**](https://nodejs.org/) – to install and run the project dependencies  
  Recommended: **LTS version** (≥ 18.x)  
  This also includes `npm`, the Node.js package manager

- [**TypeScript**](https://www.typescriptlang.org/) – required for compiling `.ts` files  
  Install locally with:
  ```bash
  npm install --save-dev typescript
  ```
  Or install globally with:
  ```bash
  npm install -g typescript
  ```

- (Optional) [**Python 3.x**](https://www.python.org/downloads/) – used for the `py-server` script to quickly serve static files from the `dist` directory:
  ```bash
  python3 -m http.server 5173 --directory ./dist
  ```
  
💡 You can verify the installation by running:
```bash
git --version
node -v
npm -v
```
If any of these commands fails, please install the corresponding tool from the links above before continuing.

---

## 🏗️ How to create a new project with KIMU Core

This section guides you step-by-step in creating a new project using **KIMU Core** as a framework, ideal for those starting from scratch and developing custom extensions.

### 1. Recommended project structure

Organize your project as follows:

```text
my-kimu-app/
  src/
    core/         # (optional) Core overrides or extensions
    extensions/   # Your custom extensions
    utils/        # Utilities
    models/       # Data models
  tests/          # Tests
  scripts/        # CLI scripts
  docs/           # Documentation
  dist/           # Production build
  package.json
  tsconfig.json
  README.md
```

### 2. Initialize the project and install KIMU Core

```bash
git clone https://github.com/UnicoVerso/kimu-core.git
# or, if available on npm:
# npm install kimu-core

cd my-kimu-app
npm init -y
npm install --save-dev typescript
# Copy/create a suitable tsconfig.json (you can use the one from kimu-core as reference)
```

### 3. Create your first extension

1. Create a folder in `src/extensions/hello-world/`
2. Inside, create these files:
   - `component.ts` (main logic)
   - `style.css` (styles)
   - `view.html` (UI template)

Example `component.ts`:

```typescript
import { KimuComponent } from 'kimu-core/src/core/kimu-component';
import { KimuComponentElement } from 'kimu-core/src/core/kimu-component-element';

@KimuComponent({
  tag: 'hello-world',
  name: 'Hello World',
  version: '1.0.0',
  description: 'Minimal example extension',
  author: 'YourName',
  icon: '👋',
  internal: false,
  path: 'hello-world',
  dependencies: []
})
export class HelloWorldComponent extends KimuComponentElement {
  onInit() {
    console.log('Hello World extension loaded!');
  }
}
```

### 4. Register the extension

Add your extension to the `extension-manifest.json` file at the project root, for example:

```json
[
  {
    "tag": "hello-world",
    "name": "Hello World",
    "version": "1.0.0",
    "description": "Minimal example extension",
    "author": "YourName",
    "icon": "👋",
    "internal": false,
    "path": "hello-world",
    "dependencies": []
  }
]
```

### 5. Best practices and checklist

- Follow KIMU Core style and structure conventions
- Write modular and well-documented code
- Use only KIMU Core public APIs
- Add tests in `/tests` and update documentation in `/docs`
- Always consult the official documentation and update yours if you add new features

---
