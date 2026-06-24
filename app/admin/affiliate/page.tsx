'use client'
import { useState, useEffect } from 'react'
import { getAffiliateTools, updateAffiliateLink } from './actions'

export default function AffiliatePage() {
  const [tools, setTools] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  const [edits, setEdits] = useState<Record<string, { url: string; rate: string }>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})

  useEffect(() => {
    getAffiliateTools(filter).then(setTools)
  }, [filter])

  function getStatus(tool: any) {
    if (tool.hasAffiliate && tool.affiliateRate) return { label: '已开通', cls: 'bg-green-100 text-green-700' }
    if (tool.hasAffiliate && !tool.affiliateRate) return { label: '申请中', cls: 'bg-amber-100 text-amber-700' }
    return { label: '无联盟', cls: 'bg-slate-100 text-slate-500' }
  }

  async function handleSave(toolId: string) {
    const tool = tools.find(t => t.id === toolId)
    const edit = edits[toolId] ?? { url: tool?.urlAffiliate ?? '', rate: tool?.affiliateRate ?? '' }
    const url = edit.url
    const rate = edit.rate
    setSaving(p => ({ ...p, [toolId]: true }))
    try {
      await updateAffiliateLink(toolId, url, rate, url !== '' || rate !== '')
      setTools(prev => prev.map(t => t.id === toolId ? { ...t, urlAffiliate: url, affiliateRate: rate, hasAffiliate: url !== '' || rate !== '' } : t))
    } finally {
      setSaving(p => ({ ...p, [toolId]: false }))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-900">Affiliate 链接管理</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
          <option value="">全部状态</option>
          <option value="active">已开通</option>
          <option value="pending">申请中</option>
          <option value="none">无联盟</option>
        </select>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-32">工具</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Affiliate URL</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-28">佣金说明</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-20">状态</th>
              <th className="px-4 py-3 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tools.map((tool: any) => {
              const edit = edits[tool.id] ?? { url: tool.urlAffiliate ?? '', rate: tool.affiliateRate ?? '' }
              const status = getStatus(tool)
              return (
                <tr key={tool.id}>
                  <td className="px-4 py-3 font-semibold">{tool.name}</td>
                  <td className="px-4 py-3">
                    <input
                      value={edit.url}
                      onChange={e => setEdits(p => ({ ...p, [tool.id]: { ...edit, url: e.target.value } }))}
                      className="w-full border border-slate-200 rounded px-2 py-1 text-xs"
                      placeholder="https://..."
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      value={edit.rate}
                      onChange={e => setEdits(p => ({ ...p, [tool.id]: { ...edit, rate: e.target.value } }))}
                      className="w-full border border-slate-200 rounded px-2 py-1 text-xs"
                      placeholder="40%循环"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${status.cls}`}>{status.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleSave(tool.id)}
                      disabled={saving[tool.id]}
                      className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {saving[tool.id] ? '保存中' : '保存'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {tools.length === 0 && (
          <div className="text-center py-12 text-slate-400">暂无数据</div>
        )}
      </div>
    </div>
  )
}
