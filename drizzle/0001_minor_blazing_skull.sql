CREATE TABLE "event" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"pathname" text NOT NULL,
	"referrer" text,
	"country" text,
	"browser" text,
	"os" text,
	"device" text,
	"visitor_hash" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"domain" text NOT NULL,
	"api_key" text NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "project_domain_unique" UNIQUE("domain"),
	CONSTRAINT "project_api_key_unique" UNIQUE("api_key")
);
--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_project_time_idx" ON "event" USING btree ("project_id","timestamp");