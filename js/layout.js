import { HANDLES, LEGS } from './data.js';
import { state } from './state.js';

function findById(list, id) {
  for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
  return null;
}

export function layout() {
  var leg = findById(LEGS, state.legs) || { height: 8 };
  var legH = leg.height, top = 2.2;
  var hb = state.h - legH - top;
  var n = Math.min(5, Math.max(1, Math.round(state.w / 55)));
  var r = state.front === 'drawers' ? Math.min(6, Math.max(2, Math.round(hb / 21))) : 1;
  var gap = 0.35;
  var fw = (state.w - gap * (n + 1)) / n;
  var fh = state.front === 'drawers' ? (hb - gap * (r + 1)) / r : hb - 2 * gap;
  var handle = findById(HANDLES, state.handle);
  var c2c = handle && handle.c2c ? handle.c2c : 0;
  return { legH: legH, top: top, hb: hb, n: n, r: r, gap: gap, fw: fw, fh: fh, c2c: c2c };
}
