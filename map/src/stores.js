import { writable } from 'svelte/store';
import { getItem, saveItem, } from './lib/u.js';
import { DungeonTypes, imgPathToName, hexToRgba } from './lib/u.js';

export const alts = writable(getItem('alts'));
export const map = writable(null);
export const ioHQ = writable(getItem('ioHQ') || { vd: 500, });

ioHQ.subscribe(value => {
	saveItem('ioHQ', value);
});


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
export const dungeonVisibility = writable(getItem('dungeon_visibility') || _dungeonVisibility);
dungeonVisibility.subscribe(value => {
	saveItem('dungeon_visibility', value);
});



export const dungeonIconStyle = writable(getItem('dungeonIconStyle') || {
	bgc: '#ffff66',
	bgcAlpha: 0.6,
});
dungeonIconStyle.subscribe(style => {
	saveItem('dungeonIconStyle', style);
	document.body.style = `--dungeon-icon-bgc: ${hexToRgba(style.bgc, style.bgcAlpha)}`;
});
