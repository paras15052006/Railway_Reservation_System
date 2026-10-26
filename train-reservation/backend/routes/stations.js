const router = require('express').Router();
const db = require('../db');

// GET /api/stations -> all stations (for dropdowns)
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM station ORDER BY station_name');
  res.json(rows);
});

module.exports = router;
