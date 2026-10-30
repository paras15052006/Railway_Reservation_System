
CREATE DATABASE IF NOT EXISTS train_reservation;
USE train_reservation;

CREATE TABLE passenger (
  passenger_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(15),
  gender VARCHAR(10),
  DOB DATE,
  age INT,
  CONSTRAINT chk_passenger_age CHECK (age >= 0)
);

CREATE TABLE station (
  station_id INT AUTO_INCREMENT PRIMARY KEY,
  station_name VARCHAR(100) NOT NULL,
  station_code VARCHAR(10) NOT NULL UNIQUE,
  city VARCHAR(50),
  state VARCHAR(50)
);

CREATE TABLE train (
  train_id INT AUTO_INCREMENT PRIMARY KEY,
  train_number VARCHAR(10) NOT NULL UNIQUE,
  train_name VARCHAR(100) NOT NULL,
  train_type VARCHAR(30)
);

CREATE TABLE train_schedule (
  schedule_id INT AUTO_INCREMENT PRIMARY KEY,
  train_id INT NOT NULL,
  journey_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'Scheduled',
  FOREIGN KEY (train_id) REFERENCES train(train_id),
  CONSTRAINT uq_train_journey UNIQUE (train_id, journey_date)
);

CREATE TABLE train_halt (
  halt_id INT AUTO_INCREMENT PRIMARY KEY,
  train_id INT NOT NULL,
  station_id INT NOT NULL,
  seq_number INT NOT NULL,
  arrival_time TIME,
  departure_time TIME,
  halt_duration INT,
  FOREIGN KEY (train_id) REFERENCES train(train_id),
  FOREIGN KEY (station_id) REFERENCES station(station_id)
);

CREATE TABLE reservation (
  reservation_id INT AUTO_INCREMENT PRIMARY KEY,
  passenger_id INT NOT NULL,
  schedule_id INT NOT NULL,
  src_station_id INT NOT NULL,
  dest_station_id INT NOT NULL,
  booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  seat_number INT,
  status VARCHAR(20) DEFAULT 'Confirmed',
  total_fare DECIMAL(10,2),
  FOREIGN KEY (passenger_id) REFERENCES passenger(passenger_id),
  FOREIGN KEY (schedule_id) REFERENCES train_schedule(schedule_id),
  FOREIGN KEY (src_station_id) REFERENCES station(station_id),
  FOREIGN KEY (dest_station_id) REFERENCES station(station_id)
);

CREATE TABLE payment (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  reservation_id INT NOT NULL UNIQUE,
  transaction_id VARCHAR(40) NOT NULL,
  amount DECIMAL(10,2),
  payment_status VARCHAR(20),
  payment_method VARCHAR(20),
  payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_id)
);

CREATE TABLE cancellation (
  cancellation_id INT AUTO_INCREMENT PRIMARY KEY,
  reservation_id INT NOT NULL UNIQUE,
  reason VARCHAR(255),
  refund_amount DECIMAL(10,2),
  FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_id)
);
