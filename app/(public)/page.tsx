import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { Hero } from '@/components/hero'
import { CategoryToolSections } from '@/components/category-tool-sections'
import { getFallbackHomeData } from '@/lib/public-data'
import type { PublicCategory, PublicTool } from '@/lib/public-data'

export const revalidate = 3600
export const dynamic = 'force-dynamic'

const HOME_DB_TIMEOUT_MS = 3000

type HomeData = {
  categories: PublicCategory[]
  tools: PublicTool[]
}

const uncategorizedCategory: PublicCategory = {
  id: 'other-tools',
  name: '其他工具',
  emoji: '🧰',
  description: '暂未归入具体分类的精选工具。',
  priority: 999,
}

function getSchema() {
  return process.env.DATABASE_URL
    ? require('@/lib/schema/postgres')
    : require('@/lib/schema/sqlite')
}

async function getDatabaseHomeData(): Promise<HomeData> {
  const schema = getSchema()

  const [categories, tools] = await Promise.all([
    (db as any).select().from(schema.categories).orderBy(schema.categories.priority),
    (db as any).select().from(schema.tools)
      .where(eq(schema.tools.status, 'published'))
      .orderBy(schema.tools.sortOrder),
  ])

  return {
    categories: categories as PublicCategory[],
    tools: tools as PublicTool[],
  }
}

async function getHomeData(): Promise<HomeData> {
  let timeout: ReturnType<typeof setTimeout> | undefined

  try {
    return await Promise.race([
      getDatabaseHomeData(),
      new Promise<HomeData>((resolve) => {
        timeout = setTimeout(() => resolve(getFallbackHomeData()), HOME_DB_TIMEOUT_MS)
      }),
    ])
  } catch (err) {
    console.error('[Home] Failed to load database home data:', err)
    return getFallbackHomeData()
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}

export default async function HomePage() {
  const { categories, tools } = await getHomeData()
  const categoryIds = new Set(categories.map(category => category.id))
  const categorizedSections = categories
    .map(category => ({
      category,
      tools: tools.filter(tool => tool.categoryId === category.id),
    }))
    .filter(section => section.tools.length > 0)
  const uncategorizedTools = tools.filter(tool => !tool.categoryId || !categoryIds.has(tool.categoryId))
  const sections = uncategorizedTools.length > 0
    ? [...categorizedSections, { category: uncategorizedCategory, tools: uncategorizedTools }]
    : categorizedSections
  const visibleToolCount = sections.reduce((total, section) => total + section.tools.length, 0)

  return (
    <>
      <Hero toolCount={visibleToolCount} />
      <CategoryToolSections sections={sections} />
    </>
  )
}
