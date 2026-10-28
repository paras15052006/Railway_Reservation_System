const router = require("express").Router();
const db = require("../db");

// POST /api/reservations -> book a ticket + create payment
router.post("/", async (req, res) => {
  const {
    passenger_id,
    schedule_id,
    src_station_id,
    dest_station_id,
    payment_method,
  } = req.body;
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction(); // either everything is saved, or nothing

    // 1. work out the fare (100 per stop travelled)
    const [fareRows] = await conn.query(
      `SELECT (h2.seq_number - h1.seq_number) * 100 AS fare
       FROM train_schedule s
       JOIN train_halt h1 ON h1.train_id = s.train_id AND h1.station_id = ?
       JOIN train_halt h2 ON h2.train_id = s.train_id AND h2.station_id = ?
       WHERE s.schedule_id = ? AND h1.seq_number < h2.seq_number`,
      [src_station_id, dest_station_id, schedule_id],
    );
    if (fareRows.length === 0) throw new Error("Invalid route");
    const fare = fareRows[0].fare;

    // 2. next seat number = confirmed bookings + 1
    const [seatRows] = await conn.query(
      "SELECT COUNT(*) AS taken FROM reservation WHERE schedule_id = ? AND status = 'Confirmed'",
      [schedule_id],
    );
    const seat = seatRows[0].taken + 1;

    // 3. save the reservation
    const [r] = await conn.query(
      `INSERT INTO reservation
        (passenger_id, schedule_id, src_station_id, dest_station_id, seat_number, status, total_fare)
       VALUES (?,?,?,?,?, 'Confirmed', ?)`,
      [passenger_id, schedule_id, src_station_id, dest_station_id, seat, fare],
    );

    // 4. save the payment
    const transactionId = "TXN" + Date.now();
    await conn.query(
      `INSERT INTO payment (reservation_id, transaction_id, amount, payment_status, payment_method)
       VALUES (?,?,?, 'Paid', ?)`,
      [r.insertId, transactionId, fare, payment_method],
    );

    await conn.commit();
    res.json({
      reservation_id: r.insertId,
      seat_number: seat,
      total_fare: fare,
      transaction_id: transactionId,
    });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// GET /api/reservations/passenger/:id -> all bookings of a passenger
router.get("/passenger/:id", async (req, res) => {
  const [rows] = await db.query(
    `SELECT r.reservation_id, r.seat_number, r.status, r.total_fare, r.booking_date,
            t.train_name, t.train_number, s.journey_date,
            src.station_name AS source, dst.station_name AS destination
     FROM reservation r
     JOIN train_schedule s ON s.schedule_id = r.schedule_id
     JOIN train t          ON t.train_id = s.train_id
     JOIN station src      ON src.station_id = r.src_station_id
     JOIN station dst      ON dst.station_id = r.dest_station_id
     WHERE r.passenger_id = ?
     ORDER BY r.booking_date DESC`,
    [req.params.id],
  );
  res.json(rows);
});

// POST /api/reservations/:id/cancel -> cancel + refund 80%
router.post("/:id/cancel", async (req, res) => {
  const id = req.params.id;
  const [rows] = await db.query(
    "SELECT * FROM reservation WHERE reservation_id = ?",
    [id],
  );

  if (rows.length === 0)
    return res.status(404).json({ error: "Reservation not found" });
  if (rows[0].status === "Cancelled")
    return res.status(400).json({ error: "Already cancelled" });

  const refund = rows[0].total_fare * 0.8;

  await db.query(
    "UPDATE reservation SET status = 'Cancelled' WHERE reservation_id = ?",
    [id],
  );
  await db.query(
    "UPDATE payment SET payment_status = 'Refunded' WHERE reservation_id = ?",
    [id],
  );
  await db.query(
    "INSERT INTO cancellation (reservation_id, reason, refund_amount) VALUES (?,?,?)",
    [id, req.body.reason || "Not given", refund],
  );

  res.json({ message: "Cancelled", refund_amount: refund });
});

module.exports = router;
