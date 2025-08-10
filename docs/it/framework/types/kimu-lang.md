# KimuLang

Tipi TypeScript per la configurazione del supporto multilingua nelle estensioni KIMU.

## Descrizione

I tipi `KimuLang` definiscono la struttura per gestire l'internazionalizzazione (i18n) nelle estensioni KIMU, fornendo:

- **Configurazione lingue**: Definizione delle lingue supportate
- **Metadata locali**: Informazioni specifiche per ogni lingua
- **File di traduzione**: Path e convenzioni per i file di localizzazione
- **Lingua di default**: Fallback per lingue non supportate

## Definizioni dei Tipi

### KimuLang

Definisce una singola lingua supportata con i suoi metadata.

```typescript
interface KimuLang {
  code: string;           // Codice lingua ISO (es. 'it', 'en', 'es')
  name?: string;          // Nome descrittivo della lingua
  file?: string;          // Nome del file di traduzione (opzionale)
}
```

### KimuExtensionLanguages

Definisce la configurazione completa delle lingue per un'estensione.

```typescript
interface KimuExtensionLanguages {
  default: string;                        // Codice lingua di default
  supported: Record<string, KimuLang>;    // Mappa delle lingue supportate
}
```

## Utilizzo

### Configurazione Base

```typescript
// Configurazione semplice multilingua
const basicLanguages: KimuExtensionLanguages = {
  default: 'en',
  supported: {
    'en': { code: 'en', name: 'English' },
    'it': { code: 'it', name: 'Italiano' },
    'es': { code: 'es', name: 'Español' }
  }
};
```

### Configurazione con File Personalizzati

```typescript
// Configurazione con file di traduzione specifici
const advancedLanguages: KimuExtensionLanguages = {
  default: 'en',
  supported: {
    'en': { 
      code: 'en', 
      name: 'English', 
      file: 'english.json' 
    },
    'it': { 
      code: 'it', 
      name: 'Italiano', 
      file: 'italiano.json' 
    },
    'fr': { 
      code: 'fr', 
      name: 'Français', 
      file: 'francais.json' 
    },
    'de': { 
      code: 'de', 
      name: 'Deutsch', 
      file: 'deutsch.json' 
    }
  }
};
```

### Lingue con Varianti Regionali

```typescript
// Supporto per varianti regionali
const regionalLanguages: KimuExtensionLanguages = {
  default: 'en',
  supported: {
    'en': { code: 'en', name: 'English (US)', file: 'en-us.json' },
    'en-gb': { code: 'en-gb', name: 'English (UK)', file: 'en-gb.json' },
    'it': { code: 'it', name: 'Italiano (Italia)', file: 'it-it.json' },
    'it-ch': { code: 'it-ch', name: 'Italiano (Svizzera)', file: 'it-ch.json' },
    'es': { code: 'es', name: 'Español (España)', file: 'es-es.json' },
    'es-mx': { code: 'es-mx', name: 'Español (México)', file: 'es-mx.json' }
  }
};
```

## Integrazione con Estensioni

### In Metadata Estensione

```typescript
import { KimuExtensionMeta, KimuExtensionLanguages } from './core/kimu-types';

const userWidgetMeta: KimuExtensionMeta = {
  tag: 'user-widget',
  name: 'User Widget',
  version: '1.0.0',
  path: 'widgets/user',
  languages: {
    default: 'en',
    supported: {
      'en': { code: 'en', name: 'English', file: 'en.json' },
      'it': { code: 'it', name: 'Italiano', file: 'it.json' },
      'es': { code: 'es', name: 'Español', file: 'es.json' }
    }
  }
};
```

### Con @KimuComponent Decorator

```typescript
@KimuComponent({
  tag: 'contact-form',
  name: 'Contact Form',
  version: '1.2.0',
  path: 'forms/contact',
  languages: {
    default: 'en',
    supported: {
      'en': { code: 'en', name: 'English' },
      'it': { code: 'it', name: 'Italiano' },
      'fr': { code: 'fr', name: 'Français' },
      'de': { code: 'de', name: 'Deutsch' }
    }
  }
})
export class ContactForm extends KimuComponentElement {
  private translations: Record<string, any> = {};
  
  async onInit(): Promise<void> {
    await this.loadTranslations();
  }
  
  private async loadTranslations(): Promise<void> {
    const userLang = this.getAttribute('lang') || navigator.language.split('-')[0];
    const meta = this.getMeta();
    const supportedLang = meta.languages?.supported[userLang] ? userLang : meta.languages?.default || 'en';
    
    try {
      const fileName = meta.languages?.supported[supportedLang]?.file || `${supportedLang}.json`;
      this.translations = await this.loadResource(`i18n/${fileName}`);
    } catch (error) {
      console.warn(`Traduzioni non trovate per ${supportedLang}, uso default`);
      this.translations = await this.loadResource('i18n/en.json');
    }
  }
  
  getData(): Record<string, any> {
    return {
      labels: {
        name: this.translations.form?.name || 'Name',
        email: this.translations.form?.email || 'Email', 
        message: this.translations.form?.message || 'Message',
        submit: this.translations.form?.submit || 'Submit'
      }
    };
  }
}
```

