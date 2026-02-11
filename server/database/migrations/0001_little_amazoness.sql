CREATE TABLE `stocks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`port_id` integer NOT NULL,
	`symbol` text NOT NULL,
	`amount` real NOT NULL,
	`cost` real NOT NULL,
	`sequence` integer DEFAULT 0
);
