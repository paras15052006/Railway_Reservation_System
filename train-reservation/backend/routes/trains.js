const router = require("express").Router();
const db = require("../db");

// GET /api/trains/search?src=1&dest=4&date=2026-11-01
// A train matches if it halts at BOTH stations, source comes before destination.
router.get("/search", async (req, res) => {
  const { src, dest, date } = req.query;

  const [rows] = await db.query(
    `SELECT s.schedule_id, s.journey_date,
            t.train_number, t.train_name, t.train_type,
            h1.departure_time, h2.arrival_time,
            (h2.seq_number - h1.seq_number) * 100 AS fare
     FROM train_schedule s
     JOIN train t       ON t.train_id = s.train_id
     JOIN train_halt h1 ON h1.train_id = t.train_id AND h1.station_id = ?
     JOIN train_halt h2 ON h2.train_id = t.train_id AND h2.station_id = ?
     WHERE h1.seq_number < h2.seq_number
       AND s.journey_date = ?`,
    [src, dest, date],
  );
  res.json(rows);
});

module.exports = router;
