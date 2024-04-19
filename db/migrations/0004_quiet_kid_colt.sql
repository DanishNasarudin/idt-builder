CREATE TABLE `simple_products` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`category` varchar(200),
	`product_list` text,
	CONSTRAINT `simple_products_id` PRIMARY KEY(`id`)
);
