import { getTools, getCategories, publishTool, deleteTool } from './actions'
import { ToolForm } from './tool-form'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; status?: string }>
}) {
  const params = await searchParams
  const [tools, categories] = await Promise.all([
    getTools(params.search, params.category, params.status),
    getCategories(),
  ])

  const published = tools.filter((t: any) => t.status === 'published').length
  const drafts = tools.filter((t: any) => t.status === 'draft').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">工具管理</h1>
          <p className="text-sm text-slate-500">共 {tools.length} 条 · {published} 已发布 · {drafts} 草稿</p>
        </div>
        <ToolForm categories={categories} mode="create" />
      </div>

      {/* Filters */}
      <form className="flex gap-3 mb-4">
        <input
          name="search"
          defaultValue={params.search}
          placeholder="🔍 搜索工具名..."
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-48"
        />
        <select name="category" defaultValue={params.category} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
          <option value="">全部栏目</option>
          {categories.map((c: any) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
        </select>
        <select name="status" defaultValue={params.status} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
          <option value="">全部状态</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
        </select>
        <button type="submit" className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm hover:bg-slate-200">筛选</button>
      </form>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">工具名称</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">栏目</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">状态</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">联盟</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tools.map((tool: any) => {
              const cat = categories.find((c: any) => c.id === tool.categoryId)
              return (
                <tr key={tool.id} className={tool.status === 'draft' ? 'bg-amber-50' : ''}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{tool.name}</div>
                    <div className="text-xs text-slate-400">{tool.oneLiner}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {cat ? `${cat.emoji} ${cat.name}` : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={tool.status === 'published' ? 'default' : 'secondary'}
                      className={tool.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                    >
                      {tool.status === 'published' ? '已发布' : '草稿'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {tool.hasAffiliate && tool.affiliateRate ? tool.affiliateRate
                     : tool.hasAffiliate ? '申请中'
                     : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <ToolForm categories={categories} tool={tool} mode="edit" />
                      <form action={publishTool.bind(null, tool.id, tool.status === 'published' ? 'draft' : 'published')}>
                        <button
                          type="submit"
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            tool.status === 'draft'
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {tool.status === 'draft' ? '发布' : '下线'}
                        </button>
                      </form>
                      <form action={deleteTool.bind(null, tool.id)}>
                        <button
                          type="submit"
                          className="px-3 py-1 rounded text-xs bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          删除
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {tools.length === 0 && (
          <div className="text-center py-12 text-slate-400">暂无工具，点击「新建工具」添加</div>
        )}
      </div>
    </div>
  )
}
