import { execSync } from 'child_process'

if (!process.env.DATABASE_URL) {
  if (process.env.VERCEL) {
    throw new Error('[prebuild] DATABASE_URL is required on Vercel.')
  }

  console.log('[prebuild] DATABASE_URL not set, skipping database bootstrap and default data import.')
  process.exit(0)
}

execSync('npx tsx scripts/bootstrap-db.ts', { stdio: 'inherit' })
execSync('npx tsx scripts/migrate-json-to-db.ts', { stdio: 'inherit' })
