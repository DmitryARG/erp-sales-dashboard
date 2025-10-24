-- Создание схем
CREATE SCHEMA IF NOT EXISTS company1;
CREATE SCHEMA IF NOT EXISTS company2;
CREATE SCHEMA IF NOT EXISTS company3;

-- Создание таблицы users в базе erp
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    login VARCHAR UNIQUE,
    pass VARCHAR,
    user_schemas TEXT[]
);

-- Вставка тестовых данных в таблицу users
INSERT INTO users (login, pass, user_schemas) VALUES
('user1', 'pass1pass', ARRAY['company1', 'company2']),
('user2', 'pass2pass', ARRAY['company2', 'company3']),
('user3', 'pass3pass', ARRAY['company1', 'company3']);

-- Создание таблицы sales в схеме company1
CREATE TABLE company1.sales (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR,
    quantity INTEGER,
    price NUMERIC,
    sale_date DATE
);

-- Вставка тестовых данных в таблицу company1.sales
INSERT INTO company1.sales (product_name, quantity, price, sale_date) VALUES
('Product A', 10, 15.50, '2023-01-01'),
('Product B', 5, 20.00, '2023-01-02'),
('Product C', 8, 12.75, '2023-01-03'),
('Product D', 3, 30.00, '2023-01-04'),
('Product E', 12, 8.99, '2023-01-05'),
('Product F', 7, 25.50, '2023-01-06'),
('Product G', 4, 18.00, '2023-01-07'),
('Product H', 9, 14.25, '2023-01-08');

-- Создание таблицы mart_incoming_goods в схеме company1
CREATE TABLE company1.mart_incoming_goods (
    incoming_good_key integer,
    incoming_code     text,
    date_key          timestamp,
    warehouse_key     integer,
    product_key       integer,
    quantity          integer,
    status            text,
    creation_date     timestamp,
    shipment_type     text,
    marketplace_key   integer
);

-- Вставка тестовых данных в таблицу company1.mart_incoming_goods
INSERT INTO company1.mart_incoming_goods (incoming_good_key, incoming_code, date_key, warehouse_key, product_key, quantity, status, creation_date, shipment_type, marketplace_key) VALUES
(1, 'INC001', '2023-01-01 10:00:00', 1, 101, 100, 'Received', '2023-01-01 09:00:00', 'Air', 1),
(2, 'INC002', '2023-01-02 11:00:00', 2, 102, 50, 'Pending', '2023-01-02 10:00:00', 'Sea', 2),
(3, 'INC003', '2023-01-03 12:00:00', 1, 103, 75, 'In Transit', '2023-01-03 11:00:00', 'Ground', 1),
(4, 'INC004', '2023-01-04 13:00:00', 3, 104, 200, 'Delivered', '2023-01-04 12:00:00', 'Air', 3),
(5, 'INC005', '2023-01-05 14:00:00', 2, 105, 30, 'Cancelled', '2023-01-05 13:00:00', 'Sea', 2),
(6, 'INC006', '2023-01-06 15:00:00', 1, 106, 120, 'Received', '2023-01-06 14:00:00', 'Ground', 1);

-- Создание таблицы sales в схеме company2
CREATE TABLE company2.sales (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR,
    quantity INTEGER,
    price NUMERIC,
    sale_date DATE
);

-- Вставка тестовых данных в таблицу company2.sales
INSERT INTO company2.sales (product_name, quantity, price, sale_date) VALUES
('Item X', 15, 10.00, '2023-02-01'),
('Item Y', 6, 22.50, '2023-02-02'),
('Item Z', 11, 9.99, '2023-02-03'),
('Item W', 2, 45.00, '2023-02-04'),
('Item V', 14, 7.50, '2023-02-05'),
('Item U', 8, 19.99, '2023-02-06'),
('Item T', 5, 16.00, '2023-02-07'),
('Item S', 10, 13.75, '2023-02-08');

