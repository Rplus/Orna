import fs from 'fs';
import fetch from 'node-fetch';
// import { parse, NodeType } from 'node-html-parser';
import { readJsonFile, outputJSON, getArgs, parseDom } from './u.mjs';

// To use:
// node ./task/guide-parser.mjs
// node ./task/guide-parser.mjs type=skills
// node ./task/guide-parser.mjs type=skills parse=1


// const dom = parse("<div>some HTML</div>")
// console.log(112, dom.firstChild.structure);
// const doc = dom.window.document
// console.log(doc);


var args = getArgs();
// type: 'items', 'monsters', 'pets', 'skills',
// typeNumber = 0 ~ 3
// parse = 1 || 0

// https://orna.guide/items?page=1
// https://orna.guide/monsters
// https://orna.guide/pets
// https://orna.guide/skills

console.log({args});
let cc = 0;

let parserTypes = [
	'items',
	'monsters',
	'pets',
	'skills',
];

let parserType = parserTypes[2]; // try pets fallback

if (args.type) {
	if (parserTypes.some(i => i === args.type)) {
		parserType = args.type;
	} else {
		console.error(`error type: ${args.type}`);
	}
}

if (args.typeNumber && args.typeNumber >= 0 && args.typeNumber < parserTypes.length - 1) {
	parserType = parserTypes[typeNumber];
}
console.log({parserType});

let rawFilePath = `./raw-data/${parserType}.raw.json`;
let jsonFilePath = `./op-data/${parserType}.src.json`;

let latestPage = 1;

let raw = []; // html, for cache
let data = []; // dom

// dev
let rawContent = readJsonFile(rawFilePath);
// let b = parseDom(rawContent);
// console.log(111, b?.querySelector('img')?.outerHTML);
// console.log({rawContent: !!rawContent});

if (args.parse || !rawContent) {
	console.log(`- start parsing ${parserType}`);
	fetchPageContent();
} else {
	console.log(`- ${parserType} data is cached. add "parse" args to trigger re-parse`);
	console.time('dom parse');
	data = rawContent.map(i => parseDom(i, true));
	console.timeEnd('dom parse');
	splitContent();
}

function splitContent() {
	console.log('== handle data ==');
	console.time('handle data');
	let items = [];
	data.forEach(pageContent => {
		if (!pageContent) {
			return;
		}
		items = items.concat(...pageContent.querySelectorAll('.card'));
	});

	// get item data
	let obj = items.map(item => {

		let basic = parseBasic(item);
		let body = parseBody(item.querySelector('.card-body'), parserType);

		return {
			...basic,
			...body,
		};
	});

	// let xx = [...new Set(obj.map(i => i.p).flat())]
	// console.log(233, xx);
	// let yy = obj.filter(i => i.p === 3 && !i.allp[2].startsWith('Ability:')).map(i => i.id)
	// console.log(333, yy);

	// outputJSON(items.map(i => i.outerHTML), jsonFilePath);
	console.timeEnd('handle data');
	outputJSON(obj, jsonFilePath);
	// outputJSON(
	// 	obj.map(i => i.nodes),
	// 	jsonFilePath);
}

function parseBasic(item) {
	if (parserType === 'skills') {
		return parseBasicForSkills(item);
	}
	let [permalink, codex] = item.querySelectorAll('.card-footer .card-text a');
	let header = item.querySelector('.card-header');
	let img = header.querySelector('.img')?.src;
	let title = header.textContent.replace(/\s+/g, ' ').trim();
	let tier;

	if (title.match(/★/)) {
		let [, _title, _tier] = title.match(/([^★]+) (★[★\d]*)/);
		title = _title;
		tier = parseTier(tier);
	}

	let oo = {
		...u_parseHref(permalink.getAttribute('href')),
		// gid: +permalink.href.match(/\d+/)[0],
		// permalink: permalink.href,
		codex: codex.getAttribute('href').replace('https://playorna.com/codex', ''),
		title: title.replace('BOSS ', ''),
		tier,
		img,
	};

	let isBoss = title.startsWith('BOSS ');
	if (isBoss) {
		oo.boss = 1;
	}

	// FIXME: remove 404 codex page
	if (oo.codex === 'https://playorna.comnone/') {
		delete oo.codex;
	}
	return oo;
}

function parseBasicForSkills(item) {
	let [permalink, codex] = item.querySelectorAll('.card-footer .card-text a');
	let header = item.querySelector('.card-header');

	// temp
	let ccc = codex.getAttribute('href').replace('https://playorna.com/codex', '');
	cc = (ccc === "/spells/bolt/");

	return {
		...u_parseHref(permalink.getAttribute('href')),
		codex: codex.getAttribute('href').replace('https://playorna.com/codex', ''),
		title: header.querySelector('h5')?.textContent.trim(),
		type: header.querySelector('p.card-text')?.textContent.trim().toLowerCase(),
		tier: parseTier(header.querySelector('.text-right h5')?.textContent.trim()),
		mp: Number.parseInt(header.querySelector('.text-right p')?.textContent || 0),
	};
}

