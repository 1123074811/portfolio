/**
 * generate-portfolio.mjs
 * ──────────────────────────────────────────────────────────────
 * 拉取 GitHub 公开仓库 → 智能筛选 → DeepSeek 生成中英文案 →
 * 写入 src/data/githubData.json（含 projects / activity / profile）。
 *
 * 运行（本地）：
 *   GITHUB_TOKEN=xxx DEEPSEEK_API_KEY=yyy node scripts/generate-portfolio.mjs
 * 在 CI 里由 .github/workflows/refresh.yml 定时触发。
 *
 * 依赖：Node 20+（用原生 fetch / crypto），零 npm 依赖。
 * 增量缓存：scripts/.cache/ai-cache.json —— 仓库内容未变则复用上次 AI 文案，省钱。
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { siteConfig } from '../src/config/siteConfig.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT = resolve(ROOT, 'src/data/githubData.json')
const CACHE_DIR = resolve(__dirname, '.cache')
const CACHE = resolve(CACHE_DIR, 'ai-cache.json')

const USER = process.env.GITHUB_USERNAME || siteConfig.github.username
const GH_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || ''
const DS_KEY = process.env.DEEPSEEK_API_KEY || ''
const F = siteConfig.github.filter

const CATEGORIES = [
  { zh: 'AI 应用', en: 'AI Apps' },
  { zh: 'Web 全栈', en: 'Fullstack' },
  { zh: '效率工具', en: 'Tools' },
  { zh: '创意实验', en: 'Labs' },
]

// 常见语言配色（GitHub linguist 节选），用于动态板块语言条
const LANG_COLOR = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Vue: '#41b883', Python: '#3572A5',
  Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', C: '#555555', 'C++': '#f34b7d',
  'C#': '#178600', HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', Dart: '#00B4AB',
  Kotlin: '#A97BFF', Swift: '#F05138', PHP: '#4F5D95', Ruby: '#701516', Jupyter: '#DA5B0B',
  SCSS: '#c6538c', Astro: '#ff5a03', Svelte: '#ff3e00',
}

function escapeXml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function svgCover(repo, copy, languages, hash) {
  const lang = repo.language || Object.keys(languages)[0] || 'Code'
  const accent = LANG_COLOR[lang] || '#4f46e5'
  const title = escapeXml(copy.title || repo.name)
  const subtitle = escapeXml(copy.subtitle || repo.description || lang)
  const shortHash = escapeXml(hash.slice(0, 6).toUpperCase())
  const stars = Number(repo.stargazers_count || 0)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="52%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#18181b"/>
    </linearGradient>
    <radialGradient id="glow" cx="72%" cy="24%" r="60%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.9"/>
      <stop offset="46%" stop-color="${accent}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0v48" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)"/>
  <rect width="1200" height="900" fill="url(#glow)"/>
  <rect width="1200" height="900" fill="url(#grid)"/>
  <circle cx="1000" cy="155" r="160" fill="${accent}" opacity="0.2"/>
  <circle cx="1080" cy="720" r="240" fill="${accent}" opacity="0.12"/>
  <path d="M160 690 C340 570 480 800 670 635 C820 505 900 555 1040 420" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round" opacity="0.75"/>
  <rect x="96" y="90" width="1008" height="720" rx="34" fill="#020617" opacity="0.58" stroke="#ffffff" stroke-opacity="0.12"/>
  <text x="140" y="165" fill="${accent}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="28" font-weight="700">${escapeXml(lang)} / ${shortHash}</text>
  <text x="140" y="395" fill="#f8fafc" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="76" font-weight="800">${title}</text>
  <text x="144" y="475" fill="#cbd5e1" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="30" font-weight="500">${subtitle}</text>
  <text x="144" y="705" fill="#94a3b8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="26">github.com/${escapeXml(USER)}/${escapeXml(repo.name)}</text>
  <text x="930" y="705" fill="#e2e8f0" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="26" text-anchor="end">★ ${stars}</text>
</svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

/* ───────── GitHub API ───────── */
const ghHeaders = {
  'Accept': 'application/vnd.github+json',
  'User-Agent': 'portfolio-generator',
  ...(GH_TOKEN ? { Authorization: `Bearer ${GH_TOKEN}` } : {}),
}
async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers: ghHeaders })
  if (!res.ok) throw new Error(`GitHub ${path} → ${res.status} ${res.statusText}`)
  return res.json()
}
async function ghText(path, accept) {
  const res = await fetch(`https://api.github.com${path}`, { headers: { ...ghHeaders, Accept: accept } })
  if (!res.ok) return ''
  return res.text()
}

