import Link from 'next/link'

interface CategoryCardProps {
  id: string
  name: string
  emoji: string | null
  toolCount: number
}

export function CategoryGrid({ categories }: { categories: CategoryCardProps[] }) {
  return (
    <section className="bg-white border-b border-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900">全部使用场景</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.id}`}
              className={`relative rounded-xl p-4 border text-sm hover:shadow-md transition-shadow ${
                cat.id === 'etsy-tools'
                  ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
                  : 'bg-white border-slate-200'
              }`}>
              {cat.id === 'etsy-tools' && (
                <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full">热门</span>
              )}
              <div className="text-2xl mb-2">{cat.emoji}</div>
              <div className="font-semibold text-slate-900 text-xs leading-tight">{cat.name}</div>
              <div className="text-slate-400 text-xs mt-1">{cat.toolCount} 个工具</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
