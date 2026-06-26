import { getCategories } from './actions'
import { CategoryForm } from './category-form'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-900">栏目管理</h1>
        <CategoryForm mode="create" />
      </div>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">排序</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">栏目</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">受众</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">板块</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat: any) => (
              <tr key={cat.id}>
                <td className="px-4 py-3 text-slate-400 text-xs">{cat.priority}</td>
                <td className="px-4 py-3">
                  <span className="font-semibold">{cat.emoji} {cat.name}</span>
                  <div className="text-xs text-slate-400">{cat.id}</div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{cat.audience}</td>
                <td className="px-4 py-3 text-xs">
                  <span className={`px-2 py-0.5 rounded ${cat.isAi ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                    {cat.isAi ? '板块 A (AI)' : '板块 B (非AI)'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <CategoryForm mode="edit" category={cat} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="text-center py-12 text-slate-400">暂无栏目</div>
        )}
      </div>
    </div>
  )
}
