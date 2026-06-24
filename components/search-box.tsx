'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function Search() {
  const router = useRouter()
  const [q, setQ] = useState('')

  return (
    <form onSubmit={e => { e.preventDefault(); if (q.trim()) router.push(`/search?q=${encodeURIComponent(q)}`) }}>
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="🔍 搜索工具..."
        className="bg-slate-100 rounded-full px-4 py-1.5 text-sm text-slate-600 w-40 focus:w-52 transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </form>
  )
}
