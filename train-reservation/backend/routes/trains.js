const express = require('express');
const router = express.Router();
const db = require('../db');

const ROUTE_SQL = `
  SELECT
    t.train_id, t.train_number, t.train_name, t.total_seats,
    src.station_id AS source_id, dst.station_id AS destination_id,
    s.station_name AS source_name, d.station_name AS destination_name,
    src.departure_time, dst.arrival_time,
    (dst.distance_km - src.distance_km) AS distance_km,
    ROUND((dst.distance_km - src.distance_km) * t.fare_per_km, 2) AS fare
  FROM trains t
  JOIN train_stops src ON src.train_id = t.train_id AND src.station_id = ?
  JOIN train_stops dst ON dst.train_id = t.train_id AND dst.station_id = ?
  JOIN stations s ON s.station_id = src.station_id
  JOIN stations d ON d.station_id = dst.station_id
  WHERE src.stop_order < dst.stop_order
  ORDER BY src.departure_time
`;

function todayStr() {
  return new Date().toLocaleDateString('en-CA');
}

async function addAvailability(trains, journeyDate) {
  if (!trains.length) return trains;
  try {
    const ids = trains.map(t => t.train_id);
    const [rows] = await db.query(
      `SELECT train_id, COUNT(*) AS booked
         FROM reservations
        WHERE journey_date = ? AND status = 'CONFIRMED' AND train_id IN (?)
        GROUP BY train_id`,
      [journeyDate, ids]
    );
    const booked = Object.fromEntries(rows.map(r => [r.train_id, r.booked]));
    return trains.map(t => ({
      ...t,
      seats_available: Math.max(t.total_seats - (booked[t.train_id] || 0), 0),
    }));
  } catch (err) {
    return trains.map(t => ({ ...t, seats_available: t.total_seats }));
  }
}

// GET /api/trains  -> all trains
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.train_id, t.train_number, t.train_name, t.total_seats,
             s1.station_name AS source_name, f.departure_time,
             s2.station_name AS destination_name, l.arrival_time,
             ROUND((l.distance_km - f.distance_km) * t.fare_per_km, 2) AS fare
        FROM trains t
        JOIN train_stops f ON f.train_id = t.train_id
             AND f.stop_order = (SELECT MIN(stop_order) FROM train_stops WHERE train_id = t.train_id)
        JOIN train_stops l ON l.train_id = t.train_id
             AND l.stop_order = (SELECT MAX(stop_order) FROM train_stops WHERE train_id = t.train_id)
        JOIN stations s1 ON s1.station_id = f.station_id
        JOIN stations s2 ON s2.station_id = l.station_id
       ORDER BY t.train_number`);
    if (!rows.length) {
      return res.json({ success: true, count: 0, trains: [], message: 'No trains available.' });
    }
    res.json({ success: true, count: rows.length, trains: rows });
  } catch (err) {
    console.error('All trains error:', err);
    res.status(500).json({ success: false, message: 'Could not load trains' });
  }
});

// GET /api/trains/search?source=1&destination=3&date=2026-12-01
router.get('/search', async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    if (!source || !destination || !date) {
      return res.status(400).json({ success: false, message: 'Source, destination and journey date are required.' });
    }
    if (String(source) === String(destination)) {
      return res.status(400).json({ success: false, message: 'Source and destination cannot be the same.' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(new Date(date).getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid journey date.' });
    }
    if (date < todayStr()) {
      return res.status(400).json({ success: false, message: 'Journey date cannot be in the past.' });
    }

    const [rows] = await db.query(ROUTE_SQL, [source, destination]);
    const trains = await addAvailability(rows, date);

    if (!trains.length) {
      return res.json({ success: true, count: 0, trains: [], message: 'No trains available for this route on the selected date.' });
    }
    res.json({ success: true, count: trains.length, journeyDate: date, trains });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ success: false, message: 'Server error while searching trains' });
  }
});

module.exports = router;