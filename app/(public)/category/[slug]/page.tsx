import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import { ToolCard } from '@/components/tool-card'
import type { Metadata } from 'next'

export const revalidate = 3600

function getSchema() {
  return process.env.DB_DRIVER === 'postgres'
    ? require('@/lib/schema/postgres')
    : require('@/lib/schema/sqlite')
}

export async function generateStaticParams() {
  try {
    const schema = getSchema()
    const cats = await (db as any).select({ id: schema.categories.id }).from(schema.categories)
    return cats.map((c: any) => ({ slug: c.id }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const schema = getSchema()
  const cats = await (db as any).select().from(schema.categories).where(eq(schema.categories.id, slug))
  const cat = cats[0]
  if (!cat) return {}
  return {
    title: `${cat.name} | AI Nomad Toolkit`,
    description: cat.description ?? `${cat.name}精选工具，数字游民必备`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ filter?: string }>
}) {
  const { slug } = await params
  const { filter } = await searchParams
  const schema = getSchema()

  const cats = await (db as any).select().from(schema.categories).where(eq(schema.categories.id, slug))
  const cat = cats[0]
  if (!cat) notFound()

  const allTools = await (db as any).select().from(schema.tools)
    .where(and(eq(schema.tools.categoryId, slug), eq(schema.tools.status, 'published')))
    .orderBy(schema.tools.sortOrder)

  const tools = allTools.filter((t: any) => {
    if (filter === 'affiliate') return t.hasAffiliate
    if (filter === 'free') return t.pricingType === 'free'
    if (filter === 'paid') return t.pricingType === 'paid' || t.pricingType === 'freemium'
    return true
  })

  const filterTabs = [
    { key: '', label: '全部' },
    { key: 'affiliate', label: '有 Affiliate' },
    { key: 'free', label: '免费' },
    { key: 'paid', label: '付费/Freemium' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">{cat.emoji} {cat.name}</h1>
        {cat.description && <p className="text-slate-500 mt-2 max-w-2xl">{cat.description}</p>}
      </div>
      <div className="flex gap-2 mb-6">
        {filterTabs.map(tab => (
          <a key={tab.key} href={tab.key ? `?filter=${tab.key}` : `?`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              (filter ?? '') === tab.key
                ? 'bg-green-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-green-400'
            }`}>
            {tab.label}
          </a>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((tool: any) => <ToolCard key={tool.id} tool={tool} categoryName={cat.name} />)}
      </div>
      {tools.length === 0 && (
        <p className="text-center text-slate-400 py-20">该分类暂无工具</p>
      )}
    </div>
  )
}
