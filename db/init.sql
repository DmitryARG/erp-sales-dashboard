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