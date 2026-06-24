import 'server-only'

function createDb() {
  if (process.env.DB_DRIVER === 'postgres') {
    if (!process.env.DATABASE_URL) {
      throw new Error('[DB] DATABASE_URL is required when DB_DRIVER=postgres')
    }
    const { drizzle } = require('drizzle-orm/postgres-js')
    const postgres = require('postgres')
    const schema = require('./schema/postgres')
    const client = postgres(process.env.DATABASE_URL!, { prepare: false })
    return drizzle(client, { schema })
  } else {
    const { drizzle } = require('drizzle-orm/better-sqlite3')
    const Database = require('better-sqlite3')
    const schema = require('./schema/sqlite')
    const client = new Database('./local.db')
    return drizzle(client, { schema })
  }
}

// 单例：模块级缓存，避免开发热重载时重复建连
const globalForDb = global as unknown as { db: ReturnType<typeof createDb> }
export const db = globalForDb.db ?? createDb()
if (process.env.NODE_ENV !== 'production') globalForDb.db = db
