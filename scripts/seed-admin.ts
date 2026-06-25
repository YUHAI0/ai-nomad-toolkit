import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'

function isPostgres() {
  return Boolean(process.env.DATABASE_URL)
}

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

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@example.com'
  const password = process.env.ADMIN_PASSWORD ?? 'changeme123'

  const schema = isPostgres()
    ? require('../lib/schema/postgres')
    : require('../lib/schema/sqlite')

  const existing = await (db as any)
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, email))

  if (existing.length > 0) {
    console.log(`[Seed] Admin already exists: ${email}`)
    process.exit(0)
  }

  const hash = await bcrypt.hash(password, 12)

  await (db as any).insert(schema.adminUsers).values({
    id: nanoid(),
    email,
    passwordHash: hash,
  })

  console.log(`[Seed] Admin created: ${email}`)
  process.exit(0)
}

seedAdmin().catch((err) => {
  console.error('[Seed] Failed:', err)
  process.exit(1)
})
