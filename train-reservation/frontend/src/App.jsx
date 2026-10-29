import { useState } from "react";
import Auth from "./components/Auth";
import SearchBook from "./components/SearchBook";
import MyBookings from "./components/MyBookings";

export default function App() {
  const [passenger, setPassenger] = useState(null); // logged-in passenger
  const [tab, setTab] = useState("book");

  // Not logged in -> show register / login page
  if (!passenger) return <Auth onLogin={setPassenger} />;

  return (
    <div className="container">
      <header>
        <h1>🚆 Train Reservation</h1>
        <span>
          Hello, {passenger.name}{" "}
          <button onClick={() => setPassenger(null)}>Logout</button>
        </span>
      </header>

      <nav>
        <button
          className={tab === "book" ? "active" : ""}
          onClick={() => setTab("book")}
        >
          Search & Book
        </button>
        <button
          className={tab === "mine" ? "active" : ""}
          onClick={() => setTab("mine")}
        >
          My Bookings
        </button>
      </nav>

      {tab === "book" ? (
        <SearchBook passenger={passenger} />
      ) : (
        <MyBookings passenger={passenger} />
      )}
    </div>
  );
}
