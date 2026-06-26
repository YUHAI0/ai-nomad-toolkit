import type { Metadata } from 'next'

export const metadata: Metadata = { title: '免责声明 | AI Nomad Toolkit' }

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-slate-900 mb-6">免责声明</h1>
      <div className="space-y-4 text-slate-600 leading-relaxed">
        <p><strong>工具推荐：</strong>本站推荐基于公开资料、实际体验和适用场景整理，不构成对任何第三方工具的担保或背书。</p>
        <p><strong>信息准确性：</strong>本站工具信息（定价、功能、服务条款）以各工具官网为准，我们定期核验但不保证实时准确。</p>
        <p><strong>不提供代理服务：</strong>本站不提供任何网络代理、VPN 或翻墙服务，也不对任何工具的可访问性作出保证。</p>
        <p><strong>投资风险：</strong>本站内容仅供参考，不构成任何财务或投资建议。</p>
      </div>
    </div>
  )
}