-- Создание таблицы mart_incoming_goods в схеме company2
CREATE TABLE company2.mart_incoming_goods (
    incoming_good_key integer,
    incoming_code     text,
    date_key          timestamp,
    warehouse_key     integer,
    product_key       integer,
    quantity          integer,
    status            text,
    creation_date     timestamp,
    shipment_type     text,
    marketplace_key   integer
);

-- Вставка тестовых данных в таблицу company2.mart_incoming_goods
INSERT INTO company2.mart_incoming_goods (incoming_good_key, incoming_code, date_key, warehouse_key, product_key, quantity, status, creation_date, shipment_type, marketplace_key) VALUES
(7, 'INC007', '2023-02-01 10:00:00', 1, 107, 80, 'Received', '2023-02-01 09:00:00', 'Air', 1),
(8, 'INC008', '2023-02-02 11:00:00', 2, 108, 60, 'Pending', '2023-02-02 10:00:00', 'Sea', 2),
(9, 'INC009', '2023-02-03 12:00:00', 1, 109, 90, 'In Transit', '2023-02-03 11:00:00', 'Ground', 1),
(10, 'INC010', '2023-02-04 13:00:00', 3, 110, 150, 'Delivered', '2023-02-04 12:00:00', 'Air', 3),
(11, 'INC011', '2023-02-05 14:00:00', 2, 111, 40, 'Cancelled', '2023-02-05 13:00:00', 'Sea', 2),
(12, 'INC012', '2023-02-06 15:00:00', 1, 112, 110, 'Received', '2023-02-06 14:00:00', 'Ground', 1);

-- Создание таблицы sales в схеме company3
CREATE TABLE company3.sales (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR,
    quantity INTEGER,
    price NUMERIC,
    sale_date DATE
);

-- Вставка тестовых данных в таблицу company3.sales
INSERT INTO company3.sales (product_name, quantity, price, sale_date) VALUES
('Good 1', 20, 5.00, '2023-03-01'),
('Good 2', 7, 28.00, '2023-03-02'),
('Good 3', 13, 11.50, '2023-03-03'),
('Good 4', 1, 50.00, '2023-03-04'),
('Good 5', 16, 6.75, '2023-03-05'),
('Good 6', 9, 21.25, '2023-03-06'),
('Good 7', 3, 17.99, '2023-03-07'),
('Good 8', 12, 12.00, '2023-03-08');

-- Создание таблицы mart_incoming_goods в схеме company3
CREATE TABLE company3.mart_incoming_goods (
    incoming_good_key integer,
    incoming_code     text,
    date_key          timestamp,
    warehouse_key     integer,
    product_key       integer,
    quantity          integer,
    status            text,
    creation_date     timestamp,
    shipment_type     text,
    marketplace_key   integer
);

-- Вставка тестовых данных в таблицу company3.mart_incoming_goods
INSERT INTO company3.mart_incoming_goods (incoming_good_key, incoming_code, date_key, warehouse_key, product_key, quantity, status, creation_date, shipment_type, marketplace_key) VALUES
(13, 'INC013', '2023-03-01 10:00:00', 1, 113, 70, 'Received', '2023-03-01 09:00:00', 'Air', 1),
(14, 'INC014', '2023-03-02 11:00:00', 2, 114, 55, 'Pending', '2023-03-02 10:00:00', 'Sea', 2),
(15, 'INC015', '2023-03-03 12:00:00', 1, 115, 85, 'In Transit', '2023-03-03 11:00:00', 'Ground', 1),
(16, 'INC016', '2023-03-04 13:00:00', 3, 116, 180, 'Delivered', '2023-03-04 12:00:00', 'Air', 3),
(17, 'INC017', '2023-03-05 14:00:00', 2, 117, 35, 'Cancelled', '2023-03-05 13:00:00', 'Sea', 2),
(18, 'INC018', '2023-03-06 15:00:00', 1, 118, 130, 'Received', '2023-03-06 14:00:00', 'Ground', 1);