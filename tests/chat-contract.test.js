const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const client = fs.readFileSync(path.join(__dirname, '..', 'chat.js'), 'utf8');
const page = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

assert.match(client, /fetch\('\/api\/chat'/);
assert.match(client, /sessionStorage/);
assert.match(client, /node\.chat\.session\.v1/);
assert.match(client, /textContent/);
assert.match(client, /OFFER_SECTION/);
assert.match(client, /NAVIGATE_SECTION/);
assert.match(client, /diagnostico/);
assert.doesNotMatch(client, /message\.includes/);
assert.doesNotMatch(client, /innerHTML/);
assert.match(page, /data-chat-suggestions/);
console.log('chat-contract PASS');
