import { db } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import { Hero } from '@/components/hero'
import { CategoryGrid } from '@/components/category-grid'
import { FeaturedTools } from '@/components/featured-tools'
import defaultCategories from '@/data/categories.json'
import defaultTools from '@/data/tools.json'

export const revalidate = 3600
export const dynamic = 'force-dynamic'

const HOME_DB_TIMEOUT_MS = 3000

type DefaultTool = {
  id: string
  name: string
  one_liner?: string | null
  logo_url?: string | null
  category?: string | null
  has_affiliate?: boolean | null
  url_affiliate?: string | null
  url_official: string
  pricing_type?: string | null
  is_ai?: boolean | null
  featured?: boolean | null
}

function getSchema() {
  return process.env.DATABASE_URL
    ? require('@/lib/schema/postgres')
    : require('@/lib/schema/sqlite')
}

function toDefaultCategory(cat: (typeof defaultCategories)[number]) {
  return {
    id: cat.id,
    name: cat.name,
    emoji: cat.emoji ?? null,
    priority: cat.priority ?? 0,
  }
}

function toDefaultTool(tool: DefaultTool) {
  return {
    id: tool.id,
    name: tool.name,
    oneLiner: tool.one_liner ?? null,
    logoUrl: tool.logo_url ?? null,
    categoryId: tool.category ?? null,
    hasAffiliate: tool.has_affiliate ?? false,
    urlAffiliate: tool.url_affiliate ?? null,
    urlOfficial: tool.url_official,
    pricingType: tool.pricing_type ?? null,
    isAi: tool.is_ai ?? true,
  }
}

function getDefaultHomeData() {
  const categories = defaultCategories
    .slice()
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
    .map(toDefaultCategory)

  const tools = defaultTools as DefaultTool[]
  const allPublished = tools.map(toDefaultTool)
  const featuredTools = tools
    .filter(tool => tool.featured)
    .slice(0, 6)
    .map(toDefaultTool)

  return { categories, featuredTools, allPublished }
}

async function getDatabaseHomeData() {
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

  return { categories, featuredTools, allPublished }
}

async function getHomeData() {
  let timeout: ReturnType<typeof setTimeout> | undefined

  try {
    return await Promise.race([
      getDatabaseHomeData(),
      new Promise<ReturnType<typeof getDefaultHomeData>>((resolve) => {
        timeout = setTimeout(() => resolve(getDefaultHomeData()), HOME_DB_TIMEOUT_MS)
      }),
    ])
  } catch (err) {
    console.error('[Home] Failed to load database home data:', err)
    return getDefaultHomeData()
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}

export default async function HomePage() {
  const { categories, featuredTools, allPublished } = await getHomeData()

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
