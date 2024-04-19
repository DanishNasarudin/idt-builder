ALTER TABLE `product` MODIFY COLUMN `is_soldout` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `product` ADD `created_at` timestamp DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `product` ADD `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;