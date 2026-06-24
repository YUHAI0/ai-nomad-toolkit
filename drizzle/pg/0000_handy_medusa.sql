CREATE TABLE "admin_users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_en" text,
	"emoji" text,
	"description" text,
	"description_en" text,
	"audience" text,
	"is_ai" boolean DEFAULT true,
	"priority" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tools" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url_official" text NOT NULL,
	"url_affiliate" text,
	"has_affiliate" boolean DEFAULT false,
	"affiliate_rate" text,
	"category_id" text,
	"tags" json DEFAULT '[]'::json,
	"is_ai" boolean DEFAULT true,
	"pricing_type" text,
	"pricing_desc" text,
	"one_liner" text,
	"one_liner_en" text,
	"description" text,
	"description_en" text,
	"logo_url" text,
	"featured" boolean DEFAULT false,
	"region" text DEFAULT 'global',
	"status" text DEFAULT 'draft',
	"sort_order" integer DEFAULT 0,
	"last_verified" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "tools" ADD CONSTRAINT "tools_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_tools_category" ON "tools" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_tools_status" ON "tools" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_tools_featured" ON "tools" USING btree ("featured");