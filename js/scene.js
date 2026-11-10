import { COLORS, HANDLE_COLORS, HANDLES, LEGS } from './data.js';
import { state } from './state.js';
import { layout } from './layout.js';
import { woodCanvas } from './textures.js';

function findById(list, id) {
  for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
  return null;
}

var stage = document.getElementById('stage');
var canvas = document.getElementById('gl');
var T = window.THREE;
var ready = !!(T && T.OrbitControls);
var renderer, scene, camera, controls, group, matCache = {}, texCache = {}, seed = 0;
var modelCache = {}, modelLoading = {};

function fail(msg) {
  stage.insertAdjacentHTML('beforeend', '<p class="fail">' + msg + '</p>');
}

// Load a product GLB once, normalize it to scene units (cm) and cache the template.
function ensureProductModel(product, onLoaded) {
  if (!product || !product.modelUrl) { onLoaded(null); return; }
  if (modelCache[product.id]) { onLoaded(modelCache[product.id]); return; }
  if (!T.GLTFLoader) { onLoaded(null); return; }
  if (modelLoading[product.id]) { onLoaded(null); return; }
  modelLoading[product.id] = true;
  var loader = new T.GLTFLoader();
  loader.load(product.modelUrl, function (gltf) {
    modelLoading[product.id] = false;
    modelCache[product.id] = normalizeModel(gltf.scene, product);
    onLoaded(modelCache[product.id]);
  }, undefined, function () {
    modelLoading[product.id] = false;
    onLoaded(null);
  });
}

// Scale/rotate/centre a loaded model so its long side matches the product width (cm),
// the long axis lies on X and the mounting face sits at z = 0.
function normalizeModel(root, product) {
  root.updateMatrixWorld(true);
  var box = new T.Box3().setFromObject(root);
  var size = new T.Vector3();
  box.getSize(size);

  var longAxis = 'x';
  if (size.y > size[longAxis]) longAxis = 'y';
  if (size.z > size[longAxis]) longAxis = 'z';

  var widthCm = product.width / 10;
  var scale = widthCm / size[longAxis];

  var template = new T.Group();
  template.add(root);

  if (longAxis === 'y') root.rotation.z = -Math.PI / 2;
  else if (longAxis === 'z') root.rotation.x = Math.PI / 2;

  if (product.modelRotation) {
    root.rotation.x += (product.modelRotation[0] || 0) * Math.PI / 180;
    root.rotation.y += (product.modelRotation[1] || 0) * Math.PI / 180;
    root.rotation.z += (product.modelRotation[2] || 0) * Math.PI / 180;
  }

  root.scale.setScalar(scale);
  root.updateMatrixWorld(true);

  box.setFromObject(template);
  var center = box.getCenter(new T.Vector3());
  root.position.x = -center.x;
  root.position.y = -center.y;
  root.position.z = -box.min.z;
  root.updateMatrixWorld(true);

  return template;
}

// Deep-clone the template so each handle gets its own geometry/material (safe to dispose).
function cloneModel(template) {
  var clone = template.clone(true);
  clone.traverse(function (o) {
    if (o.isMesh) {
      o.geometry = o.geometry.clone();
      o.material = o.material.clone();
    }
  });
  return clone;
}

function woodTexture(key, mat) {
  var ck = key + '|' + mat;
  if (texCache[ck]) return texCache[ck];
  var tex = new T.CanvasTexture(woodCanvas(key, mat));
  tex.wrapS = tex.wrapT = T.RepeatWrapping;
  tex.encoding = T.sRGBEncoding;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texCache[ck] = tex;
  return tex;
}

function finishProps(fin, paint) {
  if (fin === 'matt') return { roughness: 0.8, clearcoat: 0, clearcoatRoughness: 0.6 };
  if (fin === 'satin') return { roughness: 0.52, clearcoat: 0.2, clearcoatRoughness: 0.45 };
  return { roughness: paint ? 0.25 : 0.3, clearcoat: 0.9, clearcoatRoughness: 0.06 };
}

