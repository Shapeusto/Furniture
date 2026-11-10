# Furniture — Furniture Configurator

Interactive 3D visualization of a made-to-measure chest of drawers. A purely client-side
prototype (Three.js r128 via CDN, native ES modules, no build step, no `npm` dependencies).

## Running

There is no build; just serve the repository root statically.

```sh
# via npx
npx serve .

# or via Python
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

> ES modules and CDN scripts require HTTP(S) — opening `index.html` directly via `file://`
> will not work.

## Structure

```
index.html        HTML skeleton
css/style.css     styles and design tokens
js/main.js        entry point
js/data.js        static data
js/state.js       central state
js/layout.js      dimension/layout calculations
js/textures.js    procedural wood textures
js/ui.js          form and summary
js/scene.js       Three.js scene
```

## Basics for working with AI

A quick orientation so an agent does not need to read all the code. The full guide is in
`AGENTS.md`, the architecture in `architecture.md`.

- **No build step** — no Node/bundler, no npm dependencies. ES modules + Three.js via CDN.
- **Data flow is one-way:** `data.js` (immutable data) → `state.js` (mutable state)
  → `layout.js` (derived dimensions) → `ui.js` (DOM) and `scene.js` (3D). Entry point `main.js`.
- **State** is a single `state` object from `js/state.js`. To change it, mutate
  `state[key] = value` then call `refresh()` (`updateUI()` + `build()`). Reset via
  `resetState()`, not by replacing the reference.
- **Three.js** is accessed only via `window.THREE` in `js/scene.js` — do not import it as a module.
- **Name binding:** `state` values match keys in `data.js` and the `name`/`id` attributes in
  the generated form. Keep this binding when adding options.
- **Keep the docs current** — every change gets a new entry in `changelog.md`
  (under "Unreleased") and, if needed, in `architecture.md`.
- **Git:** commit/push only on explicit request.
- **Check:** `node --check js/main.js` (syntax), functionality in the browser via a local server.

More details: `AGENTS.md`, `architecture.md`, `changelog.md`.
