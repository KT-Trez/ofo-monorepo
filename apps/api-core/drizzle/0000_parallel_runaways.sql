CREATE TABLE "announcement" (
	"message" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"uid" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
