import { useState } from "react";
import { register, login } from "../api";
import "./Auth.css";

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    DOB: "",
  });
  const [error, setError] = useState("");

  // update one field of the form
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const p = await register(form);
        onLogin({ ...form, ...p });
      } else {
        onLogin(await login(form.email));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-brand">🚆 Train Reservation</h1>
        <h2 className="auth-title">
          {isRegister ? "Create your account" : "Welcome back, please login"}
        </h2>
        <form className="auth-form" onSubmit={submit}>
          {isRegister && (
            <input
              name="name"
              placeholder="Full name"
              onChange={change}
              required
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={change}
            required
          />
          {isRegister && (
            <>
              <input
                name="phone"
                placeholder="Phone"
                onChange={change}
                required
              />
              <select name="gender" onChange={change}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <input name="DOB" type="date" onChange={change} required />
            </>
          )}
          <button className="auth-btn" type="submit">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        {error && <p className="auth-error">{error}</p>}
        <p
          className="auth-link"
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
          }}
        >
          {isRegister ? "Already have an account? Login" : "New here? Register"}
        </p>
      </div>
    </div>
  );
}
