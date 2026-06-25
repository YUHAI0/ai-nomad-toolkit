import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

const navItems = [
  { href: '/admin/tools',      icon: '⚡', label: '工具管理' },
  { href: '/admin/categories', icon: '📂', label: '栏目管理' },
  { href: '/admin/featured',   icon: '★',  label: '精选置顶' },
  { href: '/admin/affiliate',  icon: '🔗', label: 'Affiliate' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const isLoginPage = pathname === '/admin/login'

  // 登录页直接渲染，不检查 session 避免重定向循环
  if (isLoginPage) return <>{children}</>

  const session = await auth()
  if (!session) redirect('/admin/login')

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-48 bg-slate-900 flex flex-col py-4 px-3 flex-shrink-0">
        <div className="text-white font-black text-sm mb-6 px-2">⬡ AI Nomad</div>
        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <form aria-label="退出登录" action={async () => { 'use server'; await signOut({ redirectTo: '/admin/login' }) }}>
          <button type="submit" className="w-full flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-white text-sm">
            <span>↩</span> 退出登录
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  )
}
