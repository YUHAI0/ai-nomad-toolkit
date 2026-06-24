import type { Metadata } from 'next'

export const metadata: Metadata = { title: '关于本站 | AI Nomad Toolkit' }

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-slate-900 mb-6">关于本站</h1>
      <div className="space-y-4 text-slate-600 leading-relaxed">
        <p>AI Nomad Toolkit 是一个专为数字游民打造的 AI 工具与变现平台导航站。我们精选真实测评过的工具，按使用场景分类，帮助 Etsy 卖家、内容创作者、独立开发者和数字游民找到最适合自己的工具。</p>
        <p>如有合作或建议，欢迎通过页面右下角的在线客服联系我们。</p>
      </div>
    </div>
  )
}
