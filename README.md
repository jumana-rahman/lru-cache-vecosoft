# 🧠 LRU Cache

A simple **Least Recently Used (LRU) Cache** implementation using **JavaScript and Node.js**.

The cache stores a fixed number of key-value pairs. When the cache reaches its capacity and a new entry needs to be added, the **least recently used** entry is removed.

The implementation supports:

* `get(key)`
* `put(key, value)`

Both operations run in **O(1) average time**.

### 🛠️ Tech Stack

* 🟨 JavaScript
* 🟢 Node.js
* 🧪 Node.js built-in test runner
* 🚫 No external runtime dependencies

### 📦 Data Structures

The implementation uses two data structures together:

#### `Map`

A JavaScript `Map` stores each key and its corresponding linked-list node.

```text
"A" → Node("A", 10)
"B" → Node("B", 20)
```

This allows the cache to find a key in **O(1) average time**.

#### Doubly Linked List

A custom doubly linked list maintains the order of recently used entries.

```text
HEAD <-> A <-> B <-> C <-> TAIL
```

The list uses two dummy sentinel nodes:

* `HEAD` — beginning of the list
* `TAIL` — end of the list

The entry closest to `HEAD` is the **Most Recently Used (MRU)** entry.

The entry closest to `TAIL` is the **Least Recently Used (LRU)** entry.

### 🔄 How LRU Ordering Works

```text
HEAD → Most Recently Used → ... → Least Recently Used ← TAIL
```

#### `get(key)`

When the key exists:

1. The value is returned.
2. The node is removed from its current position.
3. The node is moved to the front.
4. It becomes the most recently used entry.

When the key does not exist:

```text
get(key) → -1
```

The cache order remains unchanged.

#### `put(key, value)`

When the key does not exist:

1. A new node is created.
2. It is added to the front of the list.
3. The key and node are stored in the `Map`.
4. If the cache exceeds its capacity, the least recently used node is removed.

When the key already exists:

1. Its value is updated.
2. The existing node is moved to the front.
3. No duplicate node is created.

### 🗑️ Eviction

When the cache exceeds its capacity, the node immediately before `TAIL` is removed.

For example:

```text
Capacity = 2

HEAD → B → A → TAIL
        ↑    ↑
       MRU  LRU
```

If `C` is added:

```text
HEAD → C → B → TAIL
```

`A` is removed because it was the least recently used entry.

### ✅ Supported Behavior

The implementation supports the following required behaviors:

* ✅ `get(key)` returns the value for an existing key.
* ✅ `get(key)` returns `-1` for a missing key.
* ✅ A successful `get()` makes the key most recently used.
* ✅ `put(key, value)` inserts a new key.
* ✅ `put(key, value)` updates an existing key.
* ✅ Updating a key makes it most recently used.
* ✅ The least recently used entry is evicted when capacity is exceeded.
* ✅ Cache capacity must be greater than `0`.

### ⏱️ Complexity

| Operation | Complexity   |
| --------- | ------------ |
| `get()`   | O(1) average |
| `put()`   | O(1) average |
| Space     | O(capacity)  |

Both `get()` and `put()` operate on a fixed number of nodes and do not require traversing the linked list.

The `keys()` helper walks through the list and is used only for testing and displaying the cache order in the example.

### 📥 Installation

Node.js 18 or newer is required.

There are no external runtime dependencies.

Install the project dependencies:

```bash
npm install
```

### 🧪 Run Tests

Run the complete test suite with:

```bash
npm test
```

The tests cover:

* Basic `put()` and `get()`
* Missing keys
* Recency changes after `get()`
* LRU eviction
* Updating an existing key
* Recency changes after updating a key
* Capacity of `1`
* Invalid capacity

### ▶️ Run Example

Run the example program with:

```bash
npm run example
```

The example demonstrates inserting, retrieving, updating, and evicting cache entries.

### 💡 Example Usage

```javascript
const { LRUCache } = require("./src/lru-cache");

const cache = new LRUCache(2);

cache.put("A", 10);
cache.put("B", 20);

cache.get("A"); // 10
cache.put("C", 30); // B is evicted

cache.get("B"); // -1
cache.get("C"); // 30
cache.get("A"); // 10

```

The sequence works as follows:

```text
PUT A=10
Cache: [A]

PUT B=20
Cache: [B, A]

GET A → 10
Cache: [A, B]

PUT C=30
B is evicted
Cache: [C, A]

GET B → -1
GET C → 30
GET A → 10
```

### 📂 Project Structure

```text
lru-cache/
├── src/
│   └── lru-cache.js
├── tests/
│   └── lru-cache.test.js
├── example/
│   └── run-example.js
├── package.json
└── README.md
```

