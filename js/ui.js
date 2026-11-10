import { WOODS, MATS, COLORS, HANDLES, HANDLE_COLORS, FRONTS, LEGS, FINISHES } from './data.js';
import { state } from './state.js';
import { layout } from './layout.js';
import { woodCanvas } from './textures.js';

var form = document.getElementById('controls');

function slider(key, label, min, max, step) {
  return '<div class="group"><div class="row"><label for="s-' + key + '">' + label + '</label><output id="o-' + key + '" for="s-' + key + '"></output></div>' +
    '<input type="range" id="s-' + key + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + state[key] + '">' +
    '<div class="ticks"><span>' + min + ' cm</span><span>' + max + ' cm</span></div></div>';
}

function seg(key, label, opts, withHint) {
  return '<fieldset class="group" id="g-' + key + '"><legend>' + label + '</legend><div class="seg">' +
    opts.map(function (o) {
      return '<label><input type="radio" name="' + key + '" value="' + o[0] + '"><span>' + o[1] + '</span></label>';
    }).join('') + '</div>' + (withHint ? '<p class="hint" data-hint="' + key + '"></p>' : '') + '</fieldset>';
}

function woodSwatches() {
  return '<fieldset class="group"><legend>Wood</legend><div class="swgrid">' +
    Object.keys(WOODS).map(function (k) {
      var url = woodCanvas(k, 'massive').toDataURL('image/jpeg', 0.75);
      return '<label class="sw"><input type="radio" name="wood" value="' + k + '"><span class="chipimg" style="background-image:url(' + url + ')"></span><em>' + WOODS[k].name + '</em></label>';
    }).join('') + '</div></fieldset>';
}

function colorSwatches() {
  return '<fieldset class="group"><legend>Colour</legend><div class="swgrid">' +
    COLORS.map(function (c) {
      var cls = c[2] ? '' : ' natural';
      var st = c[2] ? ' style="background:' + c[2] + '"' : '';
      return '<label class="sw"><input type="radio" name="color" value="' + c[0] + '"><span class="chipimg' + cls + '"' + st + '></span><em>' + c[1] + '</em></label>';
    }).join('') + '</div><p class="hint" id="colorHint"></p></fieldset>';
}

function handleColorSwatches() {
  return '<fieldset class="group" id="g-handleColor"><legend>Handle colour</legend><div class="swgrid small" id="hcGrid">' +
    HANDLE_COLORS.map(function (c) {
      return '<label class="sw"><input type="radio" name="handleColor" value="' + c[0] + '"><span class="chipimg" style="background:linear-gradient(135deg,' + c[2] + ',' + c[2] + ' 45%,rgba(255,255,255,0.55) 55%,' + c[2] + ' 65%)"></span><em>' + c[1] + '</em></label>';
    }).join('') + '</div></fieldset>';
}

export function buildForm() {
  form.innerHTML =
    '<div class="group-wrap" style="display:flex;flex-direction:column;gap:18px">' +
    slider('w', 'Width', 60, 240, 5) + slider('h', 'Height', 60, 140, 5) + slider('d', 'Depth', 30, 60, 1) +
    '</div>' +
    seg('front', 'Fronts', FRONTS, true) +
    woodSwatches() +
    colorSwatches() +
    seg('material', 'Material', Object.keys(MATS).map(function (k) { return [k, MATS[k].name, MATS[k].desc]; }), true) +
    seg('finish', 'Finish', FINISHES, true) +
    seg('handle', 'Handles', HANDLES, true) +
    handleColorSwatches() +
    seg('legs', 'Base', LEGS, true);
}

function hintFor(key) {
  var lists = { front: FRONTS, finish: FINISHES, handle: HANDLES, legs: LEGS };
  if (key === 'material') return MATS[state.material].desc;
  var list = lists[key];
  for (var i = 0; i < list.length; i++) if (list[i][0] === state[key]) return list[i][2];
  return '';
}

function nameOf(list, key) {
  for (var i = 0; i < list.length; i++) if (list[i][0] === key) return list[i][1];
  return key;
}

export function syncInputs() {
  ['w', 'h', 'd'].forEach(function (k) { document.getElementById('s-' + k).value = state[k]; });
  var radios = form.querySelectorAll('input[type="radio"]');
  for (var i = 0; i < radios.length; i++) radios[i].checked = state[radios[i].name] === radios[i].value;
}

export function updateUI() {
  ['w', 'h', 'd'].forEach(function (k) { document.getElementById('o-' + k).textContent = state[k] + ' cm'; });
  var hints = form.querySelectorAll('[data-hint]');
  for (var i = 0; i < hints.length; i++) hints[i].textContent = hintFor(hints[i].getAttribute('data-hint'));
  document.getElementById('colorHint').textContent = state.color === 'natural'
    ? 'Shows the grain of the selected wood.'
    : 'Carcass and fronts are painted; the top and legs stay in wood.';
  var none = state.handle === 'none';
  document.getElementById('hcGrid').classList.toggle('disabled', none);
  var hcInputs = document.querySelectorAll('#hcGrid input');
  for (var j = 0; j < hcInputs.length; j++) hcInputs[j].disabled = none;
  document.documentElement.style.setProperty('--wood-img', 'url(' + woodCanvas(state.wood, 'massive').toDataURL('image/jpeg', 0.75) + ')');

  var L = layout();
  document.getElementById('dims').innerHTML =
    '<span><b>W</b>' + state.w + '</span><span><b>H</b>' + state.h + '</span><span><b>D</b>' + state.d + '</span><span>cm</span>';

  var colorName = nameOf(COLORS, state.color);
  var surface = state.color === 'natural'
    ? WOODS[state.wood].name + ', ' + MATS[state.material].name.toLowerCase()
    : colorName + ' lacquer, top in ' + WOODS[state.wood].name.toLowerCase();
  var fronts = state.front === 'drawers'
    ? (L.n * L.r) + ' drawers (' + L.n + ' × ' + L.r + ')'
    : L.n + (L.n === 1 ? ' door' : ' doors');
  var handleTxt = 'no handles';
  if (state.handle === 'bar') handleTxt = 'bar handles ' + L.c2c + ' mm, ' + nameOf(HANDLE_COLORS, state.handleColor).toLowerCase();
  if (state.handle === 'knob') handleTxt = 'knobs, ' + nameOf(HANDLE_COLORS, state.handleColor).toLowerCase();
  if (state.handle === 'edge') handleTxt = 'rail, ' + nameOf(HANDLE_COLORS, state.handleColor).toLowerCase();

  var rows = [
    ['Dimensions', state.w + ' × ' + state.h + ' × ' + state.d + ' cm', true],
    ['Fronts', fronts, false],
    ['Surface', surface, false],
    ['Material', MATS[state.material].name + ', ' + nameOf(FINISHES, state.finish).toLowerCase(), false],
    ['Handles', handleTxt, false],
    ['Base', nameOf(LEGS, state.legs).toLowerCase() + ', ' + L.legH + ' cm', false]
  ];
  document.getElementById('sum').innerHTML = rows.map(function (r) {
    return '<dt>' + r[0] + '</dt><dd' + (r[2] ? ' class="mono"' : '') + '>' + r[1] + '</dd>';
  }).join('');
}
