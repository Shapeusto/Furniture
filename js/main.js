import { state, resetState } from './state.js';
import { buildForm, syncInputs, updateUI } from './ui.js';
import { initThree, build, resetView, isReady } from './scene.js';
import { layout } from './layout.js';

var form = document.getElementById('controls');
var statusEl = document.getElementById('status'), statusTimer;

function setStatus(msg) {
  statusEl.textContent = msg;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(function () { statusEl.textContent = ''; }, 2800);
}

function refresh() { updateUI(); build(); }

form.addEventListener('input', function (e) {
  var el = e.target;
  if (el.type === 'range') {
    state[el.id.replace('s-', '')] = Number(el.value);
    refresh();
  }
});
form.addEventListener('change', function (e) {
  var el = e.target;
  if (el.type === 'radio' && el.checked) {
    state[el.name] = el.value;
    refresh();
  }
});

document.getElementById('resetCfg').addEventListener('click', function () {
  resetState();
  syncInputs(); refresh();
  if (isReady()) resetView();
  setStatus('Reset to defaults.');
});

document.getElementById('copyCfg').addEventListener('click', function () {
  var L = layout();
  var cfg = JSON.stringify({
    dimensions_cm: { width: state.w, height: state.h, depth: state.d },
    front: state.front, columns: L.n, rows: L.r,
    wood: state.wood, color: state.color, material: state.material, finish: state.finish,
    handles: state.handle, handle_color: state.handle === 'none' ? null : state.handleColor,
    handle_spacing_mm: L.c2c || null, base: state.legs
  }, null, 2);
  var ta = document.getElementById('json');
  ta.value = cfg;
  var done = function () { ta.hidden = true; setStatus('Configuration copied.'); };
  var fallback = function () { ta.hidden = false; ta.focus(); ta.select(); setStatus('Select the text and copy it.'); };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(cfg).then(done, fallback);
  } else { fallback(); }
});

buildForm();
syncInputs();
initThree();
refresh();
