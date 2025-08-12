# Guida all'uso di copilot-instructions.md in kimu-core

Questa guida spiega cos'è il file `copilot-instructions.md`, come integrarlo nel progetto kimu-core, come viene utilizzato dagli agenti AI (come GitHub Copilot) e le best practice per mantenerlo efficace.

## Cos'è copilot-instructions.md

`copilot-instructions.md` è un file di istruzioni posizionato nella cartella `.github` del progetto kimu-core. Contiene regole, convenzioni, esempi e best practice che guidano Copilot e altri agenti AI nella generazione di codice conforme agli standard del framework.

## Scopo del file
- Fornire una fonte autorevole di regole e convenzioni per lo sviluppo su kimu-core.
- Migliorare la qualità e la coerenza del codice generato dagli agenti AI.
- Facilitare l'onboarding di nuovi contributor.

## Dove posizionarlo
Il file deve essere inserito in `.github/copilot-instructions.md` nella root del progetto kimu-core.

## Come viene usato da Copilot e agenti AI
- Copilot e agenti AI leggono automaticamente il file se presente nella cartella `.github`.
- Le istruzioni vengono applicate durante la generazione di codice, suggerimenti e refactoring.
- Puoi citare il file nelle richieste a Copilot per ottenere risultati più precisi (es: "Segui le regole di copilot-instructions.md").

## Best practice per la manutenzione
- Aggiorna regolarmente il file con nuove regole, esempi e convenzioni.
- Documenta ogni nuova funzionalità, pattern o modifica importante.
- Mantieni il file chiaro, conciso e ben strutturato.
- Collega altri file di regole come `CODE_GUIDELINES.md`, `CONTRIBUTING.md`, ecc.

## Esempio di utilizzo
> "Crea una nuova estensione seguendo le regole di copilot-instructions.md."
> "Come si integra Three.js secondo copilot-instructions.md?"

## FAQ
**D: Serve addestrare manualmente Copilot?**
R: No, basta che il file sia presente e aggiornato. Copilot lo usa automaticamente.

**D: Posso usare il file con altri agenti AI?**
R: Sì, qualsiasi agente AI che supporta file di istruzioni può leggerlo e applicare le regole.

**D: Dove trovo esempi pratici?**
R: Nel file stesso e nella documentazione delle estensioni.

## Troubleshooting
- Se Copilot non segue le regole, verifica che il file sia aggiornato e ben strutturato.
- Specifica nelle richieste che deve seguire le istruzioni del file.

## Risorse utili
---
## Struttura consigliata del file copilot-instructions.md
Organizza il file in sezioni chiare e facilmente navigabili:
- Introduzione e scopo
- Struttura del progetto
- Regole di sviluppo e convenzioni
- Esempi pratici
- FAQ e troubleshooting
- Checklist per estensioni
- Glossario

## Come scrivere esempi efficaci
- Usa codice TypeScript chiaro e commentato.
- Mostra casi d’uso reali e pattern ricorrenti.
- Inserisci snippet per estensioni, data binding, integrazione di librerie esterne.

## Integrazione nel workflow
- Includi il controllo del file nelle review di codice.
- Cita il file nelle pull request e nelle discussioni tecniche.
- Utilizza il file per l’onboarding di nuovi contributor.
- Puoi integrare la verifica della conformità tramite script CI/CD.

## Vantaggi pratici
- Riduce errori e incoerenze nel codice generato.
- Facilita la collaborazione tra sviluppatori e AI agent.
- Migliora la qualità e la manutenibilità del progetto.

## Errori comuni da evitare
- File non aggiornato o incompleto.
- Esempi poco chiari o non aderenti alle convenzioni.
- Mancanza di collegamenti ad altri file di regole.

## Come proporre modifiche
- Apri una issue o una pull request nel repository kimu-core.
- Spiega chiaramente la motivazione della modifica.
- Aggiorna anche la documentazione correlata se necessario.

## Risorse esterne
- [Documentazione GitHub Copilot](https://docs.github.com/it/copilot)
- [Best practice per agenti AI](https://docs.github.com/it/copilot/best-practices-for-copilot)

## Glossario
- **Copilot Agent**: Assistente AI che genera codice seguendo le istruzioni del file.
- **Estensione**: Modulo personalizzato che aggiunge funzionalità a kimu-core.
- **Data Binding**: Collegamento reattivo tra dati e UI.
- **Checklist**: Elenco di passi da seguire per creare una nuova estensione.
- **CI/CD**: Integrazione e distribuzione continua, utile per automatizzare controlli di qualità.

---

Aggiorna questa guida ogni volta che cambi le regole o le convenzioni nel file `copilot-instructions.md`.
