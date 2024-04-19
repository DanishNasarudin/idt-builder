CREATE TABLE `product` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(200),
	`ori_price` int,
	`dis_price` int,
	CONSTRAINT `product_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_to_category` (
	`product_id` bigint unsigned NOT NULL,
	`category_id` bigint unsigned NOT NULL,
	CONSTRAINT `product_to_category_product_id_category_id_pk` PRIMARY KEY(`product_id`,`category_id`)
);
--> statement-breakpoint
CREATE TABLE `product_category` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(150),
	CONSTRAINT `product_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `product_to_category` ADD CONSTRAINT `product_to_category_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_to_category` ADD CONSTRAINT `product_to_category_category_id_product_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `product_category`(`id`) ON DELETE no action ON UPDATE no action;