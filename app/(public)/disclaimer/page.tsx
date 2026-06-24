import type { Metadata } from 'next'

export const metadata: Metadata = { title: '免责声明 | AI Nomad Toolkit' }

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-slate-900 mb-6">免责声明</h1>
      <div className="space-y-4 text-slate-600 leading-relaxed">
        <p><strong>Affiliate 披露：</strong>本站部分链接为 Affiliate（联盟营销）链接。当您通过这些链接进行购买或注册时，我们可能获得佣金，这不会增加您的任何费用。所有推荐均基于我们的真实体验和判断。</p>
        <p><strong>信息准确性：</strong>本站工具信息（定价、功能、Affiliate 条款）以各工具官网为准，我们定期核验但不保证实时准确。</p>
        <p><strong>不提供代理服务：</strong>本站不提供任何网络代理、VPN 或翻墙服务，也不对任何工具的可访问性作出保证。</p>
        <p><strong>投资风险：</strong>本站内容仅供参考，不构成任何财务或投资建议。</p>
      </div>
    </div>
  )
}
