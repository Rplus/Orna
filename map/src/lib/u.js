export const DungeonTypes = [
	['shops/dungeon', '地城'],
	['shops/fort', '哥布林要塞'],
	['shops/mystic_cave', '秘穴'],
	['shops/beast_den', '野獸巢穴'],
	['shops/dragon_roost', '巨龍宿巢'],
	['shops/underworld_portal', '冥府之門'],
	['shops/chaos_portal', '混沌之門'],
	['shops/battlegrounds', '絕地戰場'],
	['shops/valley_of_gods', '眾神之谷'],
	// ['titan_workshop', '奧林匹克塔'],
	['bosses/titan_selene', '泰坦‧塞勒涅'],
	['bosses/titan_oceanus', '泰坦‧奧克亞諾斯'],
	['bosses/titan_eos', '泰坦‧愛奧斯'],
	['bosses/titan_prometheus', '泰坦‧普羅米修斯'],
	['bosses/titan_themis', '泰坦‧泰美斯'],
	['shops/coliseum', '羅馬競技場'],
	['shops/arcanist', '奧術商店'],
	['shops/bestiary', '寵物店'],
	['shops/bazaar', '市集'],
];

export function getDungeonTypeName(type = '') {
	return DungeonTypes.find(i => i[0] === type)?.[1] || type || '?';
}

const DungeonMarkerIcons = {};
export function getMarkerIcon(type) {
	if (!DungeonMarkerIcons[type]) {
		let size = 36 * 1.25;
		DungeonMarkerIcons[type] = L.icon({
			iconUrl: getDungeonImageUrl(type),
			iconSize: [size, size],
			iconAnchor: [size / 2, size],
			popupAnchor: [0, -size],
			tooltipAnchor: [0, 2],
			className: `dungeon-icon dungeon-icon--${imgPathToName(type) || 'unknown'}`,
		});
	};
	return DungeonMarkerIcons[type];
}

export function getDungeonImageUrl(type) {
	let iconUrl = `https://playorna.com/static/img/${type || 'dungeon'}.png`;
	if (!type || type === 'unknown') {
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

export function imgPathToName(path = '') {
	return path.split('/').reverse()[0];
}

// todo
// https://www.google.com.tw/search?q=render+marker+in+view+leaflet
