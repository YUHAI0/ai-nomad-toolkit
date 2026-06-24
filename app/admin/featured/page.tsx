import { getFeaturedTools, getAllPublishedTools, toggleFeatured } from './actions'

export default async function FeaturedPage() {
  const [featured, allTools] = await Promise.all([getFeaturedTools(), getAllPublishedTools()])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">精选置顶</h1>
        <p className="text-sm text-slate-500">首页展示 6 个精选工具，当前已选 {featured.length} 个</p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">✦ 当前精选（{featured.length}/6）</h2>
          <div className="space-y-2">
            {featured.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <span className="font-medium text-sm">{t.name}</span>
                <form action={toggleFeatured.bind(null, t.id, false)}>
                  <button type="submit" className="text-xs text-red-500 hover:text-red-700">移除</button>
                </form>
              </div>
            ))}
            {featured.length === 0 && <p className="text-slate-400 text-sm">暂无精选工具</p>}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">已发布工具（点击添加）</h2>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {(allTools as any[])
              .filter((t: any) => !(featured as any[]).find((f: any) => f.id === t.id))
              .map((t: any) => (
                <form key={t.id} action={toggleFeatured.bind(null, t.id, true)}>
                  <button
                    type="submit"
                    disabled={(featured as any[]).length >= 6}
                    className="w-full text-left px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
                  >
                    {t.name}
                  </button>
                </form>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
