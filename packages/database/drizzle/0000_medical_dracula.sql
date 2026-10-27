CREATE TABLE `artist` (
	`uid` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`name` text NOT NULL,
	`source` text NOT NULL,
	`source_id` text NOT NULL,
	CONSTRAINT "artist_name_check" CHECK("artist"."name" <> '' AND "artist"."name" = trim("artist"."name")),
	CONSTRAINT "artist_source_check" CHECK("artist"."source" IN ('youtube')),
	CONSTRAINT "artist_source_id_check" CHECK(("artist"."source" IS NULL) = ("artist"."source_id" IS NULL)),
	CONSTRAINT "artist_source_id_text_check" CHECK("artist"."source_id" <> '' AND "artist"."source_id" = trim("artist"."source_id"))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `artist_source_unique` ON `artist` (`source`,`source_id`);--> statement-breakpoint
CREATE TABLE `playlist` (
	`uid` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`cover_hash` text,
	`cover_kind` text DEFAULT 'none' NOT NULL,
	`is_sync_enabled` integer DEFAULT false NOT NULL,
	`title` text NOT NULL,
	CONSTRAINT "playlist_cover_hash_check" CHECK(("playlist"."cover_kind" = 'none') = ("playlist"."cover_hash" IS NULL)),
	CONSTRAINT "playlist_cover_kind_check" CHECK("playlist"."cover_kind" IN ('custom', 'none')),
	CONSTRAINT "playlist_is_sync_enabled_check" CHECK("playlist"."is_sync_enabled" IN (0, 1)),
	CONSTRAINT "playlist_title_check" CHECK("playlist"."title" <> '' AND "playlist"."title" = trim("playlist"."title"))
);
--> statement-breakpoint
CREATE TABLE `playlist_track` (
	`playlist_uid` text NOT NULL,
	`sort_key` text NOT NULL,
	`track_uid` text NOT NULL,
	PRIMARY KEY(`playlist_uid`, `track_uid`),
	FOREIGN KEY (`playlist_uid`) REFERENCES `playlist`(`uid`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`track_uid`) REFERENCES `track`(`uid`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "playlist_track_sort_key_check" CHECK("playlist_track"."sort_key" <> '')
);
--> statement-breakpoint
CREATE INDEX `playlist_track_order_index` ON `playlist_track` (`playlist_uid`,`sort_key`,`track_uid`);--> statement-breakpoint
CREATE INDEX `playlist_track_track_uid_index` ON `playlist_track` (`track_uid`);--> statement-breakpoint
CREATE TABLE `playlist_local` (
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`playlist_uid` text PRIMARY KEY NOT NULL,
	`last_opened_at` integer NOT NULL,
	`sort_mode` text DEFAULT 'custom_asc' NOT NULL,
	FOREIGN KEY (`playlist_uid`) REFERENCES `playlist`(`uid`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "playlist_local_sort_mode_check" CHECK("playlist_local"."sort_mode" IN ('custom_asc', 'custom_desc', 'name_asc', 'name_desc'))
);
--> statement-breakpoint
CREATE TABLE `track` (
	`uid` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`artist_uid` text,
	`cover_hash` text,
	`cover_kind` text DEFAULT 'none' NOT NULL,
	`duration_ms` integer,
	`released_at` integer,
	`source` text NOT NULL,
	`source_id` text NOT NULL,
	`title` text NOT NULL,
	FOREIGN KEY (`artist_uid`) REFERENCES `artist`(`uid`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "track_cover_hash_check" CHECK(("track"."cover_kind" = 'none') = ("track"."cover_hash" IS NULL)),
	CONSTRAINT "track_cover_kind_check" CHECK("track"."cover_kind" IN ('custom', 'none', 'original')),
	CONSTRAINT "track_duration_ms_check" CHECK("track"."duration_ms" > 0),
	CONSTRAINT "track_source_check" CHECK("track"."source" IN ('youtube')),
	CONSTRAINT "track_source_id_check" CHECK("track"."source_id" <> '' AND "track"."source_id" = trim("track"."source_id")),
	CONSTRAINT "track_title_check" CHECK("track"."title" <> '' AND "track"."title" = trim("track"."title"))
);
--> statement-breakpoint
CREATE INDEX `track_artist_uid_index` ON `track` (`artist_uid`);--> statement-breakpoint
CREATE UNIQUE INDEX `track_source_unique` ON `track` (`source`,`source_id`);--> statement-breakpoint
CREATE TABLE `track_local` (
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`error_code` integer,
	`file_format` text,
	`file_path` text,
	`file_size_bytes` integer,
	`queued_at` integer,
	`status` text NOT NULL,
	`track_uid` text PRIMARY KEY NOT NULL,
	FOREIGN KEY (`track_uid`) REFERENCES `track`(`uid`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "track_local_error_code_check" CHECK(("track_local"."status" = 'failed') = ("track_local"."error_code" IS NOT NULL)),
	CONSTRAINT "track_local_file_check" CHECK(("track_local"."status" = 'downloaded') = ("track_local"."file_path" IS NOT NULL) AND ("track_local"."status" = 'downloaded') = ("track_local"."file_size_bytes" IS NOT NULL) AND ("track_local"."status" = 'downloaded') = ("track_local"."file_format" IS NOT NULL)),
	CONSTRAINT "track_local_file_format_check" CHECK("track_local"."file_format" IN ('m4a', 'opus')),
	CONSTRAINT "track_local_file_size_bytes_check" CHECK("track_local"."file_size_bytes" > 0),
	CONSTRAINT "track_local_queued_at_check" CHECK("track_local"."status" <> 'queued' OR "track_local"."queued_at" IS NOT NULL),
	CONSTRAINT "track_local_status_check" CHECK("track_local"."status" IN ('cancelled', 'downloaded', 'downloading', 'failed', 'not_downloaded', 'queued'))
);
--> statement-breakpoint
CREATE INDEX `track_local_status_index` ON `track_local` (`status`,`queued_at`);