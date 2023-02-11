export const DungeonTypes = [
	['dungeon', '地城'],
	['fort', '哥布林要塞'],
	['mystic_cave', '秘穴'],
	['beast_den', '野獸巢穴'],
	['dragon_roost', '巨龍宿巢'],
	['underworld_portal', '冥府之門'],
	['chaos_portal', '混沌之門'],
	['battlegrounds', '絕地戰場'],
	['valley_of_gods', '眾神之谷'],
	['coliseum', '羅馬競技場'],
];

export function getDungeonImageUrl(type) {
	let iconUrl = `https://playorna.com/static/img/shops/${type || 'dungeon'}.png`;
	if (!type) {
		iconUrl = genBase64EmojiSvg('❓');
	}
	if (type === '⚠️remove') {
		iconUrl = genBase64EmojiSvg('❌');
	}
	return iconUrl;
}

const STORAGE_KEY = 'Orna/map';
export function saveItem(key, data) {
  if (!data || !key) { return false;}
  let odata = getItem() || {};
  odata[key] = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(odata));
};

export function getItem(key) {
  let data = localStorage.getItem(STORAGE_KEY);
  if (!data) { return null; }
  data = JSON.parse(data);
  return key ? data[key] : data;
};


export function genBase64EmojiSvg(emoji, options) {
	options = {
		...{ x: '.1em', y: '1em', size: 70 },
		...options,
	};
	// let svgString = `<svg viewBox='0 0 64 64'><text x=${options.x} y=${options.y} font-size='70'>${emoji}</text></svg>`;
	let svgString = `<svg height="100" width="100" xmlns="http://www.w3.org/2000/svg"><text x="${options.x}" y="${options.y}" font-size="${options.size}">${emoji}</text></svg>`;
	let decoded = unescape(encodeURIComponent(svgString));
	let base64 = window.btoa(decoded);
	let url = `data:image/svg+xml;base64,${base64}`;
	return url;
}

// todo
// https://www.google.com.tw/search?q=render+marker+in+view+leaflet
