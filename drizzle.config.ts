import type { Config } from 'drizzle-kit'

export default {
  schema: './lib/schema/sqlite.ts',
  out: './drizzle/sqlite',
  dialect: 'sqlite',
  dbCredentials: {
    url: './local.db',
  },
} satisfies Config
