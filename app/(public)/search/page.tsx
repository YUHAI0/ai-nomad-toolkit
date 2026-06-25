import { db } from '@/lib/db'
import { like, or, eq, and } from 'drizzle-orm'
import { ToolCard } from '@/components/tool-card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '搜索工具 | AI Nomad Toolkit' }

function getSchema() {
  return process.env.DATABASE_URL
    ? require('@/lib/schema/postgres')
    : require('@/lib/schema/sqlite')
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q: rawQ } = await searchParams
  const q = rawQ?.trim() ?? ''
  const schema = getSchema()

  const tools = q
    ? await (db as any).select().from(schema.tools).where(
        and(
          eq(schema.tools.status, 'published'),
          or(
            like(schema.tools.name, `%${q}%`),
            like(schema.tools.oneLiner, `%${q}%`),
            like(schema.tools.description, `%${q}%`),
          )
        )
      )
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black text-slate-900 mb-2">
        {q ? `「${q}」的搜索结果` : '搜索工具'}
      </h1>
      {q && <p className="text-slate-400 text-sm mb-6">找到 {tools.length} 个工具</p>}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool: any) => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      ) : q ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg mb-4">没有找到「{q}」相关的工具</p>
          <a href={process.env.NEXT_PUBLIC_GOOGLE_FORM_URL ?? '/submit'}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700">
            提交新工具 +
          </a>
        </div>
      ) : null}
    </div>
  )
}
