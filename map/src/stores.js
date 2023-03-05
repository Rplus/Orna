import { writable } from 'svelte/store';
import { getItem, saveItem, } from './lib/u.js';
import { DungeonTypes, imgPathToName } from './lib/u.js';

export const alts = writable(getItem('alts'));
export const map = writable(null);
export const ioHQ = writable(getItem('ioHQ') || {});

let _dungeonVisibility = DungeonTypes.map(i => ({
	id: imgPathToName(i[0]),
	img: i[0],
	visible: true,
	name: i[1],
}));
_dungeonVisibility.unshift({
	id: 'unknown',
	visible: true,
	name: '?',
});

ioHQ.subscribe(value => {
	saveItem('ioHQ', value);
});

export const dungeonVisibility = writable(getItem('dungeon_visibility') || _dungeonVisibility);
dungeonVisibility.subscribe(value => {
	saveItem('dungeon_visibility', value);
});
	saveItem('dungeon_visibility', _dungeonVisibility);
