import { writable } from 'svelte/store';
import { getItem, saveItem, } from './lib/u.js';

export const alts = writable(getItem('alts'));
export const map = writable(null);
export const ioHQ = writable({});
