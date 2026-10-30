import { useState, useEffect } from "react";
import { getStations, searchTrains, bookTicket, getAllTrains } from "../api";
import "./SearchBook.css";

const today = new Date().toLocaleDateString("en-CA");

export default function SearchBook({ passenger }) {
  const [stations, setStations] = useState([]);
  const [src, setSrc] = useState("");
  const [dest, setDest] = useState("");
  const [date, setDate] = useState("2026-11-01");
  const [trains, setTrains] = useState([]);
  const [payment, setPayment] = useState("UPI");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const [searched, setSearched] = useState(false);
  const [allTrains, setAllTrains] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    getStations()
      .then(setStations)
      .catch(() => setMessage("Unable to load stations. Please refresh."));
  }, []);

  const search = async () => {
    if (!src || !dest || !date) {
      setMessage("Please select your source, destination and journey date.");
      return;
    }

    if (src === dest) {
      setMessage("Source and destination must be different.");
      return;
    }

        if (date < today) {
      setMessage("Journey date cannot be in the past.");
      return;
    }

    setLoading(true);
    setMessage("");
    setBookingId(null);

        try {
      const results = await searchTrains(src, dest, date);
      setTrains(results);
      setSearched(true);
    } catch (err) {
      setTrains([]);
      setSearched(false);
      setMessage(err.message || "Unable to search trains. Please try again.");
    } finally {
  };

  const book = async (schedule_id) => {
    setLoading(true);
    setMessage("");

    try {
      const result = await bookTicket({
        passenger_id: passenger.passenger_id,
        schedule_id,
        src_station_id: src,
        dest_station_id: dest,
        payment_method: payment,
      });

      setBookingId(result.reservation_id);
      setMessage(
        `Ticket booked successfully! Seat ${result.seat_number} · ₹${result.total_fare}`,
      );
    } catch (err) {
      setMessage(err.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

    const toggleAllTrains = async () => {
    if (showAll) {
      setShowAll(false);
      return;
    }
    try {
      setAllTrains(await getAllTrains());
      setShowAll(true);
    } catch (err) {
      setMessage(err.message || "Unable to load trains.");
    }
  };


  const stationOptions = stations.map((station) => (
    <option key={station.station_id} value={station.station_id}>
      {station.station_name} ({station.station_code})
    </option>
  ));

  return (
    <div className="railway-page">
      <section className="railway-hero">
        <div className="hero-content">
          <span className="hero-tag">YOUR JOURNEY STARTS HERE</span>
          <h2>Where would you like to go?</h2>
          <p>Discover trains, plan your journey and book your next trip.</p>
        </div>
        <div className="hero-train" aria-hidden="true">
          🚆
        </div>
      </section>

      <section className="journey-panel">
        <div className="section-heading">
          <div className="heading-icon">↗</div>
          <div>
            <h3>Plan your journey</h3>
            <p>Choose your route and preferred travel date.</p>
          </div>
        </div>

        <div className="journey-form">
          <label className="field-group">
            <span>FROM</span>
            <div className="field-control">
              <span className="field-icon">⌖</span>
              <select value={src} onChange={(e) => setSrc(e.target.value)}>
                <option value="">Select source</option>
                {stationOptions}
              </select>
            </div>
          </label>

          <div className="route-connector" aria-hidden="true">
            →
          </div>

          <label className="field-group">
            <span>TO</span>
            <div className="field-control">
              <span className="field-icon">⌖</span>
              <select value={dest} onChange={(e) => setDest(e.target.value)}>
                <option value="">Select destination</option>
                {stationOptions}
              </select>
            </div>
          </label>

          <label className="field-group">
            <span>JOURNEY DATE</span>
            <div className="field-control">
              <span className="field-icon">▦</span>
              <input
                type="date"
                 min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </label>

          <button
            className="search-trains-btn"
            onClick={search}
            disabled={loading}
          >
            {loading ? "Please wait..." : "⌕  Search Trains"}
          </button>
        </div>

              <button
          type="button"
          onClick={toggleAllTrains}
          style={{ marginTop: "12px" }}
        >
          {showAll ? "Hide all trains" : "Show all trains"}
        </button>


      </section>

      {message && (
        <div
          className={`booking-alert ${bookingId ? "alert-success" : "alert-info"}`}
          role="status"
        >
          <span>{bookingId ? "✓" : "ℹ"}</span>
          <div>
            {message}
            {bookingId && (
              <p>Reservation ID: #{bookingId}. View it in My Bookings.</p>
            )}
          </div>
        </div>
      )}

            {showAll && (
        <section className="train-results">
          <div className="results-heading">
            <div>
              <h3>All trains</h3>
              <p>{allTrains.length} trains in the system</p>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th align="left">Train No.</th>
                <th align="left">Name</th>
                <th align="left">Type</th>
                <th align="left">From</th>
                <th align="left">Departs</th>
                <th align="left">To</th>
                <th align="left">Arrives</th>
              </tr>
            </thead>
            <tbody>
              {allTrains.map((t) => (
                <tr key={t.train_id}>
                  <td>{t.train_number}</td>
                  <td>{t.train_name}</td>
                  <td>{t.train_type}</td>
                  <td>{t.from_station}</td>
                  <td>{t.departure_time}</td>
                  <td>{t.to_station}</td>
                  <td>{t.arrival_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}


      <section className="train-results">
        <div className="results-heading">
          <div>
            <h3>Available trains</h3>
            <p>
              {trains.length > 0
                ? `${trains.length} train${trains.length === 1 ? "" : "s"} found for your journey`
                : "Choose your route to explore available trains."}
            </p>
          </div>
          {trains.length > 0 && (
            <span className="results-count">{trains.length} found</span>
          )}
        </div>

       {!loading && !searched && trains.length === 0 && !message && (
          <div className="empty-trains">
            <div className="empty-train-icon">🚉</div>
            <h3>Ready for your next journey?</h3>
            <p>Enter your source, destination and date to find your train.</p>
          </div>
        )}

        {!loading && searched && trains.length === 0 && !message && (
          <div className="empty-trains">
            <div className="empty-train-icon">🚉</div>
            <h3>No trains available</h3>
            <p>No trains run on this route for the selected date. Try another date or route.</p>
          </div>
        )}

        {trains.map((train) => (
          <article className="train-card" key={train.schedule_id}>
            <div className="train-card-top">
              <div className="train-identity">
                <div className="train-icon">🚆</div>
                <div>
                  <h4>{train.train_name}</h4>
                  <p>
                    Train No. {train.train_number}
                    {train.train_type ? ` · ${train.train_type}` : ""}
                  </p>
                </div>
              </div>
              <span className="train-status">
                <span className="status-dot" />
                Available
              </span>
            </div>

            <div className="train-route">
              <div className="route-point">
                <span className="route-time">{train.departure_time}</span>
                <span className="route-label">Departure</span>
                <span className="route-station">
                  {stations.find((s) => String(s.station_id) === String(src))
                    ?.station_code || "Source"}
                </span>
              </div>

              <div className="route-line">
                <span />
                <small>JOURNEY</small>
                <span />
              </div>

              <div className="route-point route-destination">
                <span className="route-time">{train.arrival_time}</span>
                <span className="route-label">Arrival</span>
                <span className="route-station">
                  {stations.find((s) => String(s.station_id) === String(dest))
                    ?.station_code || "Destination"}
                </span>
              </div>
            </div>

            <div className="train-card-bottom">
              <div className="fare-block">
                <span>Ticket fare</span>
                <strong>₹{Number(train.fare).toFixed(2)}</strong>
                <small>per passenger</small>
              </div>

              <div className="booking-actions">
                <label className="payment-field">
                  <span>Payment method</span>
                  <select
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                  >
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="NetBanking">Net Banking</option>
                  </select>
                </label>

                <button
                  className="book-ticket-btn"
                  onClick={() => book(train.schedule_id)}
                  disabled={loading}
                >
                  {loading ? "Please wait..." : "Book Ticket →"}
                </button>
              </div>
            </div>
          </article>
        ))}

        {loading && (
          <div className="loading-message">Finding your next train...</div>
        )}
      </section>
    </div>
  );
}
}