# LRU Cache

## Project Overview

An LRU (Least Recently Used) cache stores a fixed number of entries and discards
the entry that has gone unused the longest when a new entry needs room. It gives
a cheap way to keep frequently accessed data in memory while slower, colder data
gets dropped.

This implementation supports `get(key)` and `put(key, value)`, both in O(1)
average time, using only plain JavaScript and Node.js.

## Data Structures

### Map

A `Map` maps each key to its linked list node, so a key can be found in O(1)
average time without searching the list.

```text
"A" -> Node("A", 10)
"B" -> Node("B", 20)
```

### Doubly Linked List

A custom doubly linked list maintains usage order. Each node holds `prev` and
`next` references, which means a node can be detached or moved to the front
without traversing anything.

```text
HEAD <-> A <-> B <-> C <-> TAIL
```

`HEAD` and `TAIL` are dummy sentinel nodes. They remove the edge cases around
inserting at the front and removing at the back.

## How LRU Ordering Works

```text
HEAD -> Most Recently Used -> ... -> Least Recently Used <- TAIL
```

The most recently used entry sits just after `HEAD`. The least recently used
entry sits just before `TAIL`.

**After a successful `get()`** the node is unlinked from its current position and
re-inserted at the front, making it the most recently used entry. A `get()` on a
missing key returns `-1` and leaves the order untouched.

**After `put()`** an existing key has its value updated in place and is moved to
the front, so no duplicate node is created. A new key is inserted at the front and
added to the `Map`. If the `Map` then holds more entries than the capacity, the
node before `TAIL` is unlinked and its key is deleted from the `Map`.

**Eviction** therefore always removes the entry nearest `TAIL`, which is the one
that has gone unused the longest.

## Complexity

```text
get()      O(1) average
put()      O(1) average
Space      O(capacity)
```

`get()` performs one `Map` lookup, one unlink and one insert at the front.
`put()` performs at most one `Map` lookup, one insert and one eviction. Every
step touches a fixed number of nodes, so neither operation walks the cache. Each
key holds exactly one node, so memory is bounded by the capacity.

`keys()` is the only method that walks the list. It exists for tests and the
example output, and is not part of the `get()`/`put()` path.

## Installation

There are no dependencies, so there is nothing to install. Node.js 18 or newer
is required for the built-in test runner.

```bash
npm install
```

## Run Tests

```bash
npm test
```

## Run Example

```bash
npm run example
```

## Example

```js
const { LRUCache } = require('./src/lru-cache');

const cache = new LRUCache(2);

cache.put('A', 10);
cache.put('B', 20);

cache.get('A'); // 10, and A becomes the most recently used
cache.put('C', 30); // cache is full, so B is evicted

cache.get('B'); // -1
cache.get('C'); // 30
cache.get('A'); // 10
```

## Project Structure

```text
lru-cache/
├── src/
│   └── lru-cache.js
├── tests/
│   └── lru-cache.test.js
├── example/
│   └── run-example.js
├── INSTRUCTIONS.md
├── package.json
└── README.md
```
