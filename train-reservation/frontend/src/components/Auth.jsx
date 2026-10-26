import { useState } from 'react';
import { register, login } from '../api';

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', gender: 'Male', DOB: '' });
  const [error, setError] = useState('');

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
    <div className="container small">
      <h1>🚆 Train Reservation</h1>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={submit}>
        {isRegister && <input name="name" placeholder="Full name" onChange={change} required />}
        <input name="email" type="email" placeholder="Email" onChange={change} required />
        {isRegister && (
          <>
            <input name="phone" placeholder="Phone" onChange={change} required />
            <select name="gender" onChange={change}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
            <input name="DOB" type="date" onChange={change} required />
          </>
        )}
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p className="link" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
        {isRegister ? 'Already have an account? Login' : 'New here? Register'}
      </p>
    </div>
  );
}
