ALTER TABLE `product` MODIFY COLUMN `created_at` timestamp DEFAULT CURRENT_TIMESTAMP(0);--> statement-breakpoint
ALTER TABLE `product` MODIFY COLUMN `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0);