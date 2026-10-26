# Train Reservation System (React + Node.js/Express + MySQL)

## 1. Database
    mysql -u root -p < database/schema.sql
    mysql -u root -p < database/seed.sql

## 2. Backend  (edit backend/db.js with your MySQL password first)
    cd backend
    npm install
    npm start          # http://localhost:5000

## 3. Frontend
    cd frontend
    npm install
    npm run dev        # http://localhost:5173

## Try it
Register -> Search (Pune -> Mumbai CSMT, date 2026-11-01) -> Book -> My Bookings -> Cancel.

## Folder map
- database/   tables from your ER diagram + sample data
- backend/    server.js, db.js, routes/ (one file per feature)
- frontend/   src/api.js (backend calls), src/components/ (3 screens)
