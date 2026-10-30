const router = require("express").Router();
const db = require("../db");

const todayStr = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

// GET /api/trains -> every train with its full route
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT t.train_id, t.train_number, t.train_name, t.train_type,
              s1.station_name AS from_station,
              TIME_FORMAT(f.departure_time, '%H:%i') AS departure_time,
              s2.station_name AS to_station,
              TIME_FORMAT(l.arrival_time, '%H:%i') AS arrival_time
       FROM train t
       JOIN train_halt f ON f.train_id = t.train_id
         AND f.seq_number = (SELECT MIN(seq_number) FROM train_halt WHERE train_id = t.train_id)
       JOIN train_halt l ON l.train_id = t.train_id
         AND l.seq_number = (SELECT MAX(seq_number) FROM train_halt WHERE train_id = t.train_id)
       JOIN station s1 ON s1.station_id = f.station_id
       JOIN station s2 ON s2.station_id = l.station_id
       ORDER BY t.train_number`
    );
    res.json(rows);
  } catch (err) {
    console.error("All trains error:", err);
    res.status(500).json({ error: "Could not load trains." });
  }
});

// GET /api/trains/search?src=1&dest=4&date=2026-11-01
// A train matches if it halts at BOTH stations and the source comes before the destination.
router.get("/search", async (req, res) => {
  const { src, dest, date } = req.query;

  if (!src || !dest || !date) {
    return res.status(400).json({ error: "Source, destination and journey date are required." });
  }
  if (String(src) === String(dest)) {
    return res.status(400).json({ error: "Source and destination must be different." });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(new Date(date).getTime())) {
    return res.status(400).json({ error: "Invalid journey date." });
  }
  if (date < todayStr()) {
    return res.status(400).json({ error: "Journey date cannot be in the past." });
  }

  try {
    const [rows] = await db.query(
      `SELECT s.schedule_id, s.journey_date,
              t.train_number, t.train_name, t.train_type,
              TIME_FORMAT(h1.departure_time, '%H:%i') AS departure_time,
              TIME_FORMAT(h2.arrival_time, '%H:%i') AS arrival_time,
              (h2.seq_number - h1.seq_number) * 100 AS fare
       FROM train_schedule s
       JOIN train t       ON t.train_id = s.train_id
       JOIN train_halt h1 ON h1.train_id = t.train_id AND h1.station_id = ?
       JOIN train_halt h2 ON h2.train_id = t.train_id AND h2.station_id = ?
       WHERE h1.seq_number < h2.seq_number
         AND s.journey_date = ?
       ORDER BY h1.departure_time`,
      [src, dest, date]
    );
    res.json(rows);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error while searching trains." });
  }
});

module.exports = router;