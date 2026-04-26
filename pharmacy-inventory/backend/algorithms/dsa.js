/**
 * ============================================
 * DATA STRUCTURES & ALGORITHMS MODULE
 * Pharmacy Inventory Management System
 * ============================================
 */

// ─── SORTING ALGORITHMS ───────────────────────────────────────────────

/**
 * Bubble Sort - O(n²) time, O(1) space
 * Compares adjacent elements and swaps if out of order
 */
function bubbleSort(arr, key, order = 'asc') {
  const result = [...arr];
  const n = result.length;
  let swapped;
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      const a = typeof result[j][key] === 'string'
        ? result[j][key].toLowerCase()
        : result[j][key];
      const b = typeof result[j + 1][key] === 'string'
        ? result[j + 1][key].toLowerCase()
        : result[j + 1][key];
      const shouldSwap = order === 'asc' ? a > b : a < b;
      if (shouldSwap) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return result;
}

/**
 * Selection Sort - O(n²) time, O(1) space
 * Finds minimum element and places it at the beginning
 */
function selectionSort(arr, key, order = 'asc') {
  const result = [...arr];
  const n = result.length;
  for (let i = 0; i < n - 1; i++) {
    let idx = i;
    for (let j = i + 1; j < n; j++) {
      const a = typeof result[j][key] === 'string'
        ? result[j][key].toLowerCase()
        : result[j][key];
      const b = typeof result[idx][key] === 'string'
        ? result[idx][key].toLowerCase()
        : result[idx][key];
      const shouldSelect = order === 'asc' ? a < b : a > b;
      if (shouldSelect) idx = j;
    }
    if (idx !== i) [result[i], result[idx]] = [result[idx], result[i]];
  }
  return result;
}

/**
 * Insertion Sort - O(n²) time, O(1) space
 * Builds sorted array one element at a time
 */
function insertionSort(arr, key, order = 'asc') {
  const result = [...arr];
  const n = result.length;
  for (let i = 1; i < n; i++) {
    const current = result[i];
    let j = i - 1;
    while (j >= 0) {
      const a = typeof result[j][key] === 'string'
        ? result[j][key].toLowerCase()
        : result[j][key];
      const b = typeof current[key] === 'string'
        ? current[key].toLowerCase()
        : current[key];
      const shouldShift = order === 'asc' ? a > b : a < b;
      if (shouldShift) {
        result[j + 1] = result[j];
        j--;
      } else break;
    }
    result[j + 1] = current;
  }
  return result;
}

/**
 * Merge Sort - O(n log n) time, O(n) space
 * Divide and conquer: splits, sorts, and merges
 */
function mergeSort(arr, key, order = 'asc') {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), key, order);
  const right = mergeSort(arr.slice(mid), key, order);
  return merge(left, right, key, order);
}

function merge(left, right, key, order) {
  const result = [];
  let l = 0, r = 0;
  while (l < left.length && r < right.length) {
    const a = typeof left[l][key] === 'string'
      ? left[l][key].toLowerCase()
      : left[l][key];
    const b = typeof right[r][key] === 'string'
      ? right[r][key].toLowerCase()
      : right[r][key];
    const takeLeft = order === 'asc' ? a <= b : a >= b;
    if (takeLeft) result.push(left[l++]);
    else result.push(right[r++]);
  }
  return result.concat(left.slice(l)).concat(right.slice(r));
}

/**
 * Quick Sort - O(n log n) avg, O(n²) worst, O(log n) space
 * Uses pivot to partition array
 */
function quickSort(arr, key, order = 'asc') {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const pivotVal = typeof pivot[key] === 'string'
    ? pivot[key].toLowerCase()
    : pivot[key];
  const left = arr.filter(el => {
    const v = typeof el[key] === 'string' ? el[key].toLowerCase() : el[key];
    return order === 'asc' ? v < pivotVal : v > pivotVal;
  });
  const middle = arr.filter(el => {
    const v = typeof el[key] === 'string' ? el[key].toLowerCase() : el[key];
    return v === pivotVal;
  });
  const right = arr.filter(el => {
    const v = typeof el[key] === 'string' ? el[key].toLowerCase() : el[key];
    return order === 'asc' ? v > pivotVal : v < pivotVal;
  });
  return [...quickSort(left, key, order), ...middle, ...quickSort(right, key, order)];
}

/**
 * Heap Sort - O(n log n) time, O(1) space
 * Uses binary heap structure
 */
