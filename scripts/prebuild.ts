import { execSync } from 'child_process'

function runBestEffort(command: string, label: string) {
  try {
    execSync(command, { stdio: 'inherit' })
  } catch (err) {
    console.warn(`[prebuild] ${label} failed, continuing build because public pages have JSON fallback.`)
    console.warn(err)
  }
}

if (!process.env.DATABASE_URL) {
  if (process.env.VERCEL) {
    throw new Error('[prebuild] DATABASE_URL is required on Vercel.')
  }

  console.log('[prebuild] DATABASE_URL not set, skipping database bootstrap and default data import.')
  process.exit(0)
}

runBestEffort('npx tsx scripts/bootstrap-db.ts', 'database bootstrap')
runBestEffort('npx tsx scripts/migrate-json-to-db.ts', 'default data import')
