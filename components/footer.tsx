import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-white font-bold text-sm">AI Nomad Toolkit</p>
          <p className="text-xs mt-1">数字游民赚钱路径地图 · 部分链接含 Affiliate 佣金</p>
        </div>
        <nav className="flex gap-6 text-xs">
          <Link href="/about" className="hover:text-white">关于本站</Link>
          <Link href="/disclaimer" className="hover:text-white">免责声明</Link>
          <Link href="/privacy" className="hover:text-white">隐私政策</Link>
          <Link href="/submit" className="hover:text-white">提交工具</Link>
        </nav>
      </div>
    </footer>
  )
}