function heapSort(arr, key, order = 'asc') {
  const result = [...arr];
  const n = result.length;

  function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    const getVal = idx => {
      const v = arr[idx][key];
      return typeof v === 'string' ? v.toLowerCase() : v;
    };
    if (left < n) {
      const cond = order === 'asc'
        ? getVal(left) > getVal(largest)
        : getVal(left) < getVal(largest);
      if (cond) largest = left;
    }
    if (right < n) {
      const cond = order === 'asc'
        ? getVal(right) > getVal(largest)
        : getVal(right) < getVal(largest);
      if (cond) largest = right;
    }
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(arr, n, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(result, n, i);
  for (let i = n - 1; i > 0; i--) {
    [result[0], result[i]] = [result[i], result[0]];
    heapify(result, i, 0);
  }
  return result;
}

// ─── SEARCHING ALGORITHMS ──────────────────────────────────────────────

/**
 * Linear Search - O(n) time
 * Searches through all elements one by one
 */
function linearSearch(arr, query) {
  query = query.toLowerCase();
  return arr.filter(item =>
    item.name?.toLowerCase().includes(query) ||
    item.generic_name?.toLowerCase().includes(query) ||
    item.category?.toLowerCase().includes(query) ||
    item.brand?.toLowerCase().includes(query) ||
    item.supplier?.toLowerCase().includes(query)
  );
}

/**
 * Binary Search - O(log n) time (requires sorted array)
 * Divides search space in half each iteration
 */
function binarySearch(sortedArr, query, key = 'name') {
  query = query.toLowerCase();
  const results = [];
  // First find exact match via binary search
  let lo = 0, hi = sortedArr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const val = sortedArr[mid][key]?.toLowerCase() || '';
    if (val === query) {
      results.push(sortedArr[mid]);
      // Expand to find duplicates
      let left = mid - 1;
      while (left >= 0 && sortedArr[left][key]?.toLowerCase() === query) {
        results.unshift(sortedArr[left--]);
      }
      let right = mid + 1;
      while (right < sortedArr.length && sortedArr[right][key]?.toLowerCase() === query) {
        results.push(sortedArr[right++]);
      }
      break;
    } else if (val < query) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  // Also include partial matches
  const partialMatches = sortedArr.filter(item =>
    item[key]?.toLowerCase().includes(query) &&
    !results.find(r => r.id === item.id)
  );
  return [...results, ...partialMatches];
}

// ─── DATA STRUCTURE: MIN-HEAP FOR EXPIRY PRIORITY QUEUE ───────────────

class MinHeap {
  constructor() {
    this.heap = [];
  }

  insert(item) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }

  extractMin() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return min;
  }

  _bubbleUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (new Date(this.heap[parent].expiry_date) > new Date(this.heap[idx].expiry_date)) {
        [this.heap[parent], this.heap[idx]] = [this.heap[idx], this.heap[parent]];
        idx = parent;
      } else break;
    }
  }

  _sinkDown(idx) {
    const n = this.heap.length;
    while (true) {
      let smallest = idx;
      const left = 2 * idx + 1, right = 2 * idx + 2;
      if (left < n && new Date(this.heap[left].expiry_date) < new Date(this.heap[smallest].expiry_date))
        smallest = left;
      if (right < n && new Date(this.heap[right].expiry_date) < new Date(this.heap[smallest].expiry_date))
        smallest = right;
      if (smallest !== idx) {
        [this.heap[smallest], this.heap[idx]] = [this.heap[idx], this.heap[smallest]];
        idx = smallest;
      } else break;
    }
  }

  toArray() {
    const sorted = [];
    const copy = new MinHeap();
    copy.heap = [...this.heap];
    while (copy.heap.length > 0) sorted.push(copy.extractMin());
    return sorted;
  }
}

/**
 * Get medicines sorted by expiry date using MinHeap
 */
function getExpiryPriorityQueue(medicines) {
  const heap = new MinHeap();
  medicines.forEach(m => heap.insert(m));
  return heap.toArray();
}

// ─── HASH MAP for O(1) lookup by ID ───────────────────────────────────

function buildHashMap(medicines) {
  const map = {};
  medicines.forEach(m => { map[m.id] = m; });
  return map;
}

// ─── STATISTICS / ANALYTICS ───────────────────────────────────────────

function getInventoryStats(medicines) {
  const totalItems = medicines.length;
  const totalQuantity = medicines.reduce((sum, m) => sum + m.quantity, 0);
  const totalValue = medicines.reduce((sum, m) => sum + (m.price * m.quantity), 0);
  const lowStock = medicines.filter(m => m.quantity <= m.reorder_level);
  const today = new Date();
  const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiringSoon = medicines.filter(m =>
    m.expiry_date && new Date(m.expiry_date) <= in30Days && new Date(m.expiry_date) >= today
  );
  const expired = medicines.filter(m =>
    m.expiry_date && new Date(m.expiry_date) < today
  );

  // Category distribution
  const categoryMap = {};
  medicines.forEach(m => {
    categoryMap[m.category] = (categoryMap[m.category] || 0) + 1;
  });

  return {
    totalItems,
    totalQuantity,
    totalValue: totalValue.toFixed(2),
    lowStockCount: lowStock.length,
    expiringSoonCount: expiringSoon.length,
    expiredCount: expired.length,
    categoryDistribution: categoryMap,
    lowStockItems: lowStock,
    expiringSoonItems: expiringSoon,
    expiredItems: expired
  };
}

// ─── EXPORTS ──────────────────────────────────────────────────────────

module.exports = {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  linearSearch,
  binarySearch,
  getExpiryPriorityQueue,
  buildHashMap,
  getInventoryStats,
  MinHeap
};
