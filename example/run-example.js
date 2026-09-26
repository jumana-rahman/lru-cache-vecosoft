'use strict';

const { LRUCache } = require('../src/lru-cache');

const cache = new LRUCache(2);

function format(keys) {
  return `[${keys.join(', ')}]`;
}

function show(line, detail = '') {
  const action = line.padEnd(12);
  const evicted = detail === '' ? '' : `  evicted: ${detail}`;
  console.log(`${action} cache: ${format(cache.keys())}${evicted}`);
}

function put(key, value) {
  const before = cache.keys();
  cache.put(key, value);
  const removed = before.filter((existing) => !cache.keys().includes(existing));
  show(`PUT ${key}=${value}`, removed.join(', '));
}

function get(key) {
  const value = cache.get(key);
  show(`GET ${key} -> ${value}`);
}

console.log('LRU cache with capacity 2');
console.log('order shown as [most recent, ..., least recent]');
console.log('');

put('A', 10);
put('B', 20);
get('A');
put('C', 30);
get('B');
get('C');
get('A');
