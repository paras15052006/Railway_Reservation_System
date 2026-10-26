const router = require('express').Router();
const db = require('../db');

// POST /api/passengers -> register a passenger
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, gender, DOB } = req.body;

    // calculate age from date of birth
    const age = new Date().getFullYear() - new Date(DOB).getFullYear();

    const [result] = await db.query(
      'INSERT INTO passenger (name, email, phone, gender, DOB, age) VALUES (?,?,?,?,?,?)',
      [name, email, phone, gender, DOB, age]
    );
    res.json({ passenger_id: result.insertId, name });
  } catch (err) {
    res.status(400).json({ error: 'Could not register (email may already exist)' });
  }
});

// POST /api/passengers/login -> find passenger by email
router.post('/login', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM passenger WHERE email = ?', [req.body.email]);
  if (rows.length === 0) return res.status(404).json({ error: 'Passenger not found' });
  res.json(rows[0]);
});

module.exports = router;
