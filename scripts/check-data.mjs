import assert from 'node:assert/strict';
import fs from 'node:fs';
import {items,paragraphs} from '../components/content.js';
const d=JSON.parse(fs.readFileSync(new URL('../data/deal-page-data.json',import.meta.url)));
assert.equal(d.currency,'GBP');assert.equal(d.price,'249');assert.equal(d.heroImages.length,3);assert.equal(d.itineraries.length,4);assert.equal(d.dealFAQs.length,5);assert.equal(items(d.hotels[0].amenities).length,26);assert.equal(items(d.hotels[0].roomAmenities).length,13);assert.equal(items(d.finePrint).length,15);assert.equal(new Set(items(d.excursions)).size,9);assert.equal(paragraphs(d.overview.content).length,2);console.log('Data checks passed.');
