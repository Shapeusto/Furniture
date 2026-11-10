import { STD_C2C } from './data.js';
import { state } from './state.js';

function pickC2C(maxMm) {
  var r = STD_C2C[0];
  for (var i = 0; i < STD_C2C.length; i++) if (STD_C2C[i] <= maxMm) r = STD_C2C[i];
  return r;
}

export function layout() {
  var legH = state.legs === 'legs' ? 14 : 8, top = 2.2;
  var hb = state.h - legH - top;
  var n = Math.min(5, Math.max(1, Math.round(state.w / 55)));
  var r = state.front === 'drawers' ? Math.min(6, Math.max(2, Math.round(hb / 21))) : 1;
  var gap = 0.35;
  var fw = (state.w - gap * (n + 1)) / n;
  var fh = state.front === 'drawers' ? (hb - gap * (r + 1)) / r : hb - 2 * gap;
  var c2c = 0;
  if (state.handle === 'bar') c2c = state.front === 'drawers' ? pickC2C(fw * 10 * 0.45) : pickC2C(fh * 10 * 0.3);
  return { legH: legH, top: top, hb: hb, n: n, r: r, gap: gap, fw: fw, fh: fh, c2c: c2c };
}
