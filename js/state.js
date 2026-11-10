import { DEFAULTS } from './data.js';

export const state = Object.assign({}, DEFAULTS);

export function resetState() {
  Object.assign(state, DEFAULTS);
}
