
const router = require("express").Router();
const db = require("../db");

// Calculate age correctly
function calculateAge(DOB) {
  const [year, month, day] = DOB.split("-").map(Number);

  const today = new Date();

  let age = today.getFullYear() - year;

  const birthdayNotReached =
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day);

  if (birthdayNotReached) {
    age--;
  }

  return age;
}

// POST /api/passengers -> register a passenger
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, gender, DOB } = req.body || {};

    // Check required fields
    if (!name || !email || !DOB) {
      return res.status(400).json({
        error: "Name, email and DOB are required"
      });
    }

    // Validate name
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        error: "Invalid passenger name"
      });
    }

    // Validate email
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        error: "Invalid email address"
      });
    }

    // Validate DOB format
    if (
      typeof DOB !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(DOB)
    ) {
      return res.status(400).json({
        error: "DOB must be in YYYY-MM-DD format"
      });
    }

    // Validate actual calendar date
    const [year, month, day] = DOB.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return res.status(400).json({
        error: "Invalid date of birth"
      });
    }

    // Calculate age
    const age = calculateAge(DOB);

    // Prevent negative age
    if (age < 0) {
      return res.status(400).json({
        error: "Date of birth cannot be in the future"
      });
    }

    // Insert passenger
    const [result] = await db.query(
      `INSERT INTO passenger
       (name, email, phone, gender, DOB, age)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone || null,
        gender || null,
        DOB,
        age
      ]
    );

    res.status(201).json({
      message: "Passenger registered successfully",
      passenger_id: result.insertId,
      name: name.trim(),
      age
    });

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: "Email already registered"
      });
    }

    console.error(err);

    res.status(500).json({
      error: "Internal server error"
    });
  }
});


// POST /api/passengers/login -> find passenger by email
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        error: "Email is required"
      });
    }

    const [rows] = await db.query(
      "SELECT * FROM passenger WHERE email = ?",
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Passenger not found"
      });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Internal server error"
    });
  }
});

module.exports = router;
