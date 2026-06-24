CREATE TABLE `admin_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`name_en` text,
	`emoji` text,
	`description` text,
	`description_en` text,
	`audience` text,
	`is_ai` integer DEFAULT true,
	`priority` integer DEFAULT 0,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `tools` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`url_official` text NOT NULL,
	`url_affiliate` text,
	`has_affiliate` integer DEFAULT false,
	`affiliate_rate` text,
	`category_id` text,
	`tags` text DEFAULT '[]',
	`is_ai` integer DEFAULT true,
	`pricing_type` text,
	`pricing_desc` text,
	`one_liner` text,
	`one_liner_en` text,
	`description` text,
	`description_en` text,
	`logo_url` text,
	`featured` integer DEFAULT false,
	`region` text DEFAULT 'global',
	`status` text DEFAULT 'draft',
	`sort_order` integer DEFAULT 0,
	`last_verified` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
