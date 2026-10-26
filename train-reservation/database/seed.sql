USE train_reservation;

INSERT INTO station (station_name, station_code, city, state) VALUES
('Pune Junction','PUNE','Pune','Maharashtra'),
('Lonavala','LNL','Lonavala','Maharashtra'),
('Kalyan Junction','KYN','Kalyan','Maharashtra'),
('Mumbai CSMT','CSMT','Mumbai','Maharashtra'),
('Surat','ST','Surat','Gujarat');

INSERT INTO train (train_number, train_name, train_type) VALUES
('12123','Deccan Queen','Superfast'),
('12127','Intercity Express','Express');

-- Deccan Queen: Pune -> Lonavala -> Kalyan -> Mumbai
INSERT INTO train_halt (train_id, station_id, seq_number, arrival_time, departure_time, halt_duration) VALUES
(1,1,1,'07:00','07:15',0),
(1,2,2,'08:20','08:25',5),
(1,3,3,'09:30','09:32',2),
(1,4,4,'10:25','10:25',0),
-- Intercity: Pune -> Kalyan -> Mumbai -> Surat
(2,1,1,'06:00','06:10',0),
(2,3,2,'09:00','09:05',5),
(2,4,3,'10:00','10:10',10),
(2,5,4,'14:30','14:30',0);

INSERT INTO train_schedule (train_id, journey_date) VALUES
(1,'2026-11-01'),(1,'2026-11-02'),(2,'2026-11-01'),(2,'2026-11-02');
