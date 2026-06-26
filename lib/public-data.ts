import defaultCategories from '@/data/categories.json'
import defaultTools from '@/data/tools.json'

export const PUBLIC_DB_TIMEOUT_MS = 3000

export type PublicCategory = {
  id: string
  name: string
  nameEn?: string | null
  emoji?: string | null
  description?: string | null
  descriptionEn?: string | null
  audience?: string | null
  isAi?: boolean | null
  priority?: number | null
}

export type PublicTool = {
  id: string
  name: string
  urlOfficial: string
  urlAffiliate?: string | null
  hasAffiliate?: boolean | null
  affiliateRate?: string | null
  categoryId?: string | null
  tags?: string[] | null
  isAi?: boolean | null
  pricingType?: string | null
  pricingDesc?: string | null
  oneLiner?: string | null
  oneLinerEn?: string | null
  description?: string | null
  descriptionEn?: string | null
  logoUrl?: string | null
  featured?: boolean | null
  region?: string | null
  status?: string | null
  sortOrder?: number | null
  lastVerified?: string | null
}

type DefaultTool = {
  id: string
  name: string
  url_official: string
  url_affiliate?: string | null
  has_affiliate?: boolean | null
  affiliate_rate?: string | null
  category?: string | null
  tags?: string[] | null
  is_ai?: boolean | null
  pricing_type?: string | null
  pricing_desc?: string | null
  one_liner?: string | null
  one_liner_en?: string | null
  description?: string | null
  description_en?: string | null
  logo_url?: string | null
  featured?: boolean | null
  region?: string | null
  status?: 'draft' | 'published' | string | null
  last_verified?: string | null
}

function mapDefaultCategory(cat: (typeof defaultCategories)[number]): PublicCategory {
  return {
    id: cat.id,
    name: cat.name,
    nameEn: cat.name_en ?? null,
    emoji: cat.emoji ?? null,
    description: cat.description ?? null,
    audience: cat.audience ?? null,
    isAi: cat.is_ai_section ?? true,
    priority: cat.priority ?? 0,
  }
}

function getDefaultLogoUrl(tool: DefaultTool) {
  if (tool.logo_url) return tool.logo_url

  try {
    const host = new URL(tool.url_official).hostname.replace(/^www\./, '')
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`
  } catch {
    return null
  }
}

function mapDefaultTool(tool: DefaultTool): PublicTool {
  return {
    id: tool.id,
    name: tool.name,
    urlOfficial: tool.url_official,
    urlAffiliate: tool.url_affiliate ?? null,
    hasAffiliate: tool.has_affiliate ?? false,
    affiliateRate: tool.affiliate_rate ?? null,
    categoryId: tool.category ?? null,
    tags: tool.tags ?? [],
    isAi: tool.is_ai ?? true,
    pricingType: tool.pricing_type ?? null,
    pricingDesc: tool.pricing_desc ?? null,
    oneLiner: tool.one_liner ?? null,
    oneLinerEn: tool.one_liner_en ?? null,
    description: tool.description ?? null,
    descriptionEn: tool.description_en ?? null,
    logoUrl: getDefaultLogoUrl(tool),
    featured: tool.featured ?? false,
    region: tool.region ?? 'global',
    status: tool.status ?? 'published',
    sortOrder: 0,
    lastVerified: tool.last_verified ?? null,
  }
}

export const fallbackCategories = defaultCategories
  .slice()
  .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
  .map(mapDefaultCategory)

export const fallbackTools = (defaultTools as DefaultTool[]).map(mapDefaultTool)

export const fallbackPublishedTools = fallbackTools.filter(tool => tool.status === 'published')

export function getFallbackHomeData() {
  return {
    categories: fallbackCategories,
    tools: fallbackPublishedTools.slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
  }
}

export function getSearchKeywords(query: string) {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
}

export function matchesToolSearch(tool: Pick<PublicTool, 'name' | 'oneLiner' | 'description' | 'tags'>, keywords: string[]) {
  if (keywords.length === 0) return false

  const searchable = [
    tool.name,
    tool.oneLiner,
    tool.description,
    ...(tool.tags ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return keywords.every(keyword => searchable.includes(keyword))
}

export function getFallbackCategory(id: string) {
  return fallbackCategories.find(category => category.id === id) ?? null
}

export function getFallbackTool(id: string) {
  return fallbackPublishedTools.find(tool => tool.id === id) ?? null
}

export function getFallbackToolsByCategory(categoryId: string) {
  return fallbackPublishedTools.filter(tool => tool.categoryId === categoryId)
}

export function getFallbackRelatedTools(tool: PublicTool, limit = 4) {
  if (!tool.categoryId) return []
  return fallbackPublishedTools
    .filter(item => item.categoryId === tool.categoryId && item.id !== tool.id)
    .slice(0, limit)
}

export function searchFallbackTools(query: string) {
  const keywords = getSearchKeywords(query)
  if (keywords.length === 0) return []

  return fallbackPublishedTools.filter(tool => matchesToolSearch(tool, keywords))
}

export async function withDbTimeout<T>(
  promise: Promise<T>,
  fallback: T,
  label: string,
  timeoutMs = PUBLIC_DB_TIMEOUT_MS,
) {
  const guardedPromise = promise.catch((err) => {
    console.error(`[PublicData] ${label} failed:`, err)
    return fallback
  })

  return Promise.race([
    guardedPromise,
    new Promise<T>((resolve) => {
      setTimeout(() => {
        console.warn(`[PublicData] ${label} timed out after ${timeoutMs}ms, using fallback data.`)
        resolve(fallback)
      }, timeoutMs)
    }),
  ])
}
