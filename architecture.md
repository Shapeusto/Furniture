# architecture.md

## Prehľad

Aplikácia je čisto klientska, jednostránková a bez build kroku. HTML kostra (`index.html`)
načíta štýly (`css/style.css`), Three.js r128 + OrbitControls z CDN a vstupný ES modul
(`js/main.js`). Všetka logika je rozdelená do malých modulov podľa zodpovednosti.

## Dátový tok

```
data.js  ──►  state.js  ──►  layout.js  ──►  ui.js  (DOM formulár + súhrn)
   │                                       └──►  scene.js (Three.js scéna)
   └──────────────────────────────────────────►  textures.js (canvas textúry)
```

1. **`data.js`** — nemenné statické dáta: `WOODS`, `MATS`, `FINISHES`, `COLORS`,
   `HANDLES`, `HANDLE_COLORS`, `FRONTS`, `LEGS`, `STD_C2C` a `DEFAULTS`.
2. **`state.js`** — jediný mutovateľný objekt `state` inicializovaný z `DEFAULTS`
   a funkcia `resetState()`. Je zdrojom pravdy pre aktuálnu konfiguráciu.
3. **`layout.js`** — čisté funkcie odvodzujúce rozmery z `state` (`layout()`), napr.
   počet stĺpcov/riadov, rozmery čiel a rozstup rúčok. Bez DOM a bez Three.js.
4. **`ui.js`** — vykresľuje formulár (`buildForm()`), synchronizuje vstupy
   (`syncInputs()`) a aktualizuje dimenzie + súhrn (`updateUI()`). Zdieľa `layout()`
   a `woodCanvas()`.
5. **`scene.js`** — zapuzdruje Three.js: renderer, scénu, kameru, ovládanie, materiály
   (cache `matCache`, `texCache`) a stavbu modelu (`build()`, `resetView()`, `initThree()`).
6. **`textures.js`** — procedurálne generovanie tileable textúr dreva do canvasu
   (`woodCanvas()`), s vlastnou cache `canvasCache`. Nezávislé od Three.js.

## Vstupný bod (`main.js`)

- Volá `buildForm()` → `syncInputs()` → `initThree()` → `refresh()`.
- `refresh()` = `updateUI()` + `build()`.
- Pripája udalosti formulára (`input` pre posuvníky, `change` pre radio tlačidlá),
  tlačidlá `resetCfg` a `copyCfg` (kopírovanie JSON konfigurácie do schránky).

## Kľúčové rozhodnutia

- **Three.js cez CDN + globálny `THREE`**, nie npm — zachováva bez-build charakter.
  `scene.js` ho číta z `window.THREE` a degraduje s chybovou hláškou, ak sa nenačíta
  alebo ak chýba WebGL.
- **Procedurálne textúry dreva** nahrádzajú fotografie materiálov v prototype
  (generované v `textures.js`, znovu použité aj pre swatch voľby dreva).
- **Responsivita**: grid rozloženie „scéna | panel", na úzkych obrazovkách sa scéna
  stane sticky a panel sa posúva pod ňou (`css/style.css`).
- **Téma**: CSS premenné + podpora `prefers-color-scheme` a `data-theme`.
