import Link from 'next/link'
import { Search } from './search-box'

export function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-black text-slate-900 tracking-tight text-lg">
            AI Nomad Toolkit
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-slate-600">
            <Link href="/category/etsy-tools" className="hover:text-green-600">工具</Link>
            <Link href="/about" className="hover:text-green-600">关于</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Search />
          <Link href="/submit"
            className="hidden sm:inline-flex bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700">
            提交工具 +
          </Link>
        </div>
      </div>
    </header>
  )
}