function woodMat(key, mat, fin) {
  var ck = 'w|' + key + '|' + mat + '|' + fin;
  if (matCache[ck]) return matCache[ck];
  var p = finishProps(fin, false);
  var m = new T.MeshPhysicalMaterial({ map: woodTexture(key, mat), roughness: p.roughness, clearcoat: p.clearcoat, clearcoatRoughness: p.clearcoatRoughness, envMapIntensity: 0.8 });
  matCache[ck] = m; return m;
}

function paintMat(colorKey, fin) {
  var ck = 'p|' + colorKey + '|' + fin;
  if (matCache[ck]) return matCache[ck];
  var hex = '#888888';
  for (var i = 0; i < COLORS.length; i++) if (COLORS[i][0] === colorKey) hex = COLORS[i][2];
  var p = finishProps(fin, true);
  var m = new T.MeshPhysicalMaterial({ color: new T.Color(hex), roughness: p.roughness, clearcoat: p.clearcoat, clearcoatRoughness: p.clearcoatRoughness, envMapIntensity: 0.8 });
  matCache[ck] = m; return m;
}

function darkMat() {
  if (!matCache.dark) matCache.dark = new T.MeshStandardMaterial({ color: 0x0f1110, roughness: 0.9 });
  return matCache.dark;
}

function handleMat(key) {
  var ck = 'h|' + key;
  if (matCache[ck]) return matCache[ck];
  var c = HANDLE_COLORS[1];
  for (var i = 0; i < HANDLE_COLORS.length; i++) if (HANDLE_COLORS[i][0] === key) c = HANDLE_COLORS[i];
  var m = new T.MeshStandardMaterial({ color: new T.Color(c[2]), metalness: c[3], roughness: c[4], envMapIntensity: 1.1 });
  matCache[ck] = m; return m;
}

// Box whose UVs follow real dimensions, with the wood grain running along a chosen world axis.
function boxGeo(w, h, d, grain) {
  var g = new T.BoxGeometry(w, h, d);
  var uv = g.attributes.uv, S = 70;
  var faces = [['z', 'y', d, h], ['z', 'y', d, h], ['x', 'z', w, d], ['x', 'z', w, d], ['x', 'y', w, h], ['x', 'y', w, h]];
  var off = seed * 0.173; seed++;
  for (var f = 0; f < 6; f++) {
    var swap = grain === faces[f][1];
    var ul = swap ? faces[f][3] : faces[f][2];
    var vl = swap ? faces[f][2] : faces[f][3];
    for (var i = 0; i < 4; i++) {
      var idx = f * 4 + i, u = uv.getX(idx), v = uv.getY(idx);
      if (swap) { var tmp = u; u = v; v = tmp; }
      uv.setXY(idx, u * ul / S + off, v * vl / S + off * 0.6);
    }
  }
  uv.needsUpdate = true;
  return g;
}

function add(geo, mat, x, y, z, shadows) {
  var m = new T.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = shadows !== false; m.receiveShadow = true;
  group.add(m);
  return m;
}

function box(w, h, d, mat, grain, x, y, z) { return add(boxGeo(w, h, d, grain), mat, x, y, z); }

function clearGroup() {
  for (var i = group.children.length - 1; i >= 0; i--) {
    var ch = group.children[i];
    if (ch.geometry) ch.geometry.dispose();
    group.remove(ch);
  }
}