## Struttura File di Traduzione

### Organizzazione Directory

```
extensions/
  my-component/
    component.ts
    view.html
    style.css
    resources/
      i18n/
        en.json        ← File traduzione inglese
        it.json        ← File traduzione italiano
        es.json        ← File traduzione spagnolo
        fr.json        ← File traduzione francese
```

### Formato File JSON

```json
// en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit"
  },
  "form": {
    "name": "Name",
    "email": "Email Address",
    "message": "Your Message",
    "submit": "Send Message",
    "validation": {
      "required": "This field is required",
      "email": "Please enter a valid email address"
    }
  },
  "messages": {
    "success": "Operation completed successfully",
    "error": "An error occurred",
    "loading": "Loading..."
  }
}
```

```json
// it.json
{
  "common": {
    "save": "Salva",
    "cancel": "Annulla", 
    "delete": "Elimina",
    "edit": "Modifica"
  },
  "form": {
    "name": "Nome",
    "email": "Indirizzo Email",
    "message": "Il tuo Messaggio",
    "submit": "Invia Messaggio",
    "validation": {
      "required": "Questo campo è obbligatorio",
      "email": "Inserisci un indirizzo email valido"
    }
  },
  "messages": {
    "success": "Operazione completata con successo",
    "error": "Si è verificato un errore",
    "loading": "Caricamento..."
  }
}
```

## Esempi Avanzati

### Language Manager

```typescript
class LanguageManager {
  private static currentLang = 'en';
  private static availableLanguages = new Map<string, KimuExtensionLanguages>();
  
  static registerExtensionLanguages(tag: string, languages: KimuExtensionLanguages): void {
    this.availableLanguages.set(tag, languages);
  }
  
  static getCurrentLanguage(): string {
    return this.currentLang;
  }
  
  static setCurrentLanguage(lang: string): void {
    this.currentLang = lang;
    this.notifyLanguageChange(lang);
  }
  
  static getSupportedLanguages(extensionTag: string): KimuLang[] {
    const config = this.availableLanguages.get(extensionTag);
    return config ? Object.values(config.supported) : [];
  }
  
  static getDefaultLanguage(extensionTag: string): string {
    const config = this.availableLanguages.get(extensionTag);
    return config?.default || 'en';
  }
  
  static isLanguageSupported(extensionTag: string, lang: string): boolean {
    const config = this.availableLanguages.get(extensionTag);
    return config ? lang in config.supported : false;
  }
  
  static resolveLanguage(extensionTag: string, requestedLang?: string): string {
    const config = this.availableLanguages.get(extensionTag);
    if (!config) return 'en';
    
    const lang = requestedLang || this.currentLang || navigator.language.split('-')[0];
    
    // Verifica supporto lingua esatta
    if (lang in config.supported) return lang;
    
    // Verifica supporto lingua base (es. 'en' per 'en-US')
    const baseLang = lang.split('-')[0];
    if (baseLang in config.supported) return baseLang;
    
    // Fallback a default
    return config.default;
  }
  
  private static notifyLanguageChange(newLang: string): void {
    // Notifica tutti i componenti del cambio lingua
    const event = new CustomEvent('language-changed', { 
      detail: { language: newLang },
      bubbles: true 
    });
    document.dispatchEvent(event);
  }
  
  static async loadTranslations(
    extensionTag: string, 
    basePath: string, 
    lang?: string
  ): Promise<Record<string, any>> {
    const config = this.availableLanguages.get(extensionTag);
    if (!config) throw new Error(`Configurazione lingua non trovata per ${extensionTag}`);
    
    const resolvedLang = this.resolveLanguage(extensionTag, lang);
    const langConfig = config.supported[resolvedLang];
    const fileName = langConfig.file || `${resolvedLang}.json`;
    
    try {
      const response = await fetch(`/${basePath}/resources/i18n/${fileName}`);
      if (!response.ok) throw new Error(`File traduzione non trovato: ${fileName}`);
      return await response.json();
    } catch (error) {
      console.warn(`Errore caricamento traduzioni ${fileName}:`, error);
      
      // Fallback alla lingua di default
      if (resolvedLang !== config.default) {
        return this.loadTranslations(extensionTag, basePath, config.default);
      }
      
      throw error;
    }
  }
}

// Setup e uso
LanguageManager.registerExtensionLanguages('user-widget', {
  default: 'en',
  supported: {
    'en': { code: 'en', name: 'English' },
    'it': { code: 'it', name: 'Italiano' },
    'es': { code: 'es', name: 'Español' }
  }
});

// Cambio lingua globale
LanguageManager.setCurrentLanguage('it');

// Caricamento traduzioni per estensione
const translations = await LanguageManager.loadTranslations(
  'user-widget', 
  'extensions/widgets/user'
);
```

