# AGENTS.md

Návod pre vývoj a údržbu tohto projektu (pre ľudí aj AI agentov).

## O projekte

`Furniture` je čisto klientsky „Konfigurátor nábytku" — interaktívna 3D vizualizácia komody
na mieru. Používa **Three.js r128** (načítaný cez CDN) a natívne **ES moduly**. Bez build
kroku, bez závislostí na `npm`.

**Stav projektu:** absolútne raná verzia (prototyp), nesúvisí s beta verziou. Konečný cieľ
je eshop — zatiaľ nie je rozhodnuté, či na vlastnom riešení alebo na WordPresse. Tento 3D
konfigurátor je samostatný klientsky celok, ktorý má ostať znovupoužiteľný. Podrobnosti v
`architecture.md`. Nič z toho zatiaľ neimplementovať.

## Spustenie

Projekt nemá build. Stačí staticky servírovať koreň repozitára, napr.:

```sh
npx serve .
# alebo
python -m http.server 8000
```

Potom otvoriť `http://localhost:8000`. ES moduly aj CDN skripty vyžadujú HTTP(S), takže
priamy `file://` otvorený `index.html` nebude fungovať.

## Štruktúra

```
index.html        # HTML kostra (markup, CDN skripty, vstupný modul)
css/style.css     # všetky štýly + dizajnové tokeny (CSS premenné)
js/main.js        # vstupný bod: drôty udalostí, spustenie
js/data.js        # statické dáta (drevo, farby, materiály, rúčky, …)
js/state.js       # centrálny mutovateľný stav + reset
js/layout.js      # výpočet rozmerov/rozloženia z aktuálneho stavu
js/textures.js    # procedurálne generované textúry dreva (canvas)
js/ui.js          # vykreslenie formulára a súhrnu (DOM)
js/scene.js       # Three.js scéna, materiály, stavba modelu
```

## Konvencie

- **Bez build kroku** — nepřidávať závislosti na Node/bundler, pokiaľ to nie je vyslovene požadované.
- **ES moduly** — kód v `js/` používa `import`/`export`. Nezavádzať globálne premenné.
- **Dátový tok je jednosmerný**: `data.js` (nemenné) → `state.js` (mutovateľný stav) →
  `layout.js` (odvodené rozmery) → `ui.js` (DOM) a `scene.js` (3D). Pozri `architecture.md`.
- **Stav** je jediný `state` objekt z `js/state.js`. Zmena stavu sa robí mutáciou
  `state[key] = value` a následným zavolaním `refresh()` (`updateUI()` + `build()`).
  Pri resete používať `resetState()` (nie novú referenciu).
- **Three.js** sa pristupuje cez `window.THREE` v `js/scene.js`; neimportovať ho ako modul.
- **Názvy identifikátorov** (hodnoty stavu) sa zhodujú s kľúčmi v `data.js` a s `name`/`id`
  atribútmi v generovanom formulári. Pri pridávaní možnosti zachovať túto väzbu.
- **Kód bez komentárov** mimo krátkych štrukturálnych oddelení, ktoré už existujú.
- Texty používateľského rozhrania sú po slovensky.

## Git

- **Commitovať ani pushovať len na výslovný príkaz.** Bez neho nechávať zmeny len v pracovnom strome.

## Zmeny a dokumentácia

Pri každej zmene aktualizujte `changelog.md` (nový záznam pod „Nepublikované") a podľa
potreby `architecture.md`. Tieto súbory musia zostať vždy aktuálne.

## Kontrola

- Pre rýchlu kontrolu syntaxe modulov spustiť `node --check js/main.js` (neodhalí chyby
  importov, ale odhalí syntaktické chyby).
- Funkčnosť overiť v prehliadači: načítať stránku, meniť posuvníky a voľby, skopírovať
  konfiguráciu, obnoviť pohľad.
