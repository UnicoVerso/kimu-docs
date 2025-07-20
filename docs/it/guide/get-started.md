# 🚀 Inizia con KIMU Core

Benvenuto in **KIMU – Keep It Minimal UI Framework**!  

Questa guida ti accompagnerà nei passaggi fondamentali per scaricare, installare ed eseguire il core-framework per la prima volta.

## 🔧 Prerequisiti

Prima di iniziare, assicurati di avere installato sul tuo sistema i seguenti strumenti:

- [**Git**](https://git-scm.com/) – per clonare il repository e gestire le versioni del codice  
  Consigliato: versione ≥ 2.30

- [**Node.js**](https://nodejs.org/) – per installare ed eseguire le dipendenze del progetto  
  Consigliato: versione **LTS** (≥ 18.x)  
  Include anche `npm`, il gestore pacchetti di Node.js

- [**TypeScript**](https://www.typescriptlang.org/) – necessario per compilare i file `.ts`  
  Installa localmente con:
  ```bash
  npm install --save-dev typescript
  ```
  Oppure installa globalmente con:
  ```bash
  npm install -g typescript
  ```

- (Opzionale) [**Python 3.x**](https://www.python.org/downloads/) – usato per lo script `py-server` per servire rapidamente i file statici dalla cartella `dist`:
  ```bash
  python3 -m http.server 5173 --directory ./dist
  ```
  
💡 Puoi verificare l'installazione eseguendo:
```bash
git --version
node -v
npm -v
```
Se uno di questi comandi fallisce, installa lo strumento corrispondente dai link sopra prima di continuare.