### Translation Helper

```typescript
class TranslationHelper {
  private translations: Record<string, any> = {};
  
  constructor(private extensionTag: string, private basePath: string) {}
  
  async init(lang?: string): Promise<void> {
    this.translations = await LanguageManager.loadTranslations(
      this.extensionTag,
      this.basePath,
      lang
    );
  }
  
  // Traduzione semplice
  t(key: string, fallback?: string): string {
    const value = this.getNestedValue(this.translations, key);
    return value || fallback || key;
  }
  
  // Traduzione con interpolazione
  ti(key: string, params: Record<string, any>, fallback?: string): string {
    let text = this.t(key, fallback);
    
    for (const [param, value] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{\\{${param}\\}\\}`, 'g'), String(value));
    }
    
    return text;
  }
  
  // Traduzione plurale
  tp(key: string, count: number, fallback?: string): string {
    const baseKey = count === 1 ? `${key}.singular` : `${key}.plural`;
    return this.t(baseKey, fallback);
  }
  
  // Verifica esistenza traduzione
  has(key: string): boolean {
    return this.getNestedValue(this.translations, key) !== undefined;
  }
  
  // Ottieni tutte le traduzioni per una sezione
  section(sectionKey: string): Record<string, any> {
    return this.getNestedValue(this.translations, sectionKey) || {};
  }
  
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
  
  // Aggiorna lingua
  async updateLanguage(lang: string): Promise<void> {
    await this.init(lang);
  }
}

// Uso in componente
export class MultilingualComponent extends KimuComponentElement {
  private i18n!: TranslationHelper;
  
  async onInit(): Promise<void> {
    this.i18n = new TranslationHelper(this.getMeta().tag, this.getMeta().basePath!);
    await this.i18n.init();
    
    // Ascolta cambi lingua globali
    document.addEventListener('language-changed', (e: any) => {
      this.handleLanguageChange(e.detail.language);
    });
  }
  
  private async handleLanguageChange(newLang: string): Promise<void> {
    await this.i18n.updateLanguage(newLang);
    this.refresh(); // Re-render con nuove traduzioni
  }
  
  getData(): Record<string, any> {
    return {
      title: this.i18n.t('title', 'Default Title'),
      welcome: this.i18n.ti('welcome.message', { name: 'Utente' }, 'Welcome {{name}}'),
      itemCount: this.i18n.tp('items', 5, '5 items'),
      buttons: this.i18n.section('buttons'),
      hasCustomGreeting: this.i18n.has('greeting.custom')
    };
  }
}
```

### Language Picker Component

```typescript
@KimuComponent({
  tag: 'language-picker',
  name: 'Language Picker',
  version: '1.0.0',
  languages: {
    default: 'en',
    supported: {
      'en': { code: 'en', name: 'English' },
      'it': { code: 'it', name: 'Italiano' },
      'es': { code: 'es', name: 'Español' },
      'fr': { code: 'fr', name: 'Français' },
      'de': { code: 'de', name: 'Deutsch' }
    }
  }
})
export class LanguagePicker extends KimuComponentElement {
  getData(): Record<string, any> {
    const meta = this.getMeta();
    const availableLanguages = Object.values(meta.languages?.supported || {});
    const currentLang = LanguageManager.getCurrentLanguage();
    
    return {
      languages: availableLanguages.map(lang => ({
        ...lang,
        selected: lang.code === currentLang
      })),
      currentLanguage: currentLang
    };
  }
  
