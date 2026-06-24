import type { Metadata } from 'next'

export const metadata: Metadata = { title: '提交工具 | AI Nomad Toolkit' }

export default function SubmitPage() {
  const formUrl = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL ?? '#'
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-black text-slate-900 mb-4">提交新工具</h1>
      <p className="text-slate-500 mb-8">发现了好用的工具？欢迎提交，我们审核后会收录到导航站。</p>
      <a href={formUrl} target="_blank" rel="noopener noreferrer"
        className="bg-green-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-green-700 text-lg">
        填写提交表单 →
      </a>
    </div>
  )
}
