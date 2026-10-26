// MySQL connection pool - change user/password to match your MySQL
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'paras101',
  database: 'train_reservation',
});

module.exports = pool;
