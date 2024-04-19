DROP TABLE `product_to_category`;--> statement-breakpoint
ALTER TABLE `product` ADD `is_available` boolean;--> statement-breakpoint
ALTER TABLE `product` ADD `category_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_category_id_product_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `product_category`(`id`) ON DELETE no action ON UPDATE no action;