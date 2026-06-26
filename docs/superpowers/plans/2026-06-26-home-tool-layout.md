# Home Tool Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the public homepage show every published tool grouped by category, hide affiliate UI from public pages, and broaden search to match tool content and tags with multi-keyword matching.

**Architecture:** Keep the existing Next.js App Router server-rendered pages. Add small shared public-data helpers for fallback home data grouping and search matching, then reuse `ToolCard` across homepage, category pages, and search results without affiliate badges. Do not introduce a search service or new dependency.

**Tech Stack:** Next.js 16, React 19, TypeScript, Drizzle ORM, SQLite/Postgres schemas, Tailwind CSS.

**Execution Constraints:** Do not run `npm run build`, Java project compilation, or automated tests. Use IDE lint diagnostics only after edits. Do not create git commits unless the user explicitly asks.

---

## File Structure

- Modify `lib/public-data.ts`: centralize fallback published tools, home fallback data, and search keyword matcher.
- Modify `components/tool-card.tsx`: remove public affiliate badge rendering while preserving outbound URL and analytics data attributes.
- Create `components/category-tool-sections.tsx`: render homepage category sections and grouped tool cards.
- Modify `app/(public)/page.tsx`: load all published tools, group by category, and render the new homepage sections.
- Modify `app/(public)/category/[slug]/page.tsx`: remove affiliate filter tab and filtering branch.
- Modify `app/(public)/search/page.tsx`: load all published tools and apply shared multi-keyword content matcher.

---

### Task 1: Shared Public Data Helpers

**Files:**
- Modify: `lib/public-data.ts`

- [ ] **Step 1: Add normalized keyword helpers after `fallbackTools`**

Add these helpers below the `fallbackTools` export:

```ts
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
```

- [ ] **Step 2: Replace `searchFallbackTools` internals**

Change `searchFallbackTools` so fallback search uses the same matcher:

```ts
export function searchFallbackTools(query: string) {
  const keywords = getSearchKeywords(query)
  if (keywords.length === 0) return []

  return fallbackPublishedTools.filter(tool => matchesToolSearch(tool, keywords))
}
```

---

### Task 2: Remove Public Affiliate UI

**Files:**
- Modify: `components/tool-card.tsx`
- Modify: `app/(public)/category/[slug]/page.tsx`

- [ ] **Step 1: Simplify `ToolCardProps`**

In `components/tool-card.tsx`, remove `showAffiliateBadge?: boolean` from the props interface and remove the defaulted parameter:

```ts
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
}

export function ToolCard({ tool, categoryName }: ToolCardProps) {
```

- [ ] **Step 2: Remove the visible affiliate badge block**

Delete this block from `ToolCard`:

```tsx
{showAffiliateBadge && tool.hasAffiliate && (
  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
    含联盟链接
  </span>
)}
```

Keep `visitUrl`, `data-has-affiliate`, and the `affiliate-link` class unchanged.

- [ ] **Step 3: Remove the category page affiliate filter**

In `app/(public)/category/[slug]/page.tsx`, remove the affiliate branch:

```ts
if (filter === 'affiliate') return t.hasAffiliate
```

Then change `filterTabs` to:

```ts
const filterTabs = [
  { key: '', label: '全部' },
  { key: 'free', label: '免费' },
  { key: 'paid', label: '付费/Freemium' },
]
```

---

### Task 3: Homepage Category Tool Sections

**Files:**
- Create: `components/category-tool-sections.tsx`
- Modify: `app/(public)/page.tsx`

- [ ] **Step 1: Create `CategoryToolSections`**

Create `components/category-tool-sections.tsx`:

