export const DEFAULTS = {
  front: 'drawers', w: 160, h: 85, d: 42,
  wood: 'dub', color: 'natural', material: 'massive', finish: 'satin',
  handle: 'bar', handleColor: 'brass', legs: 'legs'
};

export const WOODS = {
  dub:      { name: 'Dub',      base: [200, 162, 112], dark: [146, 107, 64],  freq: 22, warp: 1.6 },
  orech:    { name: 'Orech',    base: [112, 80, 58],   dark: [58, 37, 26],    freq: 18, warp: 2.4 },
  buk:      { name: 'Buk',      base: [217, 178, 134], dark: [182, 138, 98],  freq: 30, warp: 1.0 },
  jasen:    { name: 'Jaseň',    base: [228, 204, 165], dark: [188, 154, 110], freq: 20, warp: 2.0 },
  cerezna:  { name: 'Čerešňa',  base: [182, 110, 76],  dark: [128, 68, 42],   freq: 26, warp: 1.3 },
  borovica: { name: 'Borovica', base: [224, 188, 122], dark: [176, 124, 62],  freq: 16, warp: 2.8 }
};

export const MATS = {
  massive:  { name: 'Masív',  contrast: 1.0,  fine: 1, desc: 'Plné drevo s výraznou kresbou.' },
  veneer:   { name: 'Dyha',   contrast: 0.78, fine: 2, desc: 'Tenká vrstva dreva, jemnejšia a pokojnejšia kresba.' },
  laminate: { name: 'Laminát', contrast: 0.4, fine: 1, desc: 'Rovnomerný dekor, ľahká údržba, odolný voči škrabancom.' }
};

export const FINISHES = [
  ['matt', 'Matný', 'Prírodný olejovaný vzhľad bez lesku.'],
  ['satin', 'Saténový', 'Jemný lesk, dobrý pomer vzhľadu a údržby.'],
  ['gloss', 'Lesklý', 'Zrkadlový lak, zvýrazní farby aj kresbu.']
];

export const COLORS = [
  ['natural', 'Prírodná', null],
  ['white', 'Biela', '#ecebe6'],
  ['grey', 'Svetlosivá', '#b7bab6'],
  ['anthracite', 'Antracit', '#3b4043'],
  ['sage', 'Šalvia', '#8b9b87'],
  ['blue', 'Oceľová modrá', '#4b6478'],
  ['ochre', 'Okrová', '#c49a4f'],
  ['black', 'Čierna', '#1e1f21'],
  ['burgundy', 'Bordová', '#6c2d36']
];

export const HANDLES = [
  ['bar', 'Tyč', 'Klasická tyčová rúčka v štandardných rozstupoch.'],
  ['knob', 'Gombík', 'Jeden gombík na každom čele.'],
  ['edge', 'Lišta', 'Profil na hrane čela, bez vyčnievajúcich častí.'],
  ['none', 'Bez rúčok', 'Čistá fronta, otváranie tlakom alebo drážkou.']
];

export const HANDLE_COLORS = [
  ['black', 'Čierna', '#1a1a1c', 0.35, 0.5],
  ['brass', 'Mosadz', '#b8914f', 0.9, 0.32],
  ['chrome', 'Chróm', '#cfd2d5', 1.0, 0.14]
];

export const FRONTS = [
  ['drawers', 'Zásuvky', 'Rady zásuviek v každom stĺpci.'],
  ['doors', 'Dvierka', 'Jedny dvierka na každý stĺpec.']
];

export const LEGS = [
  ['legs', 'Nožičky', 'Kolíkové nohy, 14 cm.'],
  ['plinth', 'Sokel', 'Zapustený sokel, 8 cm.']
];

export const STD_C2C = [96, 128, 160, 192, 224, 320]; // standard handle spacing in mm
