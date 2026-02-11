PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`asset_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`ratio` real,
	`sequence` integer DEFAULT 0,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ports`("id", "asset_id", "name", "description", "ratio", "sequence") SELECT "id", "asset_id", "name", "description", "ratio", "sequence" FROM `ports`;--> statement-breakpoint
DROP TABLE `ports`;--> statement-breakpoint
ALTER TABLE `__new_ports` RENAME TO `ports`;--> statement-breakpoint
PRAGMA foreign_keys=ON;