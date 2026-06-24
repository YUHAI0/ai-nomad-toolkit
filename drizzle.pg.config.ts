import type { Config } from 'drizzle-kit'

export default {
  schema: './lib/schema/postgres.ts',
  out: './drizzle/pg',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config
