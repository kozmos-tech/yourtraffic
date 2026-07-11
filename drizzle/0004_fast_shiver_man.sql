CREATE TABLE "custom_event" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"name" text NOT NULL,
	"pathname" text,
	"visitor_hash" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "custom_event" ADD CONSTRAINT "custom_event_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "custom_event_project_time_idx" ON "custom_event" USING btree ("project_id","timestamp");