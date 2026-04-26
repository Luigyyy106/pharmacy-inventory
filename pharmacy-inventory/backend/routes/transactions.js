const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const [rows] = await db.execute(
      `SELECT t.*, m.name AS medicine_name, m.category
       FROM transactions t
       JOIN medicines m ON t.medicine_id = m.id
       ORDER BY t.created_at DESC
       LIMIT ?`,
      [parseInt(limit)]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET transactions for a specific medicine
router.get('/medicine/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT t.*, m.name AS medicine_name
       FROM transactions t
       JOIN medicines m ON t.medicine_id = m.id
       WHERE t.medicine_id = ?
       ORDER BY t.created_at DESC`,
      [req.params.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
