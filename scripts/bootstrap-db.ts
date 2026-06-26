import postgres from 'postgres'

async function main() {
  if (!process.env.DATABASE_URL) {
    if (process.env.VERCEL) {
      throw new Error('[bootstrap-db] DATABASE_URL is required on Vercel.')
    }
    console.log('[bootstrap-db] DATABASE_URL not set, skipping database bootstrap.')
    return
  }

  const sql = postgres(process.env.DATABASE_URL, {
    prepare: false,
    max: 1,
    idle_timeout: 5,
    connect_timeout: 10,
  })

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "admin_users" (
        "id" text PRIMARY KEY NOT NULL,
        "email" text NOT NULL UNIQUE,
        "password_hash" text NOT NULL,
        "created_at" timestamp DEFAULT now()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS "categories" (
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
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS "tools" (
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
      )
    `

    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'tools_category_id_categories_id_fk'
        ) THEN
          ALTER TABLE "tools"
            ADD CONSTRAINT "tools_category_id_categories_id_fk"
            FOREIGN KEY ("category_id")
            REFERENCES "public"."categories"("id");
        END IF;
      END $$;
    `

    await sql`CREATE INDEX IF NOT EXISTS "idx_tools_category" ON "tools" USING btree ("category_id")`
    await sql`CREATE INDEX IF NOT EXISTS "idx_tools_status" ON "tools" USING btree ("status")`
    await sql`CREATE INDEX IF NOT EXISTS "idx_tools_featured" ON "tools" USING btree ("featured")`

    console.log('[bootstrap-db] Database tables are ready.')
  } finally {
    await sql.end()
  }
}

main().catch((err) => {
  console.error('[bootstrap-db] Failed:', err)
  process.exit(1)
})
