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
  setStatus('Vrátené pôvodné nastavenie.');
});

document.getElementById('copyCfg').addEventListener('click', function () {
  var L = layout();
  var cfg = JSON.stringify({
    rozmery_cm: { sirka: state.w, vyska: state.h, hlbka: state.d },
    cela: state.front, stlpce: L.n, rady: L.r,
    drevo: state.wood, farba: state.color, material: state.material, povrch: state.finish,
    rucky: state.handle, farba_rucok: state.handle === 'none' ? null : state.handleColor,
    rozstup_rucky_mm: L.c2c || null, podstavec: state.legs
  }, null, 2);
  var ta = document.getElementById('json');
  ta.value = cfg;
  var done = function () { ta.hidden = true; setStatus('Konfigurácia je skopírovaná.'); };
  var fallback = function () { ta.hidden = false; ta.focus(); ta.select(); setStatus('Označte text a skopírujte ho.'); };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(cfg).then(done, fallback);
  } else { fallback(); }
});

buildForm();
syncInputs();
initThree();
refresh();