/* ───────── DeepSeek 文案生成 ───────── */
async function deepseek(repo, readme, languages, topics) {
  if (!DS_KEY) return null // 没配 key → 退回仓库原始信息
  const sys = `你是资深技术作品集文案撰稿人。基于给定 GitHub 仓库信息，输出一份打磨过的中英双语项目介绍。
严格输出 JSON（不要解释），字段：
{
 "title": "中文项目名（简短有力，可与仓库名不同）",
 "titleEn": "English project name",
 "subtitle": "一句话中文副标题（讲清楚它是什么）",
 "subtitleEn": "one-line English subtitle",
 "category": "从这四个里选一个最贴切：AI 应用 / Web 全栈 / 效率工具 / 创意实验",
 "description": "2-3 句中文项目描述，专业、具体、不浮夸",
 "descriptionEn": "2-3 sentence English description",
 "features": ["3 条中文核心功能"],
 "featuresEn": ["3 English core features"],
 "highlights": ["2-3 条中文技术亮点/工程难点"],
 "highlightsEn": ["2-3 English technical highlights"]
}
要求：基于真实仓库内容，不编造不存在的功能；信息不足时写得克制而非夸大。`
  const user = `仓库名：${repo.name}
描述：${repo.description || '（无）'}
主语言：${Object.keys(languages)[0] || '未知'}
全部语言：${Object.keys(languages).join(', ') || '未知'}
Topics：${topics.join(', ') || '（无）'}
Stars：${repo.stargazers_count}
主页：${repo.homepage || '（无）'}
README（截断）：
${(readme || '（无 README）').slice(0, 4000)}`

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DS_KEY}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: sys }, { role: 'user', content: user }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    }),
  })
  if (!res.ok) { console.warn(`  ⚠ DeepSeek ${repo.name} → ${res.status}`); return null }
  const data = await res.json()
  try { return JSON.parse(data.choices[0].message.content) } catch { return null }
}

/* ───────── 兜底文案（无 AI / AI 失败时）───────── */
function fallbackCopy(repo, languages, topics) {
  const guessCat = topics.includes('ai') || /ai|llm|gpt|rag|agent/i.test(repo.name + repo.description)
    ? 'AI 应用'
    : (/cli|tool|util/i.test(repo.name) ? '效率工具' : 'Web 全栈')
  return {
    title: repo.name, titleEn: repo.name,
    subtitle: repo.description || '一个开源项目', subtitleEn: repo.description || 'An open-source project',
    category: guessCat,
    description: repo.description || '该项目的详细介绍待补充。', descriptionEn: repo.description || 'Description coming soon.',
    features: [], featuresEn: [], highlights: [], highlightsEn: [],
  }
}

/* ───────── 缓存 ───────── */
async function loadCache() { try { return JSON.parse(await readFile(CACHE, 'utf8')) } catch { return {} } }
function repoHash(repo, readme) { return createHash('sha1').update(repo.pushed_at + '|' + (readme || '')).digest('hex').slice(0, 16) }

