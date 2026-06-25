'use client'
import { useState } from 'react'
import { submitTool } from './actions'

interface Props {
  categories: Array<{ id: string; name: string; emoji: string | null }>
}

export function SubmitForm({ categories }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    const result = await submitTool(new FormData(e.currentTarget))
    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
      setErrorMsg(result.error ?? '提交失败')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h2 className="text-xl font-bold text-green-800 mb-2">提交成功！</h2>
        <p className="text-green-700 text-sm">感谢你的推荐，我们会尽快审核并收录。</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm text-green-600 underline hover:text-green-800"
        >
          继续提交其他工具
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          工具名称 <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          required
          placeholder="例：Cursor"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          官网 URL <span className="text-red-500">*</span>
        </label>
        <input
          name="urlOfficial"
          required
          type="url"
          placeholder="https://example.com"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">一句话介绍（30字内）</label>
        <input
          name="oneLiner"
          maxLength={60}
          placeholder="例：AI 驱动的代码编辑器，提升编程效率"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">适合的栏目</label>
          <select
            name="categoryId"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">不确定</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">定价类型</label>
          <select
            name="pricingType"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">不确定</option>
            <option value="free">免费</option>
            <option value="freemium">Freemium</option>
            <option value="paid">付费</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">补充说明（可选）</label>
        <textarea
          name="submitterNote"
          rows={3}
          placeholder="为什么推荐这个工具？有什么特别之处？"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-sm">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? '提交中...' : '提交工具 →'}
      </button>

      <p className="text-xs text-slate-400 text-center">提交后进入草稿，审核通过后才会在站内展示</p>
    </form>
  )
}