function parseBody(tbody, parserType) {
	switch (parserType) {
		case 'items': {
			// weak parsing roles for 'p'
			let oo = {};
			let rarityRegex = /^(\w+) rarity$/;
			let intro = [...tbody.querySelectorAll('p')].map(p => {
				let rarity = p.textContent.match(rarityRegex);
				if (rarity) {
					oo.rarity = rarity[1].toLowerCase();
					return;
				}
				if (p.textContent.startsWith('Ability:')) {
					let ability = p.textContent.match(/Ability: (.+)\n\t\t(.+)/);
					oo.ability = [ability[1], ability[2]];
					return;
				}
				return p.textContent;
			}).join(' ');

			let stats = [...tbody.querySelectorAll('.text-nowrap .col')]
				.map(i => u_parseStatPair(i.textContent.trim().replace(/\s+/g, ' ')));

			let props = [...tbody.querySelectorAll('[class="row card-text"]')].map(u_parsePair);

			return {
				...oo,
				intro,
				stats: stats.length && stats.reduce((all, i ) => ({...all, ...i}), {}),
				props,
			};
		}

		case 'monsters': {
			let intro = tbody.querySelector('p')?.textContent;
			let props = [...tbody.querySelectorAll('div.row.card-text')].map(u_parsePair);
			return {
				intro,
				props,
			};
		}

		// TODO
		case 'skills': {
			let intro = tbody.querySelector('p')?.textContent;
			let badge = tbody.querySelector('.badge')?.textContent?.toLowerCase();
			let props_ctx = tbody.querySelectorAll('div.row.card-text:has(.col-6)');
			let props = [];
			if (tbody.querySelector('.col-6')) {
				props = [...props_ctx].map(u_parsePair);
			}
			if (tbody.querySelector('.col-12')) {
				let col12 = tbody.querySelectorAll('.col-12');
				props.unshift({
					[col12[0].textContent.toLowerCase()]: parseInt(col12[1].textContent.replace(/\D/g, '')),
				})
			}

			let _op = {
				intro,
				props,
				badge,
			};
			if (!_op.props.length) {
				delete _op.props;
			}
			return _op;
		}

		case 'pets': {
			let intro = tbody.querySelector('p')?.textContent;
			let event = tbody.querySelector('p.text-danger')?.textContent;
			let items = [...tbody.querySelectorAll('div.card-text')];
			let price = u_parseNumber(tbody.querySelector('div.card-text.text-center')?.textContent);
			let props = [...tbody.querySelectorAll('div.row.card-text')].map(u_parsePair);

			return {
				intro,
				event,
				price,
				props,
			};
		}

		default: {
			break;
		}
	}
}

function fetchPageContent(pageNumber = 1) {
	console.log(`- page #${pageNumber} parsing...`);
	fetch(`https://orna.guide/${parserType}?page=${pageNumber}`)
	.then(res => res.text())
	.then(d => {
		let doc = parseDom(d);

		// data[pageNumber] = pageNumber;
		data[pageNumber] = doc.querySelector('.card-deck');
		raw[pageNumber] = doc.querySelector('.card-deck').innerHTML;
		outputJSON(raw, rawFilePath);

		if (pageNumber === 1) {
			let pages = doc.querySelectorAll('div[class="row justify-content-center"] a');
			latestPage = +pages[pages.length - 1].textContent;
		}

		if (pageNumber === latestPage) {
			console.log(`- all pages paresed!!`);
			splitContent();
		} else {
			fetchPageContent(pageNumber + 1);
		}
	});
}

function u_parseNumber(str = '') {
	return Number.parseInt(str.replace(/\D/g, ''));
}

function u_parseStatPair(str = '') {
	let pair = str.split(': ').map(i => i.toLowerCase());
	let value = Number.parseFloat(pair[1]);
	if (isNaN(value)) {
		value = true;
	}
	return {
		[pair[0]]: value,
	};
}

function u_parsePair(node) {
	let nodes = node.querySelectorAll('.col-6');
	let prop = nodes[0].textContent.toLowerCase();
	let value = nodes[1].childElementCount === 0
		?	nodes[1].textContent
		: [...nodes[1].childNodes]
				.filter(i => (i.nodeType === 3) || (i.tagName && i.tagName !== 'BR'))
				.map(i => {
					switch (i.nodeType) {
						case 3: {
							return i.textContent;
						}
						case 1: {
							let a = i;
							if (a.tagName !== 'A') {
								a = a.querySelector('a');
							}
							if (a) {
								let _op = {
									...u_parseHref(a.getAttribute('href')),
									name: a.textContent,
								};

								// for skill learned level
								if (i.querySelector('small')) {
									_op.ps = i.querySelector('small').textContent;
								}
								return _op;
							} else {
								return i.textContent;
							}
						}
						default: {
							return null;
						}
					}
				})
		;

	return {
		[prop]: value,
		// [prop]: 1,
	};
}

function u_parseHref(url = '') {
	let [, cate, id] = url.match(/\/(\w+)\?show\=(\d+)/);
	return {
		id: +id,
		cate,
	};
}

function parseTier(str = '') { // str: ★9 | ★★★
	return +str.match(/\d/) || str.length;
}
