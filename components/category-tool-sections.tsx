import { ToolCard } from './tool-card'
import type { PublicCategory, PublicTool } from '@/lib/public-data'

type CategoryWithTools = {
  category: PublicCategory
  tools: PublicTool[]
}

export function CategoryToolSections({ sections }: { sections: CategoryWithTools[] }) {
  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-wrap gap-2">
          {sections.map(({ category, tools }) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:border-green-400 hover:text-green-600"
            >
              {category.emoji} {category.name} · {tools.length}
            </a>
          ))}
        </div>

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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} categoryName={category.name} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
