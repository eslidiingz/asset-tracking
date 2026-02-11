CREATE TABLE `assets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`ratio` real,
	`sequence` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `ports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`asset_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`ratio` real,
	`sequence` integer DEFAULT 0
);
