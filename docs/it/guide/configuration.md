# 🗂️ Configurazione & Ambienti

KIMU-CORE supporta più ambienti e una configurazione flessibile per adattarsi a diverse esigenze di sviluppo e deploy.

---

## 📦 File di Configurazione

- Le cartelle `config/` e `env/` contengono i file di configurazione per ogni ambiente:
  - `dev.config.json` (sviluppo)
  - `prod.config.json` (produzione)
  - `test.config.json` (test)
  - `local.config.json` (sviluppo locale)
  - `staging.config.json` (staging)
- Questi file definiscono variabili, percorsi, opzioni di build e impostazioni di runtime.

---

## 🌍 Selezione dell'Ambiente

- Puoi selezionare l'ambiente usando gli script npm:
  - `npm run build:dev` (sviluppo)
  - `npm run build:prod` (produzione)
  - `npm run build:test` (test)
  - `npm run build:local` (locale)
- Ogni script carica il file di configurazione corrispondente e applica le sue impostazioni.
- Puoi creare ambienti personalizzati aggiungendo nuovi file di configurazione e script.

---

## ⚙️ Configurazione Personalizzata

- Puoi estendere o sovrascrivere la configurazione creando nuovi file in `env/` o `config/`.
- Documenta le tue opzioni personalizzate per una migliore manutenzione.

---

## 🕒 Runtime vs Build Time

- Alcune opzioni di configurazione vengono lette solo in fase di build (es. bundling, variabili d'ambiente).
