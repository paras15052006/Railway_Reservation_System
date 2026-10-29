
USE train_reservation;

-- =====================================================
-- RESET ROUTE DATA
-- WARNING: Back up your database before running this.
-- Existing reservations may reference these tables.
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE train_halt;
TRUNCATE TABLE train_schedule;
TRUNCATE TABLE train;
TRUNCATE TABLE station;

SET FOREIGN_KEY_CHECKS = 1;


-- =====================================================
-- 1. STATIONS
-- =====================================================

INSERT INTO station
(station_name, station_code, city, state)
VALUES
('Pune Junction','PUNE','Pune','Maharashtra'),
('Lonavala','LNL','Lonavala','Maharashtra'),
('Kalyan Junction','KYN','Kalyan','Maharashtra'),
('Mumbai CSMT','CSMT','Mumbai','Maharashtra'),
('Dadar Central','DR','Mumbai','Maharashtra'),
('Thane','TNA','Thane','Maharashtra'),
('Panvel','PNVL','Navi Mumbai','Maharashtra'),
('Nashik Road','NK','Nashik','Maharashtra'),
('Nagpur Junction','NGP','Nagpur','Maharashtra'),
('Solapur','SUR','Solapur','Maharashtra'),
('Kolhapur','KOP','Kolhapur','Maharashtra'),
('Miraj Junction','MRJ','Miraj','Maharashtra'),
('Ahmedabad Junction','ADI','Ahmedabad','Gujarat'),
('Surat','ST','Surat','Gujarat'),
('Vadodara Junction','BRC','Vadodara','Gujarat'),
('Rajkot Junction','RJT','Rajkot','Gujarat'),
('Indore Junction','INDB','Indore','Madhya Pradesh'),
('Bhopal Junction','BPL','Bhopal','Madhya Pradesh'),
('Jaipur Junction','JP','Jaipur','Rajasthan'),
('Udaipur City','UDZ','Udaipur','Rajasthan'),
('New Delhi','NDLS','New Delhi','Delhi'),
('Agra Cantt','AGC','Agra','Uttar Pradesh'),
('Lucknow NR','LKO','Lucknow','Uttar Pradesh'),
('Howrah Junction','HWH','Kolkata','West Bengal'),
('Bengaluru City','SBC','Bengaluru','Karnataka'),
('Chennai Central','MAS','Chennai','Tamil Nadu'),
('Hyderabad Deccan','HYB','Hyderabad','Telangana'),
('Goa Madgaon','MAO','Madgaon','Goa');


-- =====================================================
-- 2. TRAINS
-- =====================================================

INSERT INTO train
(train_number, train_name, train_type)
VALUES
('12123','Deccan Queen','Superfast'),
('12127','Intercity Express','Express'),
('11007','Deccan Express','Express'),
('12125','Pragati Express','Superfast'),
('12009','Shatabdi Express','Shatabdi'),
('12951','Mumbai Rajdhani Express','Rajdhani'),
('12901','Gujarat Mail','Express'),
('19019','Dehradun Express','Express'),
('12809','Howrah Mail','Superfast'),
('12627','Karnataka Express','Superfast'),
('12027','Shatabdi Express','Shatabdi'),
('12295','Sanghamitra Express','Superfast'),
('22105','Indrayani Express','Express'),
('11029','Koyna Express','Express'),
('10103','Mandovi Express','Express');


-- =====================================================
-- 3. TRAIN HALTS
-- All inserts explicitly name their columns.
-- =====================================================

-- Train 1: Pune -> Lonavala -> Kalyan -> Dadar -> Mumbai
INSERT INTO train_halt
(train_id, station_id, seq_number, arrival_time, departure_time, halt_duration)
VALUES
(1,1,1,'07:00','07:15',0),
(1,2,2,'08:20','08:25',5),
(1,3,3,'09:20','09:22',2),
(1,5,4,'09:50','09:52',2),
(1,4,5,'10:10','10:10',0);

-- Train 2: Pune -> Kalyan -> Mumbai -> Surat
INSERT INTO train_halt
(train_id, station_id, seq_number, arrival_time, departure_time, halt_duration)
VALUES
(2,1,1,'06:00','06:10',0),
(2,3,2,'09:00','09:05',5),
(2,4,3,'10:00','10:10',10),
(2,14,4,'14:30','14:30',0);

-- Train 3: Mumbai -> Dadar -> Thane -> Kalyan -> Lonavala -> Pune
INSERT INTO train_halt
(train_id, station_id, seq_number, arrival_time, departure_time, halt_duration)
VALUES
(3,4,1,'07:00','07:10',10),
(3,5,2,'07:20','07:22',2),
(3,6,3,'07:45','07:47',2),
(3,3,4,'08:10','08:15',5),
(3,2,5,'09:20','09:22',2),
(3,1,6,'10:30','10:30',0);

-- Train 4: Pune -> Lonavala -> Kalyan -> Mumbai
INSERT INTO train_halt
(train_id, station_id, seq_number, arrival_time, departure_time, halt_duration)
VALUES
(4,1,1,'16:00','16:10',0),
(4,2,2,'17:15','17:20',5),
(4,3,3,'18:10','18:12',2),
(4,4,4,'19:00','19:00',0);

-- Train 5: Mumbai -> Surat -> Vadodara -> Ahmedabad
INSERT INTO train_halt
(train_id, station_id, seq_number, arrival_time, departure_time, halt_duration)
VALUES
(5,4,1,'06:00','06:10',0),
(5,14,2,'09:00','09:05',5),
(5,15,3,'10:30','10:35',5),
(5,13,4,'12:00','12:00',0);

