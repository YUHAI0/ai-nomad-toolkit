export function Hero({ toolCount }: { toolCount: number }) {
  return (
    <section className="border-b border-slate-200 bg-white px-4 py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-green-600">✦ 数字游民专属资源库</p>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            工具目录
          </h1>
        </div>
        <p className="text-sm text-slate-500">
          {toolCount} 个精选工具，按使用场景分类浏览
        </p>
      </div>
    </section>
  )
}
