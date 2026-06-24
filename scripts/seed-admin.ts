import { db } from '../lib/db'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@example.com'
  const password = process.env.ADMIN_PASSWORD ?? 'changeme123'

  const schema = process.env.DB_DRIVER === 'postgres'
    ? require('../lib/schema/postgres')
    : require('../lib/schema/sqlite')

  const hash = await bcrypt.hash(password, 12)

  await (db as any).insert(schema.adminUsers).values({
    id: nanoid(),
    email,
    passwordHash: hash,
  }).onConflictDoNothing()

  console.log(`[Seed] Admin created: ${email}`)
  process.exit(0)
}

seedAdmin()
