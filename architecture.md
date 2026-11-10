# architecture.md

## Overview

The application is purely client-side, single-page and has no build step. The HTML skeleton
(`index.html`) loads the styles (`css/style.css`), Three.js r128 + OrbitControls from a CDN,
and the entry ES module (`js/main.js`). All logic is split into small modules by responsibility.

## Data flow

```
data.js  ──►  state.js  ──►  layout.js  ──►  ui.js  (DOM form + summary)
   │                                       └──►  scene.js (Three.js scene)
   └──────────────────────────────────────────►  textures.js (canvas textures)
```

1. **`data.js`** — immutable static data: `WOODS`, `MATS`, `FINISHES`, `COLORS`,
   `HANDLES`, `HANDLE_COLORS`, `FRONTS`, `LEGS`, `STD_C2C` and `DEFAULTS`.
2. **`state.js`** — the single mutable `state` object initialized from `DEFAULTS`, plus
   `resetState()`. It is the source of truth for the current configuration.
3. **`layout.js`** — pure functions deriving dimensions from `state` (`layout()`), e.g. the
   number of columns/rows, front sizes and handle spacing. No DOM, no Three.js.
4. **`ui.js`** — renders the form (`buildForm()`), synchronizes inputs (`syncInputs()`) and
   updates the dimensions and summary (`updateUI()`). Shares `layout()` and `woodCanvas()`.
5. **`scene.js`** — encapsulates Three.js: renderer, scene, camera, controls, materials
   (caches `matCache`, `texCache`) and model building (`build()`, `resetView()`, `initThree()`).
6. **`textures.js`** — procedural generation of tileable wood textures into a canvas
   (`woodCanvas()`), with its own `canvasCache`. Independent of Three.js.

## Entry point (`main.js`)

- Calls `buildForm()` → `syncInputs()` → `initThree()` → `refresh()`.
- `refresh()` = `updateUI()` + `build()`.
- Wires form events (`input` for sliders, `change` for radio buttons), and the `resetCfg`
  and `copyCfg` buttons (copying the JSON configuration to the clipboard).

## Future direction (important for decision-making)

- This is an **absolutely early version** (prototype). It has nothing to do with the beta version.
- The end product is an **eshop**. It is **not yet decided** whether it will be built on a
  custom solution or on **WordPress**.
- Consequently: the current 3D configurator is a standalone, purely client-side unit. When
  deciding on new features, keep in mind that it may later be embedded in a different
  environment (WordPress/plugin, server backend, shopping cart, PIM/ERP).
- None of that is implemented yet; just take these options into account so the prototype
  does not close itself off from future reuse.

## Key decisions

- **Three.js via CDN + global `THREE`**, not npm — keeps the no-build character. `scene.js`
  reads it from `window.THREE` and degrades with an error message if it fails to load or if
  WebGL is missing.
- **Procedural wood textures** replace photos of materials in the prototype (generated in
  `textures.js`, reused for the wood swatches).
- **Responsiveness**: grid layout "stage | panel"; on narrow screens the stage becomes
  sticky and the panel scrolls beneath it (`css/style.css`).
- **Theme**: CSS variables + support for `prefers-color-scheme` and `data-theme`.
