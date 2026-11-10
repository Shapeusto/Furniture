export const DEFAULTS = {
  front: 'drawers', w: 160, h: 85, d: 42,
  wood: 'dub', color: 'natural', material: 'massive', finish: 'satin',
  handle: 'bar_128', handleColor: 'brass', legs: 'leg_14'
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

// Handles and legs are supplier products. Each `product` carries its own 3D model (GLB)
// and physical dimensions. Dimensions are in millimetres (like c2c); the 3D scene works in
// centimetres, so values are divided by 10 there. All data stays JSON-serializable (PIM/eshop).
export const HANDLES = [
  { id: 'bar_128', label: 'Bar 128 mm', hint: 'Classic bar handle, 128 mm hole spacing.',
    kind: 'product', supplierCode: 'H-BAR-128', price: 4.9, modelUrl: 'models/handles/Viefe_673_BEAM_32_1_3d_iDXp4I4ZRm.glb',
    width: 152, height: 12, depth: 32, c2c: 128, placement: 'center' },
  { id: 'bar_192', label: 'Bar 192 mm', hint: 'Classic bar handle, 192 mm hole spacing.',
    kind: 'product', supplierCode: 'H-BAR-192', price: 5.4, modelUrl: 'models/handles/bar_192.glb',
    width: 216, height: 12, depth: 32, c2c: 192, placement: 'center' },
  { id: 'bar_256', label: 'Bar 256 mm', hint: 'Classic bar handle, 256 mm hole spacing.',
    kind: 'product', supplierCode: 'H-BAR-256', price: 5.9, modelUrl: 'models/handles/bar_256.glb',
    width: 280, height: 12, depth: 32, c2c: 256, placement: 'center' },
  { id: 'knob_30', label: 'Knob 30 mm', hint: 'Round knob, 30 mm diameter.',
    kind: 'product', supplierCode: 'H-KNOB-30', price: 3.2, modelUrl: 'models/handles/knob_30.glb',
    width: 30, height: 30, depth: 28, c2c: 0, placement: 'top' },
  { id: 'knob_40', label: 'Knob 40 mm', hint: 'Round knob, 40 mm diameter.',
    kind: 'product', supplierCode: 'H-KNOB-40', price: 3.8, modelUrl: 'models/handles/knob_40.glb',
    width: 40, height: 40, depth: 32, c2c: 0, placement: 'top' },
  { id: 'edge', label: 'Rail', hint: 'Profile on the edge of the front, no protruding parts.', kind: 'procedural' },
  { id: 'none', label: 'No handles', hint: 'Clean front, push-to-open or finger-groove opening.', kind: 'none' }
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

// Leg height is in centimetres (the scene is in cm); handle dimensions above are in mm.
export const LEGS = [
  { id: 'leg_10', label: 'Legs 10 cm', hint: 'Dowel legs, 10 cm.',
    kind: 'product', supplierCode: 'L-LEG-10', price: 8.0, modelUrl: 'models/legs/leg_10.glb',
    height: 10, count: 4, inset: 6 },
  { id: 'leg_14', label: 'Legs 14 cm', hint: 'Dowel legs, 14 cm.',
    kind: 'product', supplierCode: 'L-LEG-14', price: 8.5, modelUrl: 'models/legs/leg_14.glb',
    height: 14, count: 4, inset: 6 },
  { id: 'leg_18', label: 'Legs 18 cm', hint: 'Dowel legs, 18 cm.',
    kind: 'product', supplierCode: 'L-LEG-18', price: 9.0, modelUrl: 'models/legs/leg_18.glb',
    height: 18, count: 4, inset: 6 },
  { id: 'plinth', label: 'Plinth', hint: 'Recessed plinth, 8 cm.', kind: 'procedural', height: 8 }
];
