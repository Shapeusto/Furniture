# AGENTS.md

Guide for developing and maintaining this project (for humans and AI agents alike).

## About the project

`Furniture` is a purely client-side "Furniture Configurator" — an interactive 3D
visualization of a made-to-measure chest of drawers. It uses **Three.js r128** (loaded via
CDN) and native **ES modules**. No build step, no `npm` dependencies.

**Project status:** absolutely early version (prototype), unrelated to the beta version. The
end goal is an eshop — it is not yet decided whether it will be built on a custom solution
or on WordPress. This 3D configurator is a standalone client-side unit that should stay
reusable. Details in `architecture.md`. Do not implement any of that yet.

## Running

The project has no build. Just statically serve the repository root, e.g.:

```sh
npx serve .
# or
python -m http.server 8000
```

Then open `http://localhost:8000`. ES modules and CDN scripts require HTTP(S), so opening
`index.html` directly via `file://` will not work.

## Structure

```
index.html        # HTML skeleton (markup, CDN scripts, entry module)
css/style.css     # all styles + design tokens (CSS variables)
js/main.js        # entry point: event wiring, startup
js/data.js        # static data (wood, colours, materials, handles, ...)
js/state.js       # central mutable state + reset
js/layout.js      # dimension/layout calculations from the current state
js/textures.js    # procedurally generated wood textures (canvas)
js/ui.js          # form and summary rendering (DOM)
js/scene.js       # Three.js scene, materials, model building
```

## Conventions

- **No build step** — do not add Node/bundler dependencies unless explicitly requested.
- **ES modules** — code in `js/` uses `import`/`export`. Do not introduce global variables.
- **Data flow is one-way**: `data.js` (immutable) → `state.js` (mutable state) →
  `layout.js` (derived dimensions) → `ui.js` (DOM) and `scene.js` (3D). See `architecture.md`.
- **State** is the single `state` object from `js/state.js`. State changes are made by
  mutating `state[key] = value` and then calling `refresh()` (`updateUI()` + `build()`).
  On reset, use `resetState()` (not a new reference).
- **Three.js** is accessed via `window.THREE` in `js/scene.js`; do not import it as a module.
- **Identifier names** (state values) match the keys in `data.js` and the `name`/`id`
  attributes in the generated form. Keep this binding when adding an option.
- **Code without comments** except the short structural separators that already exist.
- The whole project (code, comments, documentation, UI texts) is kept in **English**.

## Git

- **Only commit and push on explicit request.** Otherwise leave changes in the working tree.

## Changes and documentation

With every change, update `changelog.md` (new entry under "Unreleased") and, as needed,
`architecture.md`. These files must always stay current.

## Checking

- For a quick syntax check of modules, run `node --check js/main.js` (it will not catch
  import errors, but it will catch syntax errors).
- Verify functionality in the browser: load the page, move the sliders and options, copy
  the configuration, reset the view.
