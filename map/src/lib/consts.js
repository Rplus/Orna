import { getItem, saveItem, } from './u.js';
import fakeDataUrl from '../fake.data.geo.json?url';
import devDataUrl from '../marker.geojson.json?url';

const dataUrl = 'https://opensheet.elk.sh/1u89k2oUXRFOLIqVCm6bGXD-2pugwj7RIhM1qBKbT9Zg/data';

export const urls = {
	// post: '',
	post: 'http://localhost:5173/Orna/map/',
	get: dataUrl,
	get: devDataUrl,
	get: fakeDataUrl,
};

let _uuid = getItem('uuid');
export const uuid = _uuid || crypto.randomUUID();
if (!_uuid) {
	saveItem('uuid', uuid);
}

export const SpreadsheetId = '1A659IqM3DwCmThMbOhMt3mepmho-Gj8YqjATxoWP1dQ';
