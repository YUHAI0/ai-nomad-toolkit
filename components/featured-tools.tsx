import { ToolCard } from './tool-card'

export function FeaturedTools({ tools, categories }: {
  tools: any[]
  categories: Array<{ id: string; name: string }>
}) {
  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-slate-900">✦ 精选推荐</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map(tool => {
            const cat = categories.find(c => c.id === tool.categoryId)
            return <ToolCard key={tool.id} tool={tool} categoryName={cat?.name} />
          })}
        </div>
        {tools.length === 0 && (
          <p className="text-center text-slate-400 py-12">精选工具即将上线，敬请期待</p>
        )}
      </div>
    </section>
  )
}
