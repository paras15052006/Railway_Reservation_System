import { useState, useEffect } from 'react';
import { getStations, searchTrains, bookTicket } from '../api';

export default function SearchBook({ passenger }) {
  const [stations, setStations] = useState([]);
  const [src, setSrc] = useState('');
  const [dest, setDest] = useState('');
  const [date, setDate] = useState('2026-11-01');
  const [trains, setTrains] = useState([]);
  const [payment, setPayment] = useState('UPI');
  const [message, setMessage] = useState('');

  // load stations once when the page opens
  useEffect(() => { getStations().then(setStations); }, []);

  const search = async () => {
    setMessage('');
    setTrains(await searchTrains(src, dest, date));
  };

  const book = async (schedule_id) => {
    try {
      const r = await bookTicket({
        passenger_id: passenger.passenger_id,
        schedule_id,
        src_station_id: src,
        dest_station_id: dest,
        payment_method: payment,
      });
      setMessage(`✅ Booked! Reservation #${r.reservation_id}, Seat ${r.seat_number}, Paid ₹${r.total_fare}`);
    } catch (err) {
      setMessage('❌ ' + err.message);
    }
  };

  const stationOptions = stations.map((s) => (
    <option key={s.station_id} value={s.station_id}>{s.station_name} ({s.station_code})</option>
  ));

  return (
    <div>
      <div className="row">
        <select value={src} onChange={(e) => setSrc(e.target.value)}>
          <option value="">From</option>{stationOptions}
        </select>
        <select value={dest} onChange={(e) => setDest(e.target.value)}>
          <option value="">To</option>{stationOptions}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={search} disabled={!src || !dest}>Search</button>
      </div>

      {message && <p className="message">{message}</p>}

      {trains.map((t) => (
        <div className="card" key={t.schedule_id}>
          <div>
            <b>{t.train_name}</b> ({t.train_number}) – {t.train_type}<br />
            Departs {t.departure_time} → Arrives {t.arrival_time}
          </div>
          <div>
            <b>₹{t.fare}</b>{' '}
            <select value={payment} onChange={(e) => setPayment(e.target.value)}>
              <option>UPI</option><option>Card</option><option>NetBanking</option>
            </select>{' '}
            <button onClick={() => book(t.schedule_id)}>Book</button>
          </div>
        </div>
      ))}
    </div>
  );
}
