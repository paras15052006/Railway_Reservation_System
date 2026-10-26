import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Any request starting with /api goes to the backend on port 5000
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:5000' } },
});
