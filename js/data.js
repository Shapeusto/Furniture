export const DEFAULTS = {
  front: 'drawers', w: 160, h: 85, d: 42,
  wood: 'dub', color: 'natural', material: 'massive', finish: 'satin',
  handle: 'bar', handleColor: 'brass', legs: 'legs'
};

export const WOODS = {
  dub:      { name: 'Oak',     base: [200, 162, 112], dark: [146, 107, 64],  freq: 22, warp: 1.6 },
  orech:    { name: 'Walnut',  base: [112, 80, 58],   dark: [58, 37, 26],    freq: 18, warp: 2.4 },
  buk:      { name: 'Beech',   base: [217, 178, 134], dark: [182, 138, 98],  freq: 30, warp: 1.0 },
  jasen:    { name: 'Ash',     base: [228, 204, 165], dark: [188, 154, 110], freq: 20, warp: 2.0 },
  cerezna:  { name: 'Cherry',  base: [182, 110, 76],  dark: [128, 68, 42],   freq: 26, warp: 1.3 },
  borovica: { name: 'Pine',    base: [224, 188, 122], dark: [176, 124, 62],  freq: 16, warp: 2.8 }
};

export const MATS = {
  massive:  { name: 'Solid',    contrast: 1.0,  fine: 1, desc: 'Solid wood with a pronounced grain.' },
  veneer:   { name: 'Veneer',   contrast: 0.78, fine: 2, desc: 'Thin wood layer, finer and calmer grain.' },
  laminate: { name: 'Laminate', contrast: 0.4, fine: 1, desc: 'Even decor, easy care, scratch-resistant.' }
};

export const FINISHES = [
  ['matt', 'Matt', 'Natural oiled look without gloss.'],
  ['satin', 'Satin', 'Soft sheen, good balance of look and upkeep.'],
  ['gloss', 'Gloss', 'Mirror lacquer, brings out colour and grain.']
];

export const COLORS = [
  ['natural', 'Natural', null],
  ['white', 'White', '#ecebe6'],
  ['grey', 'Light grey', '#b7bab6'],
  ['anthracite', 'Anthracite', '#3b4043'],
  ['sage', 'Sage', '#8b9b87'],
  ['blue', 'Steel blue', '#4b6478'],
  ['ochre', 'Ochre', '#c49a4f'],
  ['black', 'Black', '#1e1f21'],
  ['burgundy', 'Burgundy', '#6c2d36']
];

export const HANDLES = [
  ['bar', 'Bar', 'Classic bar handle with standard hole spacings.'],
  ['knob', 'Knob', 'One knob on each front.'],
  ['edge', 'Rail', 'Profile on the edge of the front, no protruding parts.'],
  ['none', 'No handles', 'Clean front, push-to-open or finger-groove opening.']
];

export const HANDLE_COLORS = [
  ['black', 'Black', '#1a1a1c', 0.35, 0.5],
  ['brass', 'Brass', '#b8914f', 0.9, 0.32],
  ['chrome', 'Chrome', '#cfd2d5', 1.0, 0.14]
];

export const FRONTS = [
  ['drawers', 'Drawers', 'Rows of drawers in each column.'],
  ['doors', 'Doors', 'One door per column.']
];

export const LEGS = [
  ['legs', 'Legs', 'Dowel legs, 14 cm.'],
  ['plinth', 'Plinth', 'Recessed plinth, 8 cm.']
];

export const STD_C2C = [96, 128, 160, 192, 224, 320]; // standard handle spacing in mm
