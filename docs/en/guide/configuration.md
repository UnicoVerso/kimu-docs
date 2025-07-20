# 🗂️ Configuration & Environments

KIMU-CORE supports multiple environments and flexible configuration to adapt to different development and deployment needs.

---

## 📦 Configuration Files

- The `config/` and `env/` folders contain configuration files for each environment:
  - `dev.config.json` (development)
  - `prod.config.json` (production)
  - `test.config.json` (testing)
  - `local.config.json` (local development)
  - `staging.config.json` (staging)
- These files define variables, paths, build options, and runtime settings.

---

## 🌍 Environment Selection

- You can select the environment using npm scripts:
  - `npm run build:dev` (development)
  - `npm run build:prod` (production)
  - `npm run build:test` (testing)
  - `npm run build:local` (local)
- Each script loads the corresponding configuration file and applies its settings.
- You can create custom environments by adding new config files and scripts.

---

## ⚙️ Custom Configuration

- You can extend or override configuration by creating new files in `env/` or `config/`.
- Document your custom options for maintainability.

---

## 🕒 Runtime vs Build Time

- Some configuration options are read only at build time (e.g., bundling, environment variables).
