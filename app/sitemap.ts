import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'

function getSiteUrl() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    'https://yourdomain.com'

  return url.startsWith('http') ? url : `https://${url}`
}

function getSchema() {
  return process.env.DATABASE_URL
    ? require('@/lib/schema/postgres')
    : require('@/lib/schema/sqlite')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const schema = getSchema()

  const [tools, categories] = await Promise.all([
    (db as any).select({ id: schema.tools.id, isAi: schema.tools.isAi, updatedAt: schema.tools.updatedAt })
      .from(schema.tools).where(eq(schema.tools.status, 'published')).catch(() => []),
    (db as any).select({ id: schema.categories.id }).from(schema.categories).catch(() => []),
  ])

  const toolUrls = tools.map((t: any) => ({
    url: `${base}/${t.isAi !== false ? 'tool' : 'site'}/${t.id}`,
    lastModified: t.updatedAt ?? new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryUrls = categories.map((c: any) => ({
    url: `${base}/category/${c.id}`,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [
    { url: base, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/privacy`, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${base}/disclaimer`, changeFrequency: 'monthly', priority: 0.2 },
    ...categoryUrls,
    ...toolUrls,
  ]
}
