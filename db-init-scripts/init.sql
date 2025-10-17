-- Создание таблицы пользователей
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL,
    pass VARCHAR(255) NOT NULL,
    user_schema VARCHAR(255) NOT NULL
);

-- Создание схем
CREATE SCHEMA client1;
CREATE SCHEMA client2;
CREATE SCHEMA client3;

-- Создание таблицы sales в схеме client1
CREATE TABLE client1.sales (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    sale_date DATE NOT NULL
);

-- Создание таблицы sales в схеме client2
CREATE TABLE client2.sales (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    sale_date DATE NOT NULL
);

-- Создание таблицы sales в схеме client3
CREATE TABLE client3.sales (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    sale_date DATE NOT NULL
);

-- Вставка тестовых данных в таблицу users
INSERT INTO users (login, pass, user_schema) VALUES
('client1_user', 'hashed_password_1', 'client1'),
('client2_user', 'hashed_password_2', 'client2'),
('client3_user', 'hashed_password_3', 'client3');

-- Вставка тестовых данных в таблицу client1.sales
INSERT INTO client1.sales (product_name, quantity, price, sale_date) VALUES
('Product A', 10, 100.00, '2023-01-15'),
('Product B', 5, 250.00, '2023-01-16'),
('Product C', 2, 500.00, '2023-01-17');

-- Вставка тестовых данных в таблицу client2.sales
INSERT INTO client2.sales (product_name, quantity, price, sale_date) VALUES
('Product X', 8, 120.00, '2023-01-15'),
('Product Y', 12, 80.00, '2023-01-16'),
('Product Z', 3, 300.00, '2023-01-17');

-- Вставка тестовых данных в таблицу client3.sales
INSERT INTO client3.sales (product_name, quantity, price, sale_date) VALUES
('Product M', 15, 90.00, '2023-01-15'),
('Product N', 7, 180.00, '2023-01-16'),
('Product P', 4, 400.00, '2023-01-17');