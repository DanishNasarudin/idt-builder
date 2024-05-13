ALTER TABLE `product` DROP FOREIGN KEY `product_category_id_product_category_id_fk`;
--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_category_id_product_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `product_category`(`id`) ON DELETE cascade ON UPDATE no action;