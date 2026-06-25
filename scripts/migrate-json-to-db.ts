// 使用方式：把 tools.json 和 categories.json 放到 data/ 目录后运行
// npx tsx scripts/migrate-json-to-db.ts

import { nanoid } from 'nanoid'
import fs from 'fs'
import path from 'path'

function isPostgres() {
  return Boolean(process.env.DATABASE_URL)
}

function getSchema() {
  return isPostgres()
    ? require('../lib/schema/postgres')
    : require('../lib/schema/sqlite')
}

// 独立创建数据库连接，避免引入带 server-only 的 lib/db（脚本通过 tsx 直接运行）
function createDb() {
  if (isPostgres()) {
    const { drizzle } = require('drizzle-orm/postgres-js')
    const postgres = require('postgres')
    const client = postgres(process.env.DATABASE_URL!, { prepare: false })
    return drizzle(client, { schema: require('../lib/schema/postgres') })
  }
  const { drizzle } = require('drizzle-orm/better-sqlite3')
  const Database = require('better-sqlite3')
  const client = new Database('./local.db')
  return drizzle(client, { schema: require('../lib/schema/sqlite') })
}

const db = createDb()

async function run() {
  const schema = getSchema()

  // 导入 categories
  const categoriesPath = path.join(process.cwd(), 'data', 'categories.json')
  if (fs.existsSync(categoriesPath)) {
    const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'))
    for (const cat of categories) {
      await (db as any).insert(schema.categories).values({
        id: cat.id,
        name: cat.name,
        nameEn: cat.name_en ?? null,
        emoji: cat.emoji ?? null,
        description: cat.description ?? null,
        descriptionEn: cat.description_en ?? null,
        audience: cat.audience ?? null,
        isAi: cat.is_ai_section ?? true,
        priority: cat.priority ?? 0,
        createdAt: new Date(),
      }).onConflictDoNothing()
    }
    console.log(`[Migrate] Imported ${categories.length} categories`)
  } else {
    console.log('[Migrate] No categories.json found, skipping')
  }

  // 导入 tools
  const toolsPath = path.join(process.cwd(), 'data', 'tools.json')
  if (fs.existsSync(toolsPath)) {
    const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf-8'))
    for (const t of tools) {
      await (db as any).insert(schema.tools).values({
        id: t.id ?? nanoid(10),
        name: t.name,
        urlOfficial: t.url_official,
        urlAffiliate: t.url_affiliate ?? null,
        hasAffiliate: t.has_affiliate ?? false,
        affiliateRate: t.affiliate_rate ?? null,
        categoryId: t.category ?? null,
        tags: t.tags ?? [],
        isAi: t.is_ai ?? true,
        pricingType: t.pricing_type ?? null,
        pricingDesc: t.pricing_desc ?? null,
        oneLiner: t.one_liner ?? null,
        oneLinerEn: t.one_liner_en ?? null,
        description: t.description ?? null,
        descriptionEn: t.description_en ?? null,
        logoUrl: t.logo_url ?? null,
        featured: t.featured ?? false,
        region: t.region ?? 'global',
        status: 'published',
        sortOrder: 0,
        lastVerified: t.last_verified ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).onConflictDoNothing()
    }
    console.log(`[Migrate] Imported ${tools.length} tools`)
  } else {
    console.log('[Migrate] No tools.json found, skipping')
  }

  console.log('[Migrate] Done!')
  process.exit(0)
}

run().catch(e => { console.error('[Migrate] Error:', e); process.exit(1) })