function addHandle(template, hp, hm, cx, cy, fw, fh, isDoor, side, zf) {
  if (template) {
    var kx, ky, rotZ = 0;
    if (hp.placement === 'top') {
      kx = isDoor ? cx + side * (fw / 2 - 3) : cx;
      ky = isDoor ? (fh > 40 ? cy + fh / 2 - 4 : cy) : cy + fh / 2 - hp.height / 20 - 1;
    } else if (isDoor) {
      kx = cx + side * (fw / 2 - 3);
      ky = cy;
      rotZ = -Math.PI / 2;
    } else {
      kx = cx;
      ky = cy + fh * 0.12;
    }
    var m = cloneModel(template);
    m.rotation.z = rotZ;
    m.position.set(kx, ky, zf);
    m.traverse(function (o) {
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
    });
    group.add(m);
    return;
  }
  if (hp.kind === 'product') {
    // Placeholder: a box scaled to the product dimensions (mm -> cm).
    var wcm = hp.width / 10, hcm = hp.height / 10, dcm = hp.depth / 10;
    if (hp.placement === 'top') {
      var kx = isDoor ? cx + side * (fw / 2 - 3) : cx;
      var ky = isDoor ? (fh > 40 ? cy + fh / 2 - 4 : cy) : cy + fh / 2 - hcm / 2 - 1;
      box(wcm, hcm, dcm, hm, 'x', kx, ky, zf + dcm / 2);
    } else {
      if (isDoor) {
        box(hcm, wcm, dcm, hm, 'x', cx + side * (fw / 2 - 3), cy, zf + dcm / 2);
      } else {
        box(wcm, hcm, dcm, hm, 'x', cx, cy + fh * 0.12, zf + dcm / 2);
      }
    }
  } else if (hp.kind === 'procedural') {
    if (isDoor) {
      box(2.8, fh - 1, 1.6, hm, 'y', cx + side * (fw / 2 - 1.4), cy, zf + 0.8);
    } else {
      box(fw - 1, 2.8, 1.6, hm, 'x', cx, cy + fh / 2 - 1.4, zf + 0.8);
    }
  }
}

export function build() {
  if (!ready) return;
  clearGroup(); seed = 0;
  var L = layout();
  var w = state.w, d = state.d, legH = L.legH, hb = L.hb, n = L.n, r = L.r, gap = L.gap;
  var t = 1.8, ft = 1.8;
  var woodM = woodMat(state.wood, state.material, state.finish);
  var painted = state.color !== 'natural';
  var bodyM = painted ? paintMat(state.color, state.finish) : woodM;
  var dark = darkMat();
  var dc = d - ft - 0.1, cz = -d / 2 + dc / 2;

  // Carcass
  [-1, 1].forEach(function (sx) { box(t, hb, dc, bodyM, 'y', sx * (w / 2 - t / 2), legH + hb / 2, cz); });
  box(w - 2 * t, t, dc - 0.6, bodyM, 'x', 0, legH + t / 2, cz + 0.3);
  box(w - 2 * t, hb - t, 0.6, bodyM, 'y', 0, legH + t + (hb - t) / 2, -d / 2 + 0.3);
  var iw = w - 2 * t, cw = (iw - (n - 1) * t) / n;
  for (var i = 1; i < n; i++) {
    var dx = -w / 2 + t + i * cw + (i - 1) * t + t / 2;
    box(t, hb - t, dc - 0.6, bodyM, 'y', dx, legH + t + (hb - t) / 2, cz + 0.3);
  }
  // Top plate, always wood
  box(w + 1.6, L.top, d + 0.8, woodM, 'x', 0, legH + hb + L.top / 2, 0.4);
  // Dark reveal behind the fronts so the gaps read as shadow lines
  box(w - 0.2, hb - 0.2, 0.08, dark, 'x', 0, legH + hb / 2, -d / 2 + dc + 0.05);

  // Fronts
  var fz = d / 2 - ft / 2, zf = d / 2;
  var fronts = [];
  for (var c = 0; c < n; c++) {
    var cx = -w / 2 + gap + L.fw / 2 + c * (L.fw + gap);
    for (var j = 0; j < r; j++) {
      var cy = state.front === 'drawers'
        ? legH + gap + L.fh / 2 + j * (L.fh + gap)
        : legH + hb / 2;
      box(L.fw, L.fh, ft, bodyM, state.front === 'doors' ? 'y' : 'x', cx, cy, fz);
      fronts.push({ cx: cx, cy: cy });
    }
  }

  // Handles
  var hp = findById(HANDLES, state.handle);
  if (hp && hp.kind !== 'none') {
    var hm = handleMat(state.handleColor);
    var template = hp.kind === 'product' ? (modelCache[hp.id] || null) : null;
    if (!template && hp.kind === 'product' && hp.modelUrl) {
      ensureProductModel(hp, function (tpl) { if (tpl) build(); });
    }
    fronts.forEach(function (f) {
      var side = f.cx < -0.1 ? 1 : -1;
      addHandle(template, hp, hm, f.cx, f.cy, L.fw, L.fh, state.front === 'doors', side, zf);
    });
  }

  // Base
  var lp = findById(LEGS, state.legs);
  if (lp && lp.kind === 'product') {
    var inset = lp.inset || 6;
    [-1, 1].forEach(function (sx) {
      [-1, 1].forEach(function (sz) {
        box(4, legH, 4, woodM, 'y', sx * (w / 2 - inset), legH / 2, sz * (d / 2 - inset));
      });
    });
  } else {
    box(w - 4, legH, d - 4, dark, 'x', 0, legH / 2, -0.5);
  }
}

