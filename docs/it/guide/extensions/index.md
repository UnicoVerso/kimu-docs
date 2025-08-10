# Estensioni KIMU

KIMU-CORE è costruito attorno ai concetti di modularità ed estensibilità. Le estensioni sono il cuore della personalizzazione, dell'espansione e dell'evoluzione della tua applicazione—senza mai toccare il codice core.

## 🚀 Perché le Estensioni?

- **Modularità:** Ogni funzionalità, elemento UI o blocco logico può essere un'estensione. Aggiungi solo ciò che ti serve, mantenendo l'app leggera e focalizzata.
- **Caricamento a runtime:** Le estensioni possono essere caricate, aggiornate o rimosse anche a runtime—senza dover ricostruire o ridistribuire il core.
- **Web Component puro:** Ogni estensione, una volta compilata, diventa uno standard Web Component, compatibile con qualsiasi browser moderno e framework. Puoi riutilizzare le estensioni anche fuori da KIMU-CORE.
- **Struttura MVC:** Chiara separazione tra:
  - **Model:** logica e stato (`component.ts`)
  - **View:** template UI (`view.html`)
  - **Controller:** logica di ciclo di vita e interazione (`component.ts`)
  - **Style:** CSS personalizzato (`style.css`)
- **Scalabilità:** Puoi costruire qualsiasi cosa, da un semplice bottone a un'app completa come estensione.
- **Community & condivisione:** Le estensioni possono essere pacchettizzate, condivise e riutilizzate tra progetti e team.
- **Isolamento:** Ogni estensione gira nel proprio scope, evitando conflitti e facilitando la manutenzione.
- **Sicurezza:** L'isolamento riduce i rischi di collisione e vulnerabilità.
- **Didattica & Embedded:** La natura leggera e modulare rende KIMU-CORE ideale per progetti educativi, prototipazione rapida e applicazioni embedded.

## 📚 Guida alle Estensioni

Questa guida è organizzata in sezioni logiche per aiutarti a padroneggiare lo sviluppo di estensioni in KIMU:

### 🏁 [Inizia Subito](./getting-started.md)
Impara la struttura di base di un'estensione e crea il tuo primo "Hello World".

### 🔧 [Anatomia di un'Estensione](./anatomy.md)
Approfondisci i componenti fondamentali: decorator, classe component e template.

### 🎭 [Pattern di Sviluppo](./patterns.md)
Scopri i pattern più comuni per diversi tipi di estensioni: statiche, interattive, dinamiche.

### 🔄 [Comunicazione](./communication.md)
Impara come far comunicare le estensioni tra loro usando eventi e store globale.

### 🎨 [Template Avanzati](./templates.md)
Padroneggia le tecniche avanzate per template HTML dinamici e interattivi.

### 📦 [Ciclo di Vita](./lifecycle.md)
Gestisci correttamente l'inizializzazione, aggiornamenti e pulizia delle estensioni.

### 🚀 [Best Practices](./best-practices.md)
Segui le migliori pratiche per estensioni robuste, performanti e manutenibili.

## 🎯 Cosa Puoi Costruire

Le estensioni KIMU possono essere:

- **Widget UI:** Bottoni, cards, form, dashboard
- **Applicazioni complete:** Todo list, chat, editor
- **Integrazioni:** API esterne, servizi, database
- **Strumenti:** Calcolatrici, convertitori, utility
- **Giochi:** Puzzle, quiz, simulazioni
- **Componenti educativi:** Lezioni interattive, quiz

## 🚀 Inizia Ora!

Pronto a creare la tua prima estensione? Inizia con la [Guida Introduttiva](./getting-started.md)!