```tsx
import { ToolCard } from './tool-card'
import type { PublicCategory, PublicTool } from '@/lib/public-data'

type CategoryWithTools = {
  category: PublicCategory
  tools: PublicTool[]
}

export function CategoryToolSections({ sections }: { sections: CategoryWithTools[] }) {
  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-wrap gap-2">
          {sections.map(({ category, tools }) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:border-green-400 hover:text-green-600"
            >
              {category.emoji} {category.name} · {tools.length}
            </a>
          ))}
        </div>

        {sections.map(({ category, tools }) => (
          <div key={category.id} id={category.id} className="scroll-mt-20">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {category.emoji} {category.name}
                </h2>
                {category.description && (
                  <p className="mt-1 max-w-2xl text-sm text-slate-500">{category.description}</p>
                )}
              </div>
              <a href={`/category/${category.id}`} className="text-sm font-semibold text-green-600 hover:text-green-700">
                查看分类页 →
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tools.map(tool => (
                <ToolCard key={tool.id} tool={tool} categoryName={category.name} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Replace homepage data shape**

In `app/(public)/page.tsx`, replace local `DefaultTool` mapping and fallback helpers with imports from `lib/public-data.ts`:

```ts
import { Hero } from '@/components/hero'
import { CategoryToolSections } from '@/components/category-tool-sections'
import { getFallbackHomeData } from '@/lib/public-data'
```

Remove imports for `CategoryGrid`, `FeaturedTools`, `defaultCategories`, and `defaultTools`.

- [ ] **Step 3: Update database home query**

Change `getDatabaseHomeData()` to return categories and all published tools:

```ts
async function getDatabaseHomeData() {
  const schema = getSchema()

  const [categories, tools] = await Promise.all([
    (db as any).select().from(schema.categories).orderBy(schema.categories.priority),
    (db as any).select().from(schema.tools)
      .where(eq(schema.tools.status, 'published'))
      .orderBy(schema.tools.sortOrder),
  ])

  return { categories, tools }
}
```

- [ ] **Step 4: Update timeout fallback type**

In `getHomeData()`, use `getFallbackHomeData()` as the fallback:

```ts
return await Promise.race([
  getDatabaseHomeData(),
  new Promise<ReturnType<typeof getFallbackHomeData>>((resolve) => {
    timeout = setTimeout(() => resolve(getFallbackHomeData()), HOME_DB_TIMEOUT_MS)
  }),
])
```

In the catch block:

```ts
return getFallbackHomeData()
```

- [ ] **Step 5: Render grouped sections on homepage**

Replace the current `HomePage` body with:

```tsx
export default async function HomePage() {
  const { categories, tools } = await getHomeData()

  const sections = categories
    .map((category: any) => ({
      category,
      tools: (tools as any[]).filter(tool => tool.categoryId === category.id),
    }))
    .filter(section => section.tools.length > 0)

  return (
    <>
      <Hero toolCount={tools.length} />
      <CategoryToolSections sections={sections} />
    </>
  )
}
```

---

### Task 4: Search Page Multi-Keyword Content Matching

**Files:**
- Modify: `app/(public)/search/page.tsx`

- [ ] **Step 1: Update imports**

Replace the Drizzle search operator import:

```ts
import { eq } from 'drizzle-orm'
```

Replace public-data imports:

```ts
import {
  getSearchKeywords,
  matchesToolSearch,
  searchFallbackTools,
  withDbTimeout,
} from '@/lib/public-data'
```

- [ ] **Step 2: Load all published tools before filtering**

Replace the `tools` query block with:

```ts
const keywords = getSearchKeywords(q)

const allTools = keywords.length > 0
  ? await withDbTimeout(
      (db as any).select().from(schema.tools).where(eq(schema.tools.status, 'published')),
      searchFallbackTools(q),
      `search ${q}`,
    )
  : []

const tools = keywords.length > 0
  ? (allTools as any[]).filter(tool => matchesToolSearch(tool, keywords))
  : []
```

- [ ] **Step 3: Keep existing result UI**

Leave the existing result count, grid, and empty-state UI unchanged. It will now reflect the filtered `tools` array.

---

### Task 5: Final Diagnostics

**Files:**
- Read lints for:
  - `lib/public-data.ts`
  - `components/tool-card.tsx`
  - `components/category-tool-sections.tsx`
  - `app/(public)/page.tsx`
  - `app/(public)/category/[slug]/page.tsx`
  - `app/(public)/search/page.tsx`

- [ ] **Step 1: Run IDE lint diagnostics only**

Use Cursor lint diagnostics for the changed files. Do not run `npm run lint`, `npm run build`, `npm test`, or any compile command.

- [ ] **Step 2: Fix introduced TypeScript or lint issues**

If diagnostics point to introduced issues, fix them directly in the touched files. Existing unrelated diagnostics should be left alone.

- [ ] **Step 3: Manual verification checklist for the user**

Report these manual checks to the user:

- Home page shows grouped category sections with all published tools.
- Tool cards no longer show “含联盟链接”.
- Category page no longer has “有 Affiliate”.
- Search can find tools by name, tag, one-line summary, or description.
- Multi-keyword search requires every keyword to match somewhere in the tool content.