function makeEnv() {
  var c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  var g = c.getContext('2d');
  var grd = g.createLinearGradient(0, 0, 0, 512);
  grd.addColorStop(0, '#ffffff'); grd.addColorStop(0.48, '#d4d8d5'); grd.addColorStop(0.52, '#8a8c89'); grd.addColorStop(1, '#585a58');
  g.fillStyle = grd; g.fillRect(0, 0, 1024, 512);
  g.fillStyle = '#ffffff';
  g.fillRect(140, 70, 170, 95); g.fillRect(600, 55, 250, 115);
  var tex = new T.CanvasTexture(c);
  tex.mapping = T.EquirectangularReflectionMapping;
  tex.encoding = T.sRGBEncoding;
  var pm = new T.PMREMGenerator(renderer);
  var env = pm.fromEquirectangular(tex).texture;
  pm.dispose(); tex.dispose();
  return env;
}

export function resetView() {
  if (!ready) return;
  var asp = camera.aspect || 1.4;
  var dist = 400;
  if (asp < 1.3) dist *= Math.min(1.9, 1.3 / asp);
  var dir = new T.Vector3(0.52, 0.32, 0.79).normalize().multiplyScalar(dist);
  controls.target.set(0, state.h * 0.42, 0);
  camera.position.copy(dir).add(controls.target);
  controls.update();
}

export function initThree() {
  if (!ready) { fail('Failed to load the 3D library. Please refresh the page.'); return; }
  try {
    renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  } catch (e) {
    ready = false; fail('This browser does not support 3D (WebGL).'); return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;

  scene = new T.Scene();
  scene.environment = makeEnv();
  camera = new T.PerspectiveCamera(32, 1.4, 5, 3000);

  var key = new T.DirectionalLight(0xffffff, 0.85);
  key.position.set(190, 320, 230);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -220; key.shadow.camera.right = 220;
  key.shadow.camera.top = 220; key.shadow.camera.bottom = -220;
  key.shadow.camera.near = 20; key.shadow.camera.far = 900;
  key.shadow.bias = -0.0004; key.shadow.radius = 5;
  scene.add(key);
  scene.add(new T.AmbientLight(0xffffff, 0.3));
  var fill = new T.DirectionalLight(0xdfe8ff, 0.25);
  fill.position.set(-220, 120, -80);
  scene.add(fill);

  var floor = new T.Mesh(new T.PlaneGeometry(1200, 1200), new T.ShadowMaterial({ opacity: 0.24 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = 0.02; floor.receiveShadow = true;
  scene.add(floor);

  group = new T.Group();
  scene.add(group);

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  controls = new T.OrbitControls(camera, canvas);
  controls.enableDamping = !reduce;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 130; controls.maxDistance = 900;
  controls.minPolarAngle = 0.25; controls.maxPolarAngle = Math.PI / 2 - 0.03;

  function resize() {
    var w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
  else window.addEventListener('resize', resize);

  resetView();
  document.getElementById('resetView').addEventListener('click', resetView);

  (function tick() {
    requestAnimationFrame(tick);
    var ty = state.h * 0.42;
    controls.target.y += (ty - controls.target.y) * 0.12;
    controls.update();
    renderer.render(scene, camera);
  })();
}

export function isReady() { return ready; }
