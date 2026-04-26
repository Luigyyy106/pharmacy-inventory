const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ─── MIDDLEWARE ──────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── ROUTES ──────────────────────────────────────────────────────────
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/transactions', require('./routes/transactions'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pharmacy Inventory API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── START SERVER ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🏥 Pharmacy Inventory API running on port ${PORT}`);
  console.log(`📡 http://localhost:${PORT}/api/health\n`);
});
