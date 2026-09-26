'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { LRUCache } = require('../src/lru-cache');

test('put then get returns the stored value', () => {
  const cache = new LRUCache(2);

  cache.put('A', 10);

  assert.equal(cache.get('A'), 10);
});

test('get on a missing key returns -1', () => {
  const cache = new LRUCache(2);

  assert.equal(cache.get('unknown'), -1);
});

test('a failed get does not change the cache order', () => {
  const cache = new LRUCache(3);

  cache.put('A', 10);
  cache.put('B', 20);
  cache.put('C', 30);

  assert.equal(cache.get('missing'), -1);
  assert.deepEqual(cache.keys(), ['C', 'B', 'A']);
});

test('get updates recency so the other key is evicted', () => {
  const cache = new LRUCache(2);

  cache.put('A', 10);
  cache.put('B', 20);

  assert.equal(cache.get('A'), 10);
  assert.deepEqual(cache.keys(), ['A', 'B']);

  cache.put('C', 30);

  assert.equal(cache.get('B'), -1);
  assert.equal(cache.get('A'), 10);
  assert.equal(cache.get('C'), 30);
});

test('put evicts the least recently used entry when full', () => {
  const cache = new LRUCache(2);

  cache.put('A', 10);
  cache.put('B', 20);
  cache.put('C', 30);

  assert.equal(cache.get('A'), -1);
  assert.equal(cache.get('B'), 20);
  assert.equal(cache.get('C'), 30);
});

test('put on an existing key updates the value without a duplicate node', () => {
  const cache = new LRUCache(2);

  cache.put('A', 10);
  cache.put('A', 50);

  assert.equal(cache.get('A'), 50);
  assert.deepEqual(cache.keys(), ['A']);
  assert.equal(cache.map.size, 1);
});

test('updating an existing key also updates recency', () => {
  const cache = new LRUCache(2);

  cache.put('A', 10);
  cache.put('B', 20);
  cache.put('A', 100);
  cache.put('C', 30);

  assert.equal(cache.get('B'), -1);
  assert.equal(cache.get('A'), 100);
  assert.equal(cache.get('C'), 30);
});

test('capacity of 1 keeps only the newest entry', () => {
  const cache = new LRUCache(1);

  cache.put('A', 10);
  cache.put('B', 20);

  assert.equal(cache.get('A'), -1);
  assert.equal(cache.get('B'), 20);
});

test('invalid capacity is rejected', () => {
  assert.throws(() => new LRUCache(0), /Capacity must be a positive integer\./);
  assert.throws(() => new LRUCache(-1), /Capacity must be a positive integer\./);
  assert.throws(() => new LRUCache(-10), /Capacity must be a positive integer\./);
  assert.throws(() => new LRUCache(1.5), /Capacity must be a positive integer\./);
  assert.throws(() => new LRUCache('2'), /Capacity must be a positive integer\./);
  assert.throws(() => new LRUCache(), /Capacity must be a positive integer\./);
});

test('valid capacities are accepted', () => {
  for (const capacity of [1, 2, 3, 100]) {
    assert.equal(new LRUCache(capacity).capacity, capacity);
  }
});

test('repeated puts evict one entry at a time', () => {
  const cache = new LRUCache(2);

  cache.put('A', 1);
  cache.put('B', 2);
  cache.put('C', 3);
  cache.put('D', 4);

  assert.deepEqual(cache.keys(), ['D', 'C']);
  assert.equal(cache.map.size, 2);
  assert.equal(cache.get('A'), -1);
  assert.equal(cache.get('B'), -1);
});

test('cache never grows beyond its capacity', () => {
  const capacity = 50;
  const cache = new LRUCache(capacity);

  for (let i = 0; i < 1000; i++) {
    cache.put(`key-${i}`, i);
  }

  assert.equal(cache.map.size, capacity);

  let length = 0;
  for (let node = cache.head.next; node !== cache.tail; node = node.next) {
    length++;
  }
  assert.equal(length, capacity, 'linked list length matches capacity');
});
