import type { Metadata } from 'next'

export const metadata: Metadata = { title: '隐私政策 | AI Nomad Toolkit' }

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-slate-900 mb-6">隐私政策</h1>
      <div className="space-y-4 text-slate-600 leading-relaxed">
        <p><strong>数据收集：</strong>本站通过 Google Analytics 4 收集匿名访问数据（页面浏览量、点击事件等），不收集任何个人身份信息。</p>
        <p><strong>Cookie：</strong>本站使用 Google Analytics 和 Google AdSense 相关 Cookie，用于统计分析和广告投放。您可以通过浏览器设置拒绝 Cookie。</p>
        <p><strong>第三方链接：</strong>本站包含指向第三方网站的链接（包括 Affiliate 链接）。我们对第三方网站的隐私政策不负责任。</p>
        <p><strong>联系方式：</strong>如对隐私政策有疑问，请通过在线客服联系我们。</p>
      </div>
    </div>
  )
}
