import { WOODS, MATS } from './data.js';

function h2(x, y) { var s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123; return s - Math.floor(s); }

function pn(x, y, px, py) {
  var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  var x0 = ((xi % px) + px) % px, x1 = (((xi + 1) % px) + px) % px;
  var y0 = ((yi % py) + py) % py, y1 = (((yi + 1) % py) + py) % py;
  var a = h2(x0, y0), b = h2(x1, y0), c = h2(x0, y1), d = h2(x1, y1);
  var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

var canvasCache = {};

export function woodCanvas(key, mat) {
  var ck = key + '|' + mat;
  if (canvasCache[ck]) return canvasCache[ck];
  var W = WOODS[key], P = MATS[mat], N = 512;
  var c = document.createElement('canvas'); c.width = N; c.height = N;
  var g = c.getContext('2d'), img = g.createImageData(N, N), data = img.data;
  var k = Math.max(2, Math.round(W.freq * P.fine));
  for (var y = 0; y < N; y++) {
    var v = y / N;
    for (var x = 0; x < N; x++) {
      var u = x / N;
      var n1 = pn(u * 2, v * 5, 2, 5);
      var n2 = pn(u * 6, v * 40, 6, 40);
      var n3 = pn(u * 2, v * 160, 2, 160);
      var ring = Math.sin(Math.PI * 2 * (k * v + W.warp * n1 + 0.18 * n2));
      var t = ring * 0.5 + 0.5;
      var band = t * t * (3 - 2 * t);
      var m = 0.55 * band + 0.30 * n3 + 0.15 * n2;
      m = Math.min(1, Math.max(0, (m - 0.15) * 1.3)) * P.contrast;
      var i = (y * N + x) * 4;
      data[i] = W.base[0] + (W.dark[0] - W.base[0]) * m;
      data[i + 1] = W.base[1] + (W.dark[1] - W.base[1]) * m;
      data[i + 2] = W.base[2] + (W.dark[2] - W.base[2]) * m;
      data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  canvasCache[ck] = c;
  return c;
}