/* ───────── 主流程 ───────── */
async function main() {
  console.log(`▶ 拉取 GitHub 用户：${USER}`)
  if (USER === 'vibe-coder') console.warn('⚠ username 还是占位符 vibe-coder，请在 src/config/siteConfig.js 填真实登录名')

  const profile = await gh(`/users/${USER}`)
  let repos = await gh(`/users/${USER}/repos?per_page=100&sort=pushed&type=owner`)

  // 智能筛选
  repos = repos.filter(r => {
    if (F.excludeForks && r.fork) return false
    if (F.excludeArchived && r.archived) return false
    if (F.excludeRepos.includes(r.name)) return false
    if (F.includeTopics.length && !F.includeTopics.some(t => (r.topics || []).includes(t))) return false
    return true
  })
  // 排序：star 优先，其次最近活跃
  repos.sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)))

  const cache = await loadCache()
  const newCache = {}
  const langTotals = {}
  let totalStars = 0
  const projects = []
  const selected = repos.slice(0, F.maxProjects * 2) // 多取一些，README 过滤后再截断

  for (const repo of selected) {
    if (projects.length >= F.maxProjects) break
    const languages = await gh(`/repos/${USER}/${repo.name}/languages`).catch(() => ({}))
    const readme = await ghText(`/repos/${USER}/${repo.name}/readme`, 'application/vnd.github.raw')
    if (F.requireDescriptionOrReadme && !repo.description && !readme) continue

    totalStars += repo.stargazers_count
    for (const [lang, bytes] of Object.entries(languages)) langTotals[lang] = (langTotals[lang] || 0) + bytes

    const topics = repo.topics || []
    const hash = repoHash(repo, readme)
    let copy
    if (cache[repo.full_name]?.hash === hash) {
      copy = cache[repo.full_name].copy
      console.log(`  ✓ ${repo.name}（缓存命中）`)
    } else {
      console.log(`  ⟳ ${repo.name}（生成文案…）`)
      copy = await deepseek(repo, readme, languages, topics) || fallbackCopy(repo, languages, topics)
    }
    newCache[repo.full_name] = { hash, copy }

    const catEn = (CATEGORIES.find(c => c.zh === copy.category) || CATEGORIES[1]).en
    projects.push({
      id: repo.name.toLowerCase(),
      title: copy.title, titleEn: copy.titleEn,
      subtitle: copy.subtitle, subtitleEn: copy.subtitleEn,
      category: copy.category, categoryEn: catEn,
      description: copy.description, descriptionEn: copy.descriptionEn,
      features: copy.features || [], featuresEn: copy.featuresEn || [],
      highlights: copy.highlights || [], highlightsEn: copy.highlightsEn || [],
      techStack: [...Object.keys(languages).slice(0, 4), ...topics.slice(0, 2)].filter(Boolean),
      coverImage: svgCover(repo, copy, languages, hash),
      demoUrl: repo.homepage || '#',
      sourceUrl: repo.html_url,
      status: repo.archived ? '已归档' : '持续迭代', statusEn: repo.archived ? 'Archived' : 'Active',
      year: new Date(repo.pushed_at).getFullYear().toString(),
      stars: repo.stargazers_count,
      language: repo.language || Object.keys(languages)[0] || '',
      topics,
      featured: true,
    })
  }

  // 语言占比（动态板块）
  const totalBytes = Object.values(langTotals).reduce((a, b) => a + b, 0) || 1
  const languages = Object.entries(langTotals)
    .sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([name, bytes]) => ({ name, percent: +(bytes / totalBytes * 100).toFixed(1), color: LANG_COLOR[name] || '#888' }))

  const recent = repos.slice(0, 6).map(r => ({
    name: r.name, url: r.html_url, pushedAt: r.pushed_at,
    language: r.language || '', description: r.description || '', stars: r.stargazers_count,
  }))

  const result = {
    generatedAt: new Date().toISOString(),
    username: USER,
    profile: {
      name: profile.name, login: profile.login, avatar: profile.avatar_url, bio: profile.bio,
      followers: profile.followers, following: profile.following, publicRepos: profile.public_repos,
      htmlUrl: profile.html_url, company: profile.company, location: profile.location, blog: profile.blog,
    },
    activity: { languages, recent, totalStars },
    projects,
  }

  await mkdir(CACHE_DIR, { recursive: true })
  await writeFile(CACHE, JSON.stringify(newCache, null, 2))
  await writeFile(OUT, JSON.stringify(result, null, 2))
  console.log(`✅ 写入 ${OUT}（${projects.length} 个项目）`)
}

main().catch(e => { console.error('❌ 生成失败：', e.message); process.exit(1) })
