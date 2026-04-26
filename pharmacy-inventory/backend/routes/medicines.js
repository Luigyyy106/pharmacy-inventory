const express = require('express');
const router = express.Router();
const db = require('../config/db');
const dsa = require('../algorithms/dsa');

// ─── GET ALL MEDICINES (with optional sort & search) ──────────────────
router.get('/', async (req, res) => {
  try {
    const {
      sortBy = 'name', order = 'asc', algorithm = 'quick',
      search, searchAlgo = 'linear', category
    } = req.query;

    let query = 'SELECT * FROM medicines';
    const params = [];
    if (category && category !== 'all') {
      query += ' WHERE category = ?';
      params.push(category);
    }

    const [rows] = await db.execute(query, params);

    const validKey = ['name','price','quantity','expiry_date','category','brand'].includes(sortBy) ? sortBy : 'name';
    let sorted;
    switch (algorithm) {
      case 'bubble':    sorted = dsa.bubbleSort(rows, validKey, order);    break;
      case 'selection': sorted = dsa.selectionSort(rows, validKey, order); break;
      case 'insertion': sorted = dsa.insertionSort(rows, validKey, order); break;
      case 'merge':     sorted = dsa.mergeSort(rows, validKey, order);     break;
      case 'heap':      sorted = dsa.heapSort(rows, validKey, order);      break;
      default:          sorted = dsa.quickSort(rows, validKey, order);
    }

    let result = sorted;
    if (search && search.trim()) {
      if (searchAlgo === 'binary') {
        const sortedByName = dsa.quickSort(sorted, 'name', 'asc');
        result = dsa.binarySearch(sortedByName, search, 'name');
      } else {
        result = dsa.linearSearch(sorted, search);
      }
    }

    res.json({ success: true, count: result.length, data: result, algorithm, sortBy, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ─── GET SINGLE MEDICINE ──────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM medicines WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Medicine not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── CREATE MEDICINE ──────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const {
      name, generic_name, category, brand, dosage, unit,
      quantity, reorder_level, price, expiry_date, supplier, description
    } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, category, and price are required' });
    }

    // PostgreSQL: use RETURNING id instead of insertId
    const [rows] = await db.execute(
      `INSERT INTO medicines
         (name, generic_name, category, brand, dosage, unit, quantity, reorder_level, price, expiry_date, supplier, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING id`,
      [name, generic_name, category, brand, dosage, unit || 'tablet',
       quantity || 0, reorder_level || 10, price, expiry_date || null, supplier, description]
    );

    const newId = rows[0].id;

    if (quantity > 0) {
      await db.execute(
        `INSERT INTO transactions (medicine_id, type, quantity, note) VALUES (?, 'stock_in', ?, 'Initial stock on creation')`,
        [newId, quantity]
      );
    }

    res.status(201).json({ success: true, message: 'Medicine added successfully', id: newId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── UPDATE MEDICINE ──────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const {
      name, generic_name, category, brand, dosage, unit,
      quantity, reorder_level, price, expiry_date, supplier, description
    } = req.body;

    await db.execute(
      `UPDATE medicines
       SET name=?, generic_name=?, category=?, brand=?, dosage=?, unit=?,
           quantity=?, reorder_level=?, price=?, expiry_date=?, supplier=?, description=?
       WHERE id=?`,
      [name, generic_name, category, brand, dosage, unit,
       quantity, reorder_level, price, expiry_date || null, supplier, description, req.params.id]
    );

    res.json({ success: true, message: 'Medicine updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE MEDICINE ──────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM medicines WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Medicine deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── STOCK ADJUSTMENT ─────────────────────────────────────────────────
router.post('/:id/stock', async (req, res) => {
  try {
    const { type, quantity, note } = req.body;
    const [rows] = await db.execute('SELECT * FROM medicines WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Medicine not found' });

    const medicine = rows[0];
    let newQty = medicine.quantity;

    if (type === 'stock_in') {
      newQty += parseInt(quantity);
    } else if (type === 'stock_out') {
      if (medicine.quantity < quantity)
        return res.status(400).json({ success: false, message: 'Insufficient stock' });
      newQty -= parseInt(quantity);
    } else if (type === 'adjustment') {
      newQty = parseInt(quantity);
    }

    await db.execute('UPDATE medicines SET quantity = ? WHERE id = ?', [newQty, req.params.id]);
    await db.execute(
      `INSERT INTO transactions (medicine_id, type, quantity, note) VALUES (?, ?, ?, ?)`,
      [req.params.id, type, quantity, note || '']
    );

    res.json({ success: true, message: 'Stock updated', newQuantity: newQty });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DSA STATS & ANALYTICS ───────────────────────────────────────────
router.get('/analytics/stats', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM medicines');
    const stats = dsa.getInventoryStats(rows);
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── EXPIRY PRIORITY QUEUE ────────────────────────────────────────────
router.get('/analytics/expiry-queue', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM medicines WHERE expiry_date IS NOT NULL');
    const sorted = dsa.getExpiryPriorityQueue(rows);
    res.json({ success: true, data: sorted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
