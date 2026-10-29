import { useState, useEffect } from "react";
import { getBookings, cancelTicket } from "../api";

export default function MyBookings({ passenger }) {
  const [bookings, setBookings] = useState([]);

  const load = () => getBookings(passenger.passenger_id).then(setBookings);
  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    const reason = prompt("Reason for cancellation?");
    if (reason === null) return;
    const r = await cancelTicket(id, reason);
    alert(`Cancelled. Refund: ₹${r.refund_amount}`);
    load(); // refresh the list
  };

  if (bookings.length === 0) return <p>No bookings yet.</p>;

  return (
    <div>
      {bookings.map((b) => (
        <div className="card" key={b.reservation_id}>
          <div>
            <b>
              #{b.reservation_id} {b.train_name}
            </b>{" "}
            ({b.train_number})<br />
            {b.source} → {b.destination} on {b.journey_date.slice(0, 10)}
            <br />
            Seat {b.seat_number} | ₹{b.total_fare} |{" "}
            <span className={b.status === "Confirmed" ? "ok" : "bad"}>
              {b.status}
            </span>
          </div>
          {b.status === "Confirmed" && (
            <button onClick={() => cancel(b.reservation_id)}>Cancel</button>
          )}
        </div>
      ))}
    </div>
  );
}
