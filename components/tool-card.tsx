import Link from 'next/link'
import Image from 'next/image'

interface ToolCardProps {
  tool: {
    id: string
    name: string
    oneLiner?: string | null
    logoUrl?: string | null
    categoryId?: string | null
    hasAffiliate?: boolean | null
    urlAffiliate?: string | null
    urlOfficial: string
    pricingType?: string | null
    isAi?: boolean | null
  }
  categoryName?: string
  showAffiliateBadge?: boolean
}

export function ToolCard({ tool, categoryName, showAffiliateBadge = true }: ToolCardProps) {
  const href = tool.isAi !== false ? `/tool/${tool.id}` : `/site/${tool.id}`
  const visitUrl = tool.urlAffiliate || tool.urlOfficial

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {tool.logoUrl ? (
            <Image src={tool.logoUrl} alt={tool.name} width={40} height={40} className="rounded-lg" />
          ) : (
            <span className="text-xl">{tool.name[0]}</span>
          )}
        </div>
        {showAffiliateBadge && tool.hasAffiliate && (
          <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
            含联盟链接
          </span>
        )}
      </div>
      <div className="flex-1">
        <Link href={href} className="font-bold text-slate-900 hover:text-green-600 text-sm">{tool.name}</Link>
        {tool.oneLiner && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tool.oneLiner}</p>}
      </div>
      <div className="flex items-center justify-between pt-1">
        {categoryName && (
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{categoryName}</span>
        )}
        <a
          href={visitUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-tool-id={tool.id}
          data-tool-name={tool.name}
          data-has-affiliate={String(tool.hasAffiliate)}
          className="affiliate-link ml-auto text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium"
        >
          访问 →
        </a>
      </div>
    </div>
  )
}
