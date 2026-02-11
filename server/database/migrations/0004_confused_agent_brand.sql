PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_stocks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`port_id` integer NOT NULL,
	`symbol` text NOT NULL,
	`amount` real NOT NULL,
	`cost` real NOT NULL,
	`sequence` integer DEFAULT 0,
	`ratio` real,
	FOREIGN KEY (`port_id`) REFERENCES `ports`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_stocks`("id", "port_id", "symbol", "amount", "cost", "sequence", "ratio") SELECT "id", "port_id", "symbol", "amount", "cost", "sequence", "ratio" FROM `stocks`;--> statement-breakpoint
DROP TABLE `stocks`;--> statement-breakpoint
ALTER TABLE `__new_stocks` RENAME TO `stocks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;