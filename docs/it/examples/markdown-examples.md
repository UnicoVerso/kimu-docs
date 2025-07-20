# Esempi di Estensioni Markdown

Questa pagina mostra alcune delle estensioni markdown integrate fornite da VitePress.

## Evidenziazione della Sintassi

VitePress offre evidenziazione della sintassi 
alimentata da [Shiki](https://github.com/shikijs/shiki), 
con funzionalità aggiuntive come l'evidenziazione delle righe:

**Input**

````md
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

**Output**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## Contenitori Personalizzati

**Input**
