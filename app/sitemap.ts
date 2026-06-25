import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'

function getSchema() {
  return process.env.DB_DRIVER === 'postgres'
    ? require('@/lib/schema/postgres')
    : require('@/lib/schema/sqlite')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.com'
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
