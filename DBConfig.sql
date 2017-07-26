DROP DATABASE IF EXISTS bamazon;
CREATE DATEBASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	product_name VARCHAR(255) NOT NULL UNIQUE,
	department_name VARCHAR(255) NOT NULL,
	price DECIMAL(10, 2) NOT NULL,
	stock_quantity INT default 0
	);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
('15ft HDMI Cable', 'Electronics', 15.46, 49),
('Wooden Cutting Board', 'Home Goods', 24.99, 21),
('Organic Dog Food - 18lb Bag', 'Pet Supplies', 35.12, 19),
('RGB Backlit LED Mechcanical Keyboard', 'Electronics', 125.18, 4),
('5 Piece Stainless Steel Pan Set', 'Home Goods', 216.74, 64),
('Faux 10 Foot Christmas Tree - REAL TREE FEEL', 'Home Goods', 119.99,),
('Animal Energy - 6PK - 12oz - Eagles Rally', 'Food and Beverage', 16.54, 42),
('Glow-in-the-Dark Cat Collar with Bell', 'Pet Supplies', 11.50, 16),
('Indoor Misquito Eliminator XL', 'Home Goods', 45.84, 64),
('Bigfoot GPS Tracking System', 'Electronics', 845.63, 98);

