'use strict';

class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new RangeError('Capacity must be a positive integer.');
    }

    this.capacity = capacity;
    this.map = new Map();

    this.head = new Node(null, null);
    this.tail = new Node(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    const node = this.map.get(key);

    if (node === undefined) {
      return -1;
    }

    this.moveToFront(node);
    return node.value;
  }

  put(key, value) {
    const node = this.map.get(key);

    if (node !== undefined) {
      node.value = value;
      this.moveToFront(node);
      return;
    }

    const newNode = new Node(key, value);
    this.map.set(key, newNode);
    this.addToFront(newNode);

    if (this.map.size > this.capacity) {
      this.removeLeastRecentlyUsed();
    }
  }

  keys() {
    const keys = [];
    let current = this.head.next;

    while (current !== this.tail) {
      keys.push(current.key);
      current = current.next;
    }

    return keys;
  }

  addToFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    node.prev = null;
    node.next = null;
  }

  moveToFront(node) {
    this.removeNode(node);
    this.addToFront(node);
  }

  removeLeastRecentlyUsed() {
    const lru = this.tail.prev;
    this.removeNode(lru);
    this.map.delete(lru.key);
  }
}

module.exports = { LRUCache, Node };
