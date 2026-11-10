# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- The whole project is now maintained in **English** (code, comments, documentation, UI
  texts, JSON configuration keys).
- `HANDLES` and `LEGS` in `js/data.js` converted from `[id, label, hint]` tuples to objects
  (`id`, `label`, `hint`, `kind`, plus supplier fields for products). `bar`/`knob` split into
  fixed products (`bar_128`, `bar_192`, `bar_256`, `knob_30`, `knob_40`); `legs` split into
  `leg_10`, `leg_14`, `leg_18`. `edge` and `plinth` stay procedural, `none` stays `none`.
- `DEFAULTS.handle` → `bar_128`, `DEFAULTS.legs` → `leg_14`.
- `js/layout.js`: `legH` now read from the selected leg product; handle `c2c` read from the
  selected handle product. Removed `pickC2C`/`STD_C2C`.
- `js/ui.js`: `seg()`, `hintFor()` and `nameOf()` now read both tuples and objects; handle
  summary text uses the product label.
- `js/scene.js`: handles and legs render as placeholders sized to the product dimensions
  (mm → cm); removed the procedural cylinder/sphere handle code.

### Added

- GLB model loading for handle products: `GLTFLoader` (r128) loaded from CDN in `index.html`.
  `js/scene.js` loads each product model once (cached), normalizes it (long side → product
  width in cm, long axis → X, mounted face → z=0) and clones it per handle, falling back to
  the placeholder until loaded (or on failure). `Viefe_673_BEAM_32_1_3d_iDXp4I4ZRm.glb` moved
  to `models/handles/` and set as `modelUrl` for `bar_128`.

## [0.1.0] — initial split

### Changed

- Split the original monolithic `this.html` into a standard structure:
  - `index.html` — HTML skeleton and loading of styles/Three.js/entry module.
  - `css/style.css` — all styles (both original `<style>` blocks merged).
  - `js/data.js` — static data (wood, colours, materials, handles, ...).
  - `js/state.js` — central mutable state and `resetState()`.
  - `js/layout.js` — dimension/layout calculations.
  - `js/textures.js` — procedural wood textures.
  - `js/ui.js` — form and summary rendering.
  - `js/scene.js` — Three.js scene and model building.
  - `js/main.js` — entry point and event wiring.
- Rewrote the logic from an IIFE (`var`, global scope) to native ES modules without
  changing behaviour.
- Replaced `state = Object.assign({}, DEFAULTS)` on reset with `resetState()` (mutation of
  the single `state` object to keep the reference binding across modules).
- Moved `<title>` and `<meta>` correctly into `<head>`.

### Added

- `AGENTS.md`, `architecture.md`, `changelog.md` — project documentation.
- `README.md` — how to run the project and basics for AI.
- Documented **future direction**: early prototype, end goal is an eshop (custom solution
  vs. WordPress — undecided).
