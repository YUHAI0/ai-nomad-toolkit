export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  try {
    const { isPostgres } = await import('./lib/env')
    if (isPostgres()) {
      const { migrate } = await import('drizzle-orm/postgres-js/migrator')
      const { db } = await import('./lib/db')
      await migrate(db as any, { migrationsFolder: './drizzle/pg' })
    } else {
      const { migrate } = await import('drizzle-orm/better-sqlite3/migrator')
      const { db } = await import('./lib/db')
      await migrate(db as any, { migrationsFolder: './drizzle/sqlite' })
    }
    console.log('[DB] Migrations applied successfully')
  } catch (err) {
    console.error('[DB] Migration failed:', err)
    // 不抛错，避免阻塞应用启动
  }
}
