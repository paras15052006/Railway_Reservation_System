const router = require("express").Router();
const db = require("../db");

// GET /api/stations -> all stations (for dropdowns)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM station ORDER BY station_name");
    res.json(rows);
  } catch (err) {
    console.error("Stations error:", err);
    res.status(500).json({ error: "Could not load stations." });
  }
});

module.exports = router;