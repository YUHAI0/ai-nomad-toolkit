import Link from 'next/link'

const identityTags = [
  { label: '🛍️ Etsy 卖家',    href: '/category/etsy-tools' },
  { label: '📱 内容创作者',     href: '/category/content-social' },
  { label: '💻 独立开发者',     href: '/category/dev-tools' },
  { label: '🌍 数字游民',       href: '/category/nomad-life' },
]

export function Hero({ toolCount }: { toolCount: number }) {
  return (
    <section className="bg-slate-900 py-16 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto lg:max-w-3xl">
        <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-3">✦ 数字游民专属资源库</p>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-3">
          数字游民赚钱路径地图
        </h1>
        <p className="text-slate-400 text-lg mb-6">
          {toolCount} 个精选工具 · AI + 变现平台 · 全部亲测可用
        </p>
        <div className="mb-8">
          <p className="text-slate-500 text-xs uppercase tracking-wide mb-3">选择你的身份，直达对应工具 →</p>
          <div className="flex flex-wrap gap-2">
            {identityTags.map(tag => (
              <Link key={tag.href} href={tag.href}
                className="px-4 py-2 rounded-full border border-slate-700 text-slate-300 text-sm hover:border-green-500 hover:text-green-400 transition-colors">
                {tag.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/category/etsy-tools"
            className="bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors">
            浏览全部工具 →
          </Link>
          <Link href="/category/etsy-tools"
            className="border border-slate-600 text-slate-300 font-medium px-6 py-3 rounded-xl hover:border-green-500 hover:text-green-400 transition-colors">
            Etsy 专区 🛍️
          </Link>
        </div>
      </div>
    </section>
  )
}
