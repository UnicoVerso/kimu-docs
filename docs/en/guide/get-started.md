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
