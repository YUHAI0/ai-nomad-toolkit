import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { eq, and, ne } from 'drizzle-orm'
import Image from 'next/image'
import Link from 'next/link'
import { AffiliateDisclosure } from '@/components/affiliate-disclosure'
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
    const tools = await (db as any).select({ id: schema.tools.id })
      .from(schema.tools)
      .where(and(eq(schema.tools.status, 'published'), eq(schema.tools.isAi, true)))
    return tools.map((r: any) => ({ slug: r.id }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const schema = getSchema()
  const tools = await (db as any).select().from(schema.tools).where(eq(schema.tools.id, slug))
  const tool = tools[0]
  if (!tool) return {}
  return {
    title: `${tool.name} | AI Nomad Toolkit`,
    description: tool.oneLiner ?? tool.description?.slice(0, 160) ?? '',
    openGraph: { title: tool.name, description: tool.oneLiner ?? '' },
  }
}

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const schema = getSchema()

  const tools = await (db as any).select().from(schema.tools).where(eq(schema.tools.id, slug))
  const tool = tools[0]
  if (!tool || tool.status !== 'published') notFound()

  const [categoryArr, related] = await Promise.all([
    tool.categoryId
      ? (db as any).select().from(schema.categories).where(eq(schema.categories.id, tool.categoryId))
      : Promise.resolve([]),
    tool.categoryId
      ? (db as any).select().from(schema.tools)
          .where(and(eq(schema.tools.categoryId, tool.categoryId), eq(schema.tools.status, 'published'), ne(schema.tools.id, tool.id)))
          .limit(4)
      : Promise.resolve([]),
  ])

  const category = categoryArr[0] ?? null
  const visitUrl = tool.urlAffiliate || tool.urlOfficial

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    url: tool.urlOfficial,
    description: tool.oneLiner,
    applicationCategory: 'BusinessApplication',
    offers: tool.pricingType === 'free'
      ? { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      : undefined,
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-xs text-slate-400 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-green-600">首页</Link>
        <span>/</span>
        {category && <Link href={`/category/${category.id}`} className="hover:text-green-600">{category.name}</Link>}
        {category && <span>/</span>}
        <span className="text-slate-600">{tool.name}</span>
      </nav>

      <div className="flex items-start gap-5 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {tool.logoUrl
            ? <Image src={tool.logoUrl} alt={tool.name} width={64} height={64} className="rounded-2xl" />
            : <span className="text-3xl">{tool.name[0]}</span>
          }
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-slate-900">{tool.name}</h1>
          {tool.oneLiner && <p className="text-slate-500 mt-1">{tool.oneLiner}</p>}
          <div className="flex flex-wrap gap-2 mt-3">
            {((tool.tags as string[]) ?? []).map((tag: string) => (
              <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{tag}</span>
            ))}
            {tool.pricingType && (
              <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">
                {tool.pricingType === 'free' ? '免费' : tool.pricingType === 'freemium' ? 'Freemium' : '付费'}
                {tool.pricingDesc ? ` · ${tool.pricingDesc}` : ''}
              </span>
            )}
          </div>
        </div>
        <a href={visitUrl} target="_blank" rel="noopener noreferrer"
          data-tool-id={tool.id} data-tool-name={tool.name} data-has-affiliate={String(tool.hasAffiliate)}
          className="affiliate-link flex-shrink-0 bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700">
          前往官网 →
        </a>
      </div>

      {tool.description && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">工具介绍</h2>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{tool.description}</p>
        </div>
      )}

      {tool.hasAffiliate && <AffiliateDisclosure />}

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-slate-900 mb-4">同栏目推荐</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(related as any[]).map(t => <ToolCard key={t.id} tool={t} />)}
          </div>
        </div>
      )}
    </div>
  )
}
