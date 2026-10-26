// All calls to the backend live here, so components stay simple.
async function request(url, method = 'GET', body) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

export const getStations   = () => request('/api/stations');
export const register      = (p) => request('/api/passengers', 'POST', p);
export const login         = (email) => request('/api/passengers/login', 'POST', { email });
export const searchTrains  = (src, dest, date) => request(`/api/trains/search?src=${src}&dest=${dest}&date=${date}`);
export const bookTicket    = (b) => request('/api/reservations', 'POST', b);
export const getBookings   = (id) => request(`/api/reservations/passenger/${id}`);
export const cancelTicket  = (id, reason) => request(`/api/reservations/${id}/cancel`, 'POST', { reason });
