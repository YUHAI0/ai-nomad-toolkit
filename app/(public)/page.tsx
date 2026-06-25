import { db } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import { Hero } from '@/components/hero'
import { CategoryGrid } from '@/components/category-grid'
import { FeaturedTools } from '@/components/featured-tools'

export const revalidate = 3600

function getSchema() {
  return process.env.DATABASE_URL
    ? require('@/lib/schema/postgres')
    : require('@/lib/schema/sqlite')
}

export default async function HomePage() {
  const schema = getSchema()

  const [categories, featuredTools, allPublished] = await Promise.all([
    (db as any).select().from(schema.categories).orderBy(schema.categories.priority),
    (db as any).select().from(schema.tools)
      .where(and(eq(schema.tools.featured, true), eq(schema.tools.status, 'published')))
      .limit(6),
    (db as any).select({ categoryId: schema.tools.categoryId, id: schema.tools.id })
      .from(schema.tools)
      .where(eq(schema.tools.status, 'published')),
  ])

  const countMap: Record<string, number> = {}
  for (const t of allPublished) {
    if (t.categoryId) countMap[t.categoryId] = (countMap[t.categoryId] ?? 0) + 1
  }

  const categoryCards = categories.map((c: any) => ({
    id: c.id,
    name: c.name,
    emoji: c.emoji,
    toolCount: countMap[c.id] ?? 0,
  }))

  return (
    <>
      <Hero toolCount={allPublished.length} />
      <CategoryGrid categories={categoryCards} />
      <FeaturedTools tools={featuredTools} categories={categories} />
    </>
  )
}