-- Train 6: Mumbai -> Vadodara -> Ahmedabad -> Jaipur -> Delhi
INSERT INTO train_halt
(train_id, station_id, seq_number, arrival_time, departure_time, halt_duration)
VALUES
(6,4,1,'16:00','16:20',0),
(6,15,2,'21:00','21:05',5),
(6,13,3,'22:30','22:35',5),
(6,19,4,'05:30','05:35',5),
(6,21,5,'08:00','08:00',0);

-- Train 7: Mumbai -> Surat -> Vadodara -> Ahmedabad
INSERT INTO train_halt
(train_id, station_id, seq_number, arrival_time, departure_time, halt_duration)
VALUES
(7,4,1,'22:00','22:10',0),
(7,14,2,'02:00','02:05',5),
(7,15,3,'04:00','04:05',5),
(7,13,4,'06:00','06:00',0);

-- Train 8: Mumbai -> Vadodara -> Delhi
INSERT INTO train_halt
(train_id, station_id, seq_number, arrival_time, departure_time, halt_duration)
VALUES
(8,4,1,'22:30','22:45',0),
(8,15,2,'04:00','04:05',5),
(8,21,3,'12:00','12:00',0);

-- Train 9: Mumbai -> Nagpur -> Bhopal -> Agra -> Delhi
INSERT INTO train_halt
(train_id, station_id, seq_number, arrival_time, departure_time, halt_duration)
VALUES
(9,4,1,'21:00','21:15',0),
(9,9,2,'08:00','08:10',10),
(9,18,3,'14:00','14:05',5),
(9,22,4,'21:00','21:05',5),
(9,21,5,'23:30','23:30',0);

-- Train 10: Delhi -> Agra -> Bhopal -> Nagpur -> Bengaluru
INSERT INTO train_halt
(train_id, station_id, seq_number, arrival_time, departure_time, halt_duration)
VALUES
(10,21,1,'20:00','20:20',0),
(10,22,2,'23:00','23:05',5),
(10,18,3,'07:00','07:10',10),
(10,9,4,'14:00','14:10',10),
(10,25,5,'10:00','10:00',0);

-- Train 11: Mumbai -> Kalyan -> Lonavala -> Pune
INSERT INTO train_halt
(train_id, station_id, seq_number, arrival_time, departure_time, halt_duration)
VALUES
(11,4,1,'06:00','06:10',0),
(11,3,2,'07:30','07:32',2),
(11,2,3,'08:10','08:12',2),
(11,1,4,'09:30','09:30',0);

-- Train 12: Pune -> Solapur -> Hyderabad
INSERT INTO train_halt
(train_id, station_id, seq_number, arrival_time, departure_time, halt_duration)
VALUES
(12,1,1,'18:00','18:15',0),
(12,10,2,'22:00','22:10',10),
(12,27,3,'05:30','05:30',0);

-- Train 13: Mumbai -> Thane -> Kalyan -> Pune
INSERT INTO train_halt
(train_id, station_id, seq_number, arrival_time, departure_time, halt_duration)
VALUES
(13,4,1,'05:45','05:55',0),
(13,6,2,'06:20','06:22',2),
(13,3,3,'06:45','06:47',2),
(13,1,4,'09:00','09:00',0);

-- Train 14: Mumbai -> Pune -> Miraj -> Kolhapur
INSERT INTO train_halt
(train_id, station_id, seq_number, arrival_time, departure_time, halt_duration)
VALUES
(14,4,1,'08:00','08:10',0),
(14,1,2,'11:30','11:40',10),
(14,12,3,'16:00','16:05',5),
(14,11,4,'17:00','17:00',0);

-- Train 15: Mumbai -> Pune -> Goa
-- Simplified illustrative demo route.
INSERT INTO train_halt
(train_id, station_id, seq_number, arrival_time, departure_time, halt_duration)
VALUES
(15,4,1,'07:00','07:10',0),
(15,1,2,'11:30','11:40',10),
(15,28,3,'17:00','17:00',0);


-- =====================================================
-- 4. TRAIN SCHEDULES
-- Every train has a schedule from November 1–7, 2026.
-- =====================================================

INSERT INTO train_schedule (train_id, journey_date)
WITH RECURSIVE dates AS (
    SELECT DATE('2026-11-01') AS journey_date
    UNION ALL
    SELECT DATE_ADD(journey_date, INTERVAL 1 DAY)
    FROM dates
    WHERE journey_date < '2026-11-07'
)
SELECT t.train_id, dates.journey_date
FROM train t
CROSS JOIN dates;


-- =====================================================
-- 5. VERIFY INSERTED DATA
-- =====================================================

SELECT COUNT(*) AS total_stations FROM station;
SELECT COUNT(*) AS total_trains FROM train;
SELECT COUNT(*) AS total_halts FROM train_halt;
SELECT COUNT(*) AS total_schedules FROM train_schedule;

-- Show all routes in sequence
SELECT
    t.train_number,
    t.train_name,
    st.station_name,
    th.seq_number,
    th.arrival_time,
    th.departure_time,
    th.halt_duration
FROM train_halt th
JOIN train t ON t.train_id = th.train_id
JOIN station st ON st.station_id = th.station_id
ORDER BY t.train_id, th.seq_number;
