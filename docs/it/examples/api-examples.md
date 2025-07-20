---
outline: deep
---

# Esempi di API Runtime

Questa pagina mostra l'utilizzo di alcune delle API runtime fornite da VitePress.

La principale API `useData()` può essere usata per accedere ai dati del sito, del tema e della pagina corrente. Funziona sia nei file `.md` che `.vue`:

```md
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>

## Risultati

### Dati Tema
<pre>{{ theme }}</pre>

### Dati Pagina
<pre>{{ page }}</pre>

### Frontmatter Pagina
<pre>{{ frontmatter }}</pre>
```

<script setup>
import { useData } from 'vitepress'

const { site, theme, page, frontmatter } = useData()
</script>

## Risultati

### Dati Tema
<pre>{{ theme }}</pre>
