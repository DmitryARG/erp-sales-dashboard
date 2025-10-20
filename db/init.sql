-- Создание схем
CREATE SCHEMA IF NOT EXISTS client1;
CREATE SCHEMA IF NOT EXISTS client2;
CREATE SCHEMA IF NOT EXISTS client3;

-- Создание таблицы users в базе erp
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    login VARCHAR UNIQUE,
    pass VARCHAR,
    user_schema VARCHAR
);

-- Вставка тестовых данных в таблицу users
INSERT INTO users (login, pass, user_schema) VALUES
('user1', 'pass1', 'client1'),
('user2', 'pass2', 'client2'),
('user3', 'pass3', 'client3');

-- Создание таблицы sales в схеме client1
CREATE TABLE client1.sales (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR,
    quantity INTEGER,
    price NUMERIC,
    sale_date DATE
);

-- Вставка тестовых данных в таблицу client1.sales
INSERT INTO client1.sales (product_name, quantity, price, sale_date) VALUES
('Product A', 10, 15.50, '2023-01-01'),
('Product B', 5, 20.00, '2023-01-02'),
('Product C', 8, 12.75, '2023-01-03'),
('Product D', 3, 30.00, '2023-01-04'),
('Product E', 12, 8.99, '2023-01-05'),
('Product F', 7, 25.50, '2023-01-06'),
('Product G', 4, 18.00, '2023-01-07'),
('Product H', 9, 14.25, '2023-01-08');

-- Создание таблицы sales в схеме client2
CREATE TABLE client2.sales (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR,
    quantity INTEGER,
    price NUMERIC,
    sale_date DATE
);

-- Вставка тестовых данных в таблицу client2.sales
INSERT INTO client2.sales (product_name, quantity, price, sale_date) VALUES
('Item X', 15, 10.00, '2023-02-01'),
('Item Y', 6, 22.50, '2023-02-02'),
('Item Z', 11, 9.99, '2023-02-03'),
('Item W', 2, 45.00, '2023-02-04'),
('Item V', 14, 7.50, '2023-02-05'),
('Item U', 8, 19.99, '2023-02-06'),
('Item T', 5, 16.00, '2023-02-07'),
('Item S', 10, 13.75, '2023-02-08');

-- Создание таблицы sales в схеме client3
CREATE TABLE client3.sales (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR,
    quantity INTEGER,
    price NUMERIC,
    sale_date DATE
);

-- Вставка тестовых данных в таблицу client3.sales
INSERT INTO client3.sales (product_name, quantity, price, sale_date) VALUES
('Good 1', 20, 5.00, '2023-03-01'),
('Good 2', 7, 28.00, '2023-03-02'),
('Good 3', 13, 11.50, '2023-03-03'),
('Good 4', 1, 50.00, '2023-03-04'),
('Good 5', 16, 6.75, '2023-03-05'),
('Good 6', 9, 21.25, '2023-03-06'),
('Good 7', 3, 17.99, '2023-03-07'),
('Good 8', 12, 12.00, '2023-03-08');