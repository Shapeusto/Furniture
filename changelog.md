# Changelog

Všetky významné zmeny tohto projektu sú zaznamenané tu. Formát vychádza z
[Keep a Changelog](https://keepachangelog.com/sk/1.1.0/).

## [Nepublikované]

### Zmenené

- Rozdelený pôvodný monolitický súbor `this.html` do štandardnej štruktúry:
  - `index.html` — HTML kostra a načítanie štýlov/Three.js/vstupného modulu.
  - `css/style.css` — všetky štýly (spojené oba pôvodné `<style>` bloky).
  - `js/data.js` — statické dáta (drevo, farby, materiály, rúčky, …).
  - `js/state.js` — centrálny mutovateľný stav a `resetState()`.
  - `js/layout.js` — výpočet rozmerov/rozloženia.
  - `js/textures.js` — procedurálne textúry dreva.
  - `js/ui.js` — vykreslenie formulára a súhrnu.
  - `js/scene.js` — Three.js scéna a stavba modelu.
  - `js/main.js` — vstupný bod a drôty udalostí.
- Logika prepísaná z IIFE (`var`, globálny scope) na natívne ES moduly bez zmeny správania.
- `state = Object.assign({}, DEFAULTS)` pri resete nahradený `resetState()` (mutácia
  jediného `state` objektu, aby ostala referenčná väzba naprieč modulmi).
- `<title>` a `<meta>` presunuté korektne do `<head>`.

### Pridané

- `AGENTS.md`, `architecture.md`, `changelog.md` — dokumentácia projektu.
- Do dokumentácie doplnené **budúce smerovanie**: projekt je raný prototyp, konečný cieľ
  je eshop (vlastné riešenie vs. WordPress — zatiaľ nerozhodnuté).
