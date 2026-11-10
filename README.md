# Furniture — Konfigurátor nábytku

Interaktívna 3D vizualizácia komody na mieru. Čisto klientsky prototyp (Three.js r128 cez
CDN, natívne ES moduly, bez build kroku a bez závislostí na `npm`).

## Spustenie

Projekt nemá build, stačí staticky servírovať koreň repozitára.

```sh
# cez npx
npx serve .

# alebo cez Python
python -m http.server 8000
```

Potom otvoriť v prehliadači `http://localhost:8000`.

> ES moduly aj CDN skripty vyžadujú HTTP(S) — priame otvorenie `index.html` cez `file://`
> nebude fungovať.

## Štruktúra

```
index.html        HTML kostra
css/style.css     štýly a dizajnové tokeny
js/main.js        vstupný bod
js/data.js        statické dáta
js/state.js       centrálny stav
js/layout.js      výpočet rozmerov
js/textures.js    procedurálne textúry dreva
js/ui.js          formulár a súhrn
js/scene.js       Three.js scéna
```

## Základy pre prácu s AI

Krátka orientácia, aby agent nemusel čítať celý kód. Podrobný návod je v `AGENTS.md`,
architektúra v `architecture.md`.

- **Bez build kroku** — žiadny Node/bundler, žiadne npm závislosti. ES moduly + Three.js cez CDN.
- **Dátový tok je jednosmerný:** `data.js` (nemenné dáta) → `state.js` (mutovateľný stav)
  → `layout.js` (odvodené rozmery) → `ui.js` (DOM) a `scene.js` (3D). Vstupný bod `main.js`.
- **Stav** je jediný objekt `state` z `js/state.js`. Zmena = mutácia `state[key] = value`
  a potom `refresh()` (`updateUI()` + `build()`). Reset cez `resetState()`, nie novou referenciou.
- **Three.js** len cez `window.THREE` v `js/scene.js` — neimportovať ako modul.
- **Väzba mien:** hodnoty `state` sa zhodujú s kľúčmi v `data.js` a s `name`/`id` v generovanom
  formulári. Pri pridávaní možnosti túto väzbu zachovať.
- **Dokumentáciu udržiavať aktuálnu** — každá zmena = nový záznam v `changelog.md`
  (pod „Nepublikované") a podľa potreby `architecture.md`.
- **Git:** commity/push len na výslovný príkaz.
- **Overenie:** `node --check js/main.js` (syntax), funkčnosť v prehliadači cez lokálny server.

Ďalšie podrobnosti: `AGENTS.md`, `architecture.md`, `changelog.md`.
