CREATE TABLE `quotes` (
	`id` varchar(255) NOT NULL,
	`quote_data` json,
	CONSTRAINT `quotes_id` PRIMARY KEY(`id`)
);
