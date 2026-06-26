import fs from 'fs'
import path from 'path'

type Tool = {
  id: string
  name: string
  url_official: string
  logo_url?: string | null
}

type IconResult = {
  source: 'simple-icons' | 'google'
  path: string
}

const toolsPath = path.join(process.cwd(), 'data', 'tools.json')
const logoDir = path.join(process.cwd(), 'public', 'logos')
const force = process.argv.includes('--force')

const simpleIconAliases: Record<string, string[]> = {
  chatgpt: ['openai'],
  claude: ['claude', 'anthropic'],
  gemini: ['googlegemini', 'google'],
  grok: ['x', 'xai'],
  'adobe-firefly': ['adobe'],
  'remove-bg': ['removebg'],
  'notion-ai': ['notion'],
  'jasper-ai': ['jasper'],
  'copy-ai': ['copydotai'],
  'opus-clip': ['opusclip'],
  'github-copilot': ['githubcopilot', 'github'],
  windsurf: ['codeium'],
  v0: ['vercel'],
  'bolt-new': ['bolt'],
  'lemon-squeezy': ['lemonsqueezy'],
  'nomad-list': ['nomadlist'],
  'we-work-remotely': ['weworkremotely'],
  'indie-hackers': ['indiehackers'],
  'product-hunt': ['producthunt'],
  'hacker-news': ['ycombinator', 'hackernoon'],
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, 'plus')
    .replace(/\./g, 'dot')
    .replace(/[^a-z0-9]/g, '')
}

function getHost(url: string) {
  return new URL(url).hostname.replace(/^www\./, '')
}

function getGoogleFaviconUrl(tool: Tool) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(getHost(tool.url_official))}&sz=128`
}

function getSimpleIconCandidates(tool: Tool) {
  const host = getHost(tool.url_official)
  const domainName = host.split('.')[0]
  const candidates = [
    ...(simpleIconAliases[tool.id] ?? []),
    tool.id,
    tool.name,
    domainName,
    host,
  ].map(slugify)

  return [...new Set(candidates.filter(Boolean))]
}

async function fetchWithTimeout(url: string, timeoutMs = 8000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { 'user-agent': 'ai-nomad-toolkit-icon-downloader' },
    })
  } finally {
    clearTimeout(timeout)
  }
}

async function downloadSimpleIcon(tool: Tool): Promise<IconResult | null> {
  for (const slug of getSimpleIconCandidates(tool)) {
    const url = `https://cdn.simpleicons.org/${slug}`
    const response = await fetchWithTimeout(url).catch(() => null)
    if (!response?.ok) continue

    const text = await response.text()
    if (!text.includes('<svg')) continue

    const localPath = path.join(logoDir, `${tool.id}.svg`)
    fs.writeFileSync(localPath, text)
    return { source: 'simple-icons', path: `/logos/${tool.id}.svg` }
  }

  return null
}

async function downloadGoogleFavicon(tool: Tool): Promise<IconResult | null> {
  const response = await fetchWithTimeout(getGoogleFaviconUrl(tool)).catch(() => null)
  if (!response?.ok) return null

  const buffer = Buffer.from(await response.arrayBuffer())
  if (buffer.length === 0) return null

  const localPath = path.join(logoDir, `${tool.id}.png`)
  fs.writeFileSync(localPath, buffer)
  return { source: 'google', path: `/logos/${tool.id}.png` }
}

async function downloadIcon(tool: Tool) {
  return await downloadSimpleIcon(tool) ?? await downloadGoogleFavicon(tool)
}

async function main() {
  const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf-8')) as Tool[]
  fs.mkdirSync(logoDir, { recursive: true })

  const stats = {
    simpleIcons: 0,
    google: 0,
    skipped: 0,
    failed: 0,
  }

  for (const tool of tools) {
    if (!force && tool.logo_url?.startsWith('/logos/')) {
      stats.skipped++
      continue
    }

    const result = await downloadIcon(tool)
    if (!result) {
      tool.logo_url = getGoogleFaviconUrl(tool)
      stats.failed++
      console.warn(`[icons] fallback url only: ${tool.id}`)
      continue
    }

    tool.logo_url = result.path
    if (result.source === 'simple-icons') stats.simpleIcons++
    if (result.source === 'google') stats.google++
    console.log(`[icons] ${tool.id}: ${result.source} -> ${result.path}`)
  }

  fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2) + '\n')
  console.log(`[icons] done ${JSON.stringify(stats)}`)
}

main().catch((err) => {
  console.error('[icons] failed:', err)
  process.exit(1)
})
