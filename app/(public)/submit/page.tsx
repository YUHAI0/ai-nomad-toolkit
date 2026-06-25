import type { Metadata } from 'next'
import { SubmitForm } from './submit-form'
import { getPublicCategories } from './actions'

export const metadata: Metadata = { title: '提交工具 | AI Nomad Toolkit' }

export default async function SubmitPage() {
  const categories = await getPublicCategories()
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">提交新工具</h1>
        <p className="text-slate-500">发现了好用的工具？填写下方信息，我们审核后会收录到导航站。</p>
      </div>
      <SubmitForm categories={categories} />
    </div>
  )
}
