const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT station_id, station_code, station_name, city FROM stations ORDER BY station_name'
    );
    res.json({ success: true, stations: rows });
  } catch (err) {
    console.error('Stations error:', err);
    res.status(500).json({ success: false, message: 'Could not load stations' });
  }
});

module.exports = router;