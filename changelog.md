# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- The whole project is now maintained in **English** (code, comments, documentation, UI
  texts, JSON configuration keys).

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
