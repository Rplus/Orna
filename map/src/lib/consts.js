import { getItem, saveItem, } from './u.js';
import fakeDataUrl from '../assets/fake.data.geo.json?url';
import staticDataUrl from '../assets/static.data.json?url';
import devDataUrl from '../assets/marker.geojson.json?url';

export const SpreadsheetId = '1A659IqM3DwCmThMbOhMt3mepmho-Gj8YqjATxoWP1dQ';
const dataUrl = 'https://opensheet.elk.sh/1u89k2oUXRFOLIqVCm6bGXD-2pugwj7RIhM1qBKbT9Zg/data';
const scriptId = 'AKfycbxd5C3UrBvu3ldvmB29ahpyQBJg7DIFfKpGRa04Tf-5xoACjacmGOWN-ck9f4PqwZ1J';
const scriptUrl = `https://script.google.com/macros/s/${scriptId}/exec?id=${SpreadsheetId}`;
// const scriptUrl = `https://script.google.com/macros/s/${scriptId}/dev?id=${SpreadsheetId}`;
// const formUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLScui2hv0qxmzxIIjIgTyI1FNCNvpbyI-UKBdfd5OjO1gVdVIA/formResponse';

export const urls = {
	post: scriptUrl,
	// get: devDataUrl,
	get: scriptUrl,
};

let _uuid = getItem('uuid');
export const uuid = _uuid || (crypto.randomUUID && crypto.randomUUID()) || +new Date();
if (!_uuid) {
	saveItem('uuid', uuid);
}