  onRender(): void {
    // Gestisci selezione lingua
    this.shadowRoot?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      if (target.matches('.language-select')) {
        LanguageManager.setCurrentLanguage(target.value);
      }
    });
  }
}
```

### Auto-Detection Helper

```typescript
class LanguageDetector {
  static detectUserLanguage(): string {
    // 1. URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang) return urlLang;
    
    // 2. localStorage
    const storedLang = localStorage.getItem('kimu-language');
    if (storedLang) return storedLang;
    
    // 3. Browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang) return browserLang;
    
    // 4. Default fallback
    return 'en';
  }
  
  static saveUserLanguage(lang: string): void {
    localStorage.setItem('kimu-language', lang);
  }
  
  static getSupportedLanguagesForExtension(extensionTag: string): string[] {
    const languages = LanguageManager.getSupportedLanguages(extensionTag);
    return languages.map(lang => lang.code);
  }
  
  static findBestMatch(
    extensionTag: string, 
    preferredLanguages: string[] = []
  ): string {
    const supported = this.getSupportedLanguagesForExtension(extensionTag);
    const preferences = [
      ...preferredLanguages,
      this.detectUserLanguage(),
      LanguageManager.getDefaultLanguage(extensionTag)
    ];
    
    for (const pref of preferences) {
      if (supported.includes(pref)) return pref;
      
      // Verifica lingua base
      const baseLang = pref.split('-')[0];
      if (supported.includes(baseLang)) return baseLang;
    }
    
    return supported[0] || 'en';
  }
}
```

## Pattern di Utilizzo

### ✅ Configurazione Standard

```typescript
const standardLangs: KimuExtensionLanguages = {
  default: 'en',
  supported: {
    'en': { code: 'en', name: 'English' },
    'it': { code: 'it', name: 'Italiano' },
    'es': { code: 'es', name: 'Español' },
    'fr': { code: 'fr', name: 'Français' },
    'de': { code: 'de', name: 'Deutsch' }
  }
};
```

### ✅ File Naming Convention

```typescript
// Convenzione nomi file
const conventionLangs: KimuExtensionLanguages = {
  default: 'en',
  supported: {
    'en': { code: 'en', name: 'English', file: 'en.json' },
    'it': { code: 'it', name: 'Italiano', file: 'it.json' },
    'es': { code: 'es', name: 'Español', file: 'es.json' }
  }
};
```

### ✅ Fallback Safety

```typescript
async function safeLoadTranslations(extensionTag: string, lang: string): Promise<Record<string, any>> {
  try {
    return await LanguageManager.loadTranslations(extensionTag, basePath, lang);
  } catch (error) {
    console.warn(`Traduzioni ${lang} non disponibili, uso default`);
    return await LanguageManager.loadTranslations(extensionTag, basePath, 'en');
  }
}
```

## Best Practices

### ✅ Codici Lingua Standard

```typescript
// Usa codici ISO 639-1
const languages: KimuExtensionLanguages = {
  default: 'en',
  supported: {
    'en': { code: 'en', name: 'English' },      // ✅ Standard ISO
    'it': { code: 'it', name: 'Italiano' },     // ✅ Standard ISO
    'zh': { code: 'zh', name: '中文' }           // ✅ Standard ISO
  }
};
```

### ✅ Nomi Descrittivi

```typescript
// Nomi chiari e localizzati
const descriptiveNames: KimuExtensionLanguages = {
  default: 'en',
  supported: {
    'en': { code: 'en', name: 'English' },           // Nome in inglese
    'it': { code: 'it', name: 'Italiano' },          // Nome in italiano
    'es': { code: 'es', name: 'Español' },           // Nome in spagnolo
    'zh': { code: 'zh', name: '中文 (Chinese)' }      // Nome nativo + traduzione
  }
};
```

### ✅ File Organization

```
resources/
  i18n/
    en.json          ← Lingua di default
    it.json          ← Traduzione italiana
    es.json          ← Traduzione spagnola
    common/          ← Traduzioni condivise
      buttons.json
      messages.json
```

## Vedi Anche

- **[KimuExtensionMeta](./kimu-extension-meta.md)** - Metadata che include configurazione lingue
- **[KimuComponentElement](../core/kimu-component-element.md)** - Caricamento risorse traduzioni
- **[Internationalization](../patterns/internationalization.md)** - Pattern i18n
- **[Resource Loading](../patterns/resource-loading.md)** - Caricamento risorse
