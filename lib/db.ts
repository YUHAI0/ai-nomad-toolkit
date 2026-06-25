import 'server-only'

function isPostgres() {
  return Boolean(process.env.DATABASE_URL)
}

function createDb() {
  if (isPostgres()) {
    if (!process.env.DATABASE_URL) {
      throw new Error('[DB] DATABASE_URL is required for Postgres')
    }
    const { drizzle } = require('drizzle-orm/postgres-js')
    const postgres = require('postgres')
    const schema = require('./schema/postgres')
    const client = postgres(process.env.DATABASE_URL!, {
      prepare: false,
      max: 1,
      idle_timeout: 5,
      connect_timeout: 10,
      max_lifetime: 60,
    })
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
globalForDb.db = db
