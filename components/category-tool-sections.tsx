import { ToolCard } from './tool-card'
import type { PublicCategory, PublicTool } from '@/lib/public-data'

type CategoryWithTools = {
  category: PublicCategory
  tools: PublicTool[]
}

export function CategoryToolSections({ sections }: { sections: CategoryWithTools[] }) {
  return (
    <section className="px-4 py-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px_1fr] lg:items-start">
        <aside className="lg:sticky lg:top-20">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <h2 className="mb-3 px-2 text-sm font-bold text-slate-900">工具分类</h2>
            <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {sections.map(({ category, tools }) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="flex shrink-0 items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-green-50 hover:text-green-700 lg:shrink"
                >
                  <span className="truncate">{category.emoji} {category.name}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{tools.length}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="space-y-10">
          {sections.map(({ category, tools }) => {
            const hasCategoryPage = category.id !== 'other-tools'

            return (
              <div key={category.id} id={category.id} className="scroll-mt-20">
                <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      {category.emoji} {category.name}
                    </h2>
                    {category.description && (
                      <p className="mt-1 max-w-2xl text-sm text-slate-500">{category.description}</p>
                    )}
                  </div>
                  {hasCategoryPage && (
                    <a href={`/category/${category.id}`} className="text-sm font-semibold text-green-600 hover:text-green-700">
                      查看分类页 →
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {tools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} categoryName={category.name} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
