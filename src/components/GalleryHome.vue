<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { projects, personalInfo, githubActivity, githubProfile, githubGeneratedAt } from '../data/portfolio'
import { locale, toggleLocale } from '../data/locale'

const info = personalInfo
const activity = githubActivity
const githubProfileSafe = githubProfile || { publicRepos: 0, followers: 0 }
const resumePdfUrl = `${import.meta.env.BASE_URL}resume.pdf`
const fmtDate = (s) => new Date(s).toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })

/* ── 多语言取值助手 ── */
const L = (p, key) => (locale.value === 'zh' ? p[key] : (p[key + 'En'] ?? p[key]))
const shortName = (p) => L(p, 'title').split(/\s*[-—–]\s*/)[0].trim()
const cat = (p) => L(p, 'category')
const sub = (p) => L(p, 'subtitle')

/* ── 画廊布局状态 ── */
const stageRef = ref(null)
const driftRef = ref(null)
const cells = ref([])
const gridStyle = ref({})
const DRIFT_SEC = 90

/* 鼠标控制 + 自动漂移共享状态 */
const drag = { hovering: false, dragging: false, dragged: false, dx: 1, dy: 1 }
const offset = { x: 0, y: 0 }      // 当前位移
const vel = { x: 0, y: 0 }         // 用户惯性速度（滚轮/拖拽松手）
let lastMove = { x: 0, y: 0 }      // 拖拽最近一帧位移（用于松手甩动）
let vx = 0, vy = 0, raf = 0, lastT = 0, lastPt = { x: 0, y: 0 }
let downCardIndex = null
const FRICTION = 0.92              // 惯性摩擦：越大滑得越久
const WHEEL_GAIN = 0.12            // 滚轮力度
const MAX_V = 48                   // 速度上限，防止甩飞
const wrap = (v, p) => { v %= p; return v > 0 ? v - p : v } // 无缝循环：保持在 (-p, 0]
const clamp = (v, m) => Math.max(-m, Math.min(m, v))
const clearSelection = () => window.getSelection?.()?.removeAllRanges?.()

/* mulberry32 洗牌（照搬 deck_index.html） */
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
function shuffledRange(n, seed) { const rnd = mulberry32(seed); const a = Array.from({ length: n }, (_, i) => i); for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a }

/* buildGallery：dx/dy 对角无缝漂移（照搬 deck_index.html） */
function buildGallery() {
  const n = projects.length
  if (!n) return
  const vw = innerWidth, vh = innerHeight, gap = 18
  const cardW = vw < 700 ? 250 : 360
  const cardH = cardW * 3 / 4 // 卡片 4:3
  const cellW = cardW + gap, cellH = cardH + gap
  const visCols = Math.ceil(vw / cellW), visRows = Math.ceil(vh / cellH)
  const tileCols = visCols + 1
  const tileRows = Math.max(visRows + 1, Math.ceil(n / tileCols))
  const tileCells = tileCols * tileRows
  const perm = shuffledRange(n, 0x9e3779b9)
  const tilePage = new Array(tileCells)
  for (let k = 0; k < tileCells; k++) tilePage[k] = perm[k % n]

  const cols = tileCols * 2, rows = tileRows * 2 // 2× tile 保证无缝
  drag.dx = tileCols * cellW
  drag.dy = tileRows * cellH
  vx = drag.dx / DRIFT_SEC // 自动漂移速度（px/秒），方向沿对角
  vy = drag.dy / DRIFT_SEC
  gridStyle.value = {
    gridTemplateColumns: `repeat(${cols}, ${cardW}px)`,
    gridAutoRows: cardH + 'px',
    gap: gap + 'px',
  }
  const out = []
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const idx = tilePage[(r % tileRows) * tileCols + (c % tileCols)]
      out.push({ key: r + '-' + c, idx })
    }
  cells.value = out
}

/* ── 弹层 ── */
const selected = ref(null)
const showContact = ref(false)
const showActivity = ref(false)
const showWorks = ref(false)
const cleanUrl = (u) => u && u !== '#' && u !== ''

function openProject(project) {
  selected.value = project
  showWorks.value = false
}
function onKey(e) {
  if (e.key === 'Escape') {
    selected.value = null
    showContact.value = false
    showActivity.value = false
    showWorks.value = false
  }
}
let rT
function onResize() { clearTimeout(rT); rT = setTimeout(buildGallery, 140) }

/* rAF：自动对角漂移（鼠标移入则暂停）+ 惯性滑行 + 无缝 wrap */
function loop(t) {
  const dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 0
  lastT = t
  const idle = Math.abs(vel.x) < 0.05 && Math.abs(vel.y) < 0.05
  // 自动漂移：鼠标不在画廊、未拖拽、且无惯性时
  if (!drag.hovering && !drag.dragging && idle) { offset.x -= vx * dt; offset.y -= vy * dt }
  // 用户惯性：滚轮/拖拽松手后带摩擦地滑行（把离散滚轮变连续）
  if (!drag.dragging) {
    offset.x += vel.x; offset.y += vel.y
    vel.x *= FRICTION; vel.y *= FRICTION
    if (Math.abs(vel.x) < 0.05) vel.x = 0
    if (Math.abs(vel.y) < 0.05) vel.y = 0
  }
  offset.x = wrap(offset.x, drag.dx)
  offset.y = wrap(offset.y, drag.dy)
  if (driftRef.value) driftRef.value.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0)`
  raf = requestAnimationFrame(loop)
}
function onEnter() { drag.hovering = true }
function onLeave() { drag.hovering = false; drag.dragging = false; if (stageRef.value) stageRef.value.style.cursor = 'grab' }
function onDown(e) {
  e.preventDefault()
  e.currentTarget?.setPointerCapture?.(e.pointerId)
  clearSelection()
  downCardIndex = e.target?.closest?.('.card')?.dataset.projectIndex ?? null
  drag.dragging = true; drag.dragged = false
  vel.x = vel.y = 0 // 抓住即停
  lastPt = { x: e.clientX, y: e.clientY }; lastMove = { x: 0, y: 0 }
  if (stageRef.value) stageRef.value.style.cursor = 'grabbing'
}
function onMove(e) {
  if (!drag.dragging) return
  clearSelection()
  const ddx = e.clientX - lastPt.x, ddy = e.clientY - lastPt.y
  lastPt = { x: e.clientX, y: e.clientY }
  lastMove = { x: ddx, y: ddy }
  if (Math.abs(ddx) + Math.abs(ddy) > 4) drag.dragged = true // 区分拖拽与点击
  offset.x += ddx; offset.y += ddy // 拖拽 1:1 直接跟手
}
function onUp() {
  if (drag.dragging) { vel.x = clamp(lastMove.x, MAX_V); vel.y = clamp(lastMove.y, MAX_V) } // 松手甩动
  if (drag.dragging && !drag.dragged && downCardIndex !== null) {
    const project = projects[Number(downCardIndex)]
    if (project) openProject(project)
  }
  downCardIndex = null
  drag.dragging = false
  if (stageRef.value) stageRef.value.style.cursor = 'grab'
}
function onWheel(e) {
  e.preventDefault(); drag.hovering = true
  // 归一化不同滚动单位（行/页 → 像素）
  let dx = e.deltaX, dy = e.deltaY
  if (e.deltaMode === 1) { dx *= 16; dy *= 16 } else if (e.deltaMode === 2) { dx *= innerWidth; dy *= innerHeight }
  // 合并成单一滚动量，投影到对角方向（与自动漂移同向）
  const d = dy + dx
  const len = Math.hypot(drag.dx, drag.dy) || 1
  const s = d * WHEEL_GAIN
  vel.x -= s * (drag.dx / len)
  vel.y -= s * (drag.dy / len)
  // 按合速度限速（保持方向不被单轴裁切扭曲）
  const m = Math.hypot(vel.x, vel.y)
  if (m > MAX_V) { vel.x = vel.x / m * MAX_V; vel.y = vel.y / m * MAX_V }
}

onMounted(() => {
  buildGallery()
  const el = stageRef.value
  el.addEventListener('pointerenter', onEnter)
  el.addEventListener('pointerleave', onLeave)
  el.addEventListener('pointerdown', onDown)
  el.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('resize', onResize)
  window.addEventListener('keydown', onKey)
  raf = requestAnimationFrame(loop)
})
onUnmounted(() => {
  cancelAnimationFrame(raf)
  const el = stageRef.value
  if (el) {
    el.removeEventListener('pointerenter', onEnter)
    el.removeEventListener('pointerleave', onLeave)
    el.removeEventListener('pointerdown', onDown)
    el.removeEventListener('wheel', onWheel)
  }
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', onKey)
  clearTimeout(rT)
})
</script>

<template>
  <div class="gallery-root">
    <div id="ov-gallery" ref="stageRef">
      <div class="stage3d">
        <div class="breathe">
          <div class="drift-layer" ref="driftRef">
            <div class="gallery" :style="gridStyle">
              <div
                v-for="cell in cells"
                :key="cell.key"
                class="card"
                :data-project-index="cell.idx"
              >
                <div class="cover" :style="{ backgroundImage: `url('${projects[cell.idx].coverImage}')` }">
                  <span class="badge">{{ cat(projects[cell.idx]) }}</span>
                  <span class="yb">{{ projects[cell.idx].year }}</span>
                </div>
                <div class="meta">
                  <div class="ttl">{{ shortName(projects[cell.idx]) }}</div>
                  <div class="sub">{{ sub(projects[cell.idx]) }}</div>
                  <div class="chips">
                    <span v-for="t in projects[cell.idx].techStack.slice(0, 3)" :key="t">{{ t }}</span>
                  </div>
                </div>
                <div class="num">{{ cell.idx + 1 }} · {{ shortName(projects[cell.idx]) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="vignette"></div>

    <!-- 浮层 UI -->
    <div class="top-brand">
      <div class="nm">Vibe<b>Coder</b> · {{ info.englishName }}</div>
      <div class="rl">{{ locale === 'zh' ? info.title : info.titleEn }}</div>
    </div>
    <div class="overview-title">Infinite Gallery · {{ locale === 'zh' ? '拖拽平移 · 滚轮滚动 · 点击查看详情' : 'Drag · Scroll · Click any card' }}</div>
    <div class="corner-meta">
      {{ projects.length.toString().padStart(2, '0') }} PROJECTS · 2024—2026<br />READY FOR INTERVIEW
    </div>
    <button class="lang" @click="toggleLocale">{{ locale === 'zh' ? '中 / EN' : 'EN / 中' }}</button>
    <button v-if="activity" class="ghbtn" @click="showActivity = true">
      <span class="gdot"></span>{{ locale === 'zh' ? 'GitHub 动态' : 'GitHub Activity' }}
    </button>

    <button class="left-cta" @click="showContact = true">
      {{ locale === 'zh' ? '联系我 · 下载简历' : 'Contact · Resume' }}
    </button>
    <button class="start-btn" @click="showWorks = true">
      ▶ {{ locale === 'zh' ? '查看作品' : 'View Work' }}
    </button>

    <!-- 作品列表弹层 -->
    <Transition name="fade">
      <div v-if="showWorks" class="modal" @click.self="showWorks = false">
        <div class="works-panel">
          <button class="x" @click="showWorks = false">×</button>
          <div class="pc">{{ locale === 'zh' ? '全部作品' : 'All Works' }}</div>
          <h2>{{ locale === 'zh' ? '作品列表' : 'Project Index' }}</h2>
          <div class="works-list">
            <button
              v-for="(project, i) in projects"
              :key="project.id || project.title"
              class="work-row"
              @click="openProject(project)"
            >
              <span class="work-no">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="work-main">
                <b>{{ shortName(project) }}</b>
                <small>{{ cat(project) }} · {{ project.year }} · {{ sub(project) }}</small>
              </span>
              <span class="work-tech">{{ project.techStack.slice(0, 2).join(' / ') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 项目详情弹层 -->
    <Transition name="fade">
      <div v-if="selected" class="modal" @click.self="selected = null">
        <div class="panel">
          <button class="x" @click="selected = null">×</button>
          <div class="panel-cover" :style="{ backgroundImage: `url('${selected.coverImage}')` }"></div>
          <div class="panel-body">
            <div class="pc">{{ cat(selected) }} · {{ selected.year }} · {{ L(selected, 'status') }}</div>
            <h2>{{ shortName(selected) }}</h2>
            <div class="psub">{{ sub(selected) }}</div>
            <p class="desc">{{ L(selected, 'description') }}</p>

            <h4>{{ locale === 'zh' ? '核心亮点' : 'Highlights' }}</h4>
            <ul>
              <li v-for="(h, i) in L(selected, 'highlights')" :key="i">{{ h }}</li>
            </ul>

            <h4>{{ locale === 'zh' ? '技术栈' : 'Tech Stack' }}</h4>
            <div class="stk"><span v-for="t in selected.techStack" :key="t">{{ t }}</span></div>

            <div class="actions">
              <a v-if="cleanUrl(selected.demoUrl)" :href="selected.demoUrl" target="_blank" class="act primary">
                {{ locale === 'zh' ? '在线预览 ↗' : 'Live Demo ↗' }}
              </a>
              <a v-if="cleanUrl(selected.sourceUrl)" :href="selected.sourceUrl" target="_blank" class="act ghost">
                {{ locale === 'zh' ? '查看源码' : 'Source' }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 联系弹层 -->
    <Transition name="fade">
      <div v-if="showContact" class="modal" @click.self="showContact = false">
        <div class="contact-card">
          <div class="pc">LET'S TALK</div>
          <div class="ct-title">
            {{ locale === 'zh' ? '正在寻找 AI 应用 / 全栈 / 后端方向的实习机会' : 'Open to AI / Fullstack / Backend internships' }}
          </div>
          <div class="ct-actions">
            <a :href="resumePdfUrl" download="欧劲聪-简历.pdf" class="resume-download">
              <span>{{ locale === 'zh' ? '下载 PDF 简历' : 'Download PDF Resume' }}</span>
              <b>PDF</b>
            </a>
            <a :href="resumePdfUrl" target="_blank" class="resume-preview">
              {{ locale === 'zh' ? '在线查看简历' : 'Preview resume' }}
            </a>
          </div>
          <div class="ct-links">
            <a :href="`mailto:${info.email}`"><span>EMAIL</span>{{ info.email }}</a>
            <a :href="info.github" target="_blank"><span>GITHUB</span>{{ info.github.replace('https://', '') }}</a>
            <a :href="info.blog" target="_blank"><span>BLOG</span>{{ info.blog.replace('https://', '') }}</a>
          </div>
        </div>
      </div>
    </Transition>

    <!-- GitHub 实时动态弹层 -->
    <Transition name="fade">
      <div v-if="showActivity && activity" class="modal" @click.self="showActivity = false">
        <div class="panel act-panel">
          <button class="x" @click="showActivity = false">×</button>
          <div class="panel-body">
            <div class="pc">GITHUB · {{ locale === 'zh' ? '实时动态' : 'LIVE ACTIVITY' }}</div>
            <h2 style="margin-bottom:14px">{{ locale === 'zh' ? '此刻的开源足迹' : 'Open-source footprint' }}</h2>

            <div class="gstats">
              <div class="gs"><b>{{ githubProfileSafe.publicRepos }}</b><span>{{ locale === 'zh' ? '公开仓库' : 'Repos' }}</span></div>
              <div class="gs"><b>{{ githubProfileSafe.followers }}</b><span>Followers</span></div>
              <div class="gs"><b>{{ activity.totalStars }}</b><span>{{ locale === 'zh' ? '收获 Star' : 'Stars' }}</span></div>
            </div>

            <h4>{{ locale === 'zh' ? '语言占比' : 'Languages' }}</h4>
            <div class="langbar">
              <div v-for="l in activity.languages" :key="l.name" class="seg"
                   :style="{ width: l.percent + '%', background: l.color }" :title="`${l.name} ${l.percent}%`"></div>
            </div>
            <div class="langlegend">
              <span v-for="l in activity.languages" :key="l.name"><i :style="{ background: l.color }"></i>{{ l.name }} {{ l.percent }}%</span>
            </div>

            <h4>{{ locale === 'zh' ? '最近活跃' : 'Recent' }}</h4>
            <ul class="recent">
              <li v-for="r in activity.recent" :key="r.name">
                <a :href="r.url" target="_blank">
                  <span class="rn">{{ r.name }}</span>
                  <span class="rl" v-if="r.language"><i :style="{ background: activity.languages.find(x=>x.name===r.language)?.color || '#888' }"></i>{{ r.language }}</span>
                  <span class="rd">{{ fmtDate(r.pushedAt) }}</span>
                </a>
              </li>
            </ul>
            <div v-if="githubGeneratedAt" class="gupdated">{{ locale === 'zh' ? '数据更新于 ' : 'Updated ' }}{{ fmtDate(githubGeneratedAt) }}</div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.gallery-root {
  --serif: 'Fraunces', Georgia, 'Times New Roman', serif;
  --sans: 'Inter', system-ui, sans-serif;
  --mono: 'IBM Plex Mono', ui-monospace, 'SF Mono', monospace;
  position: fixed; inset: 0; overflow: hidden;
  font-family: var(--sans); background: #0a0805; color: #f4eee0;
  -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;
}

/* ════ 无限画廊（照搬 deck_index.html 机制）════ */
#ov-gallery {
  position: absolute; inset: 0; overflow: hidden;
  perspective: 2200px; perspective-origin: 50% 42%;
  background: radial-gradient(130% 120% at 50% 38%, #1b1610, #0a0805 82%);
  cursor: grab; touch-action: none; /* 支持拖拽平移 */
}
#ov-gallery, #ov-gallery * {
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
}
.stage3d {
  --rx: 18; --rz: 9; position: absolute; inset: 0; transform-style: preserve-3d;
  transform: scale(1.22) rotateX(18deg) rotateZ(-9deg); transform-origin: center center;
}
.breathe { position: absolute; inset: 0; animation: breathe 26s ease-in-out infinite; transform-origin: center center; transform-style: preserve-3d; }
.drift-layer { position: absolute; top: 0; left: 0; will-change: transform; transform-style: preserve-3d; }
.gallery { display: grid; }
@keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.045); } }

.card {
  position: relative; width: 100%; aspect-ratio: 4/3; border-radius: 9px; overflow: hidden;
  background: #f4eee0; cursor: pointer; transform-style: preserve-3d; will-change: transform;
  display: flex; flex-direction: column;
  box-shadow: 0 14px 30px rgba(0, 0, 0, .42), 0 3px 9px rgba(0, 0, 0, .3);
  transition: transform .34s cubic-bezier(.2, .7, .2, 1), box-shadow .34s;
}
.card:hover {
  transform: translateZ(60px) rotateX(calc(var(--rx, 18) * -1deg)) rotateZ(calc(var(--rz, 9) * 1deg)) scale(1.06);
  box-shadow: 0 30px 64px rgba(0, 0, 0, .55), 0 8px 20px rgba(0, 0, 0, .4); z-index: 30;
}
.vignette { position: absolute; inset: 0; pointer-events: none; z-index: 20; box-shadow: inset 0 0 240px 70px rgba(8, 6, 3, .62); }

/* ════ 卡片内容 ════ */
.cover { height: 56%; background-size: cover; background-position: center; background-color: #cabfa8; position: relative; border-bottom: 1px solid #e6dcc8; }
.cover::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20, 16, 12, .18) 0%, transparent 38%); }
.cover .badge { position: absolute; top: 10px; left: 10px; z-index: 2; font-family: var(--mono); font-size: 10px; font-weight: 500; letter-spacing: .08em; color: #fff; background: rgba(20, 16, 12, .55); backdrop-filter: blur(5px); padding: 3px 9px; border-radius: 6px; }
.cover .yb { position: absolute; top: 10px; right: 10px; z-index: 2; font-family: var(--mono); font-size: 10px; color: #fff; background: rgba(20, 16, 12, .45); backdrop-filter: blur(5px); padding: 3px 8px; border-radius: 6px; }
.meta { flex: 1; padding: 11px 16px 14px; display: flex; flex-direction: column; color: #1a1712; min-height: 0; }
.meta .ttl { font-family: var(--serif); font-weight: 600; font-size: 25px; line-height: 1; letter-spacing: -.015em; }
.meta .sub { font-family: var(--serif); font-style: italic; font-size: 12px; line-height: 1.32; color: #6b6354; margin-top: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.meta .chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: auto; padding-top: 9px; }
.meta .chips span { font-family: var(--mono); font-size: 10px; color: #6b6354; border: 1px solid #d3c7b1; padding: 2px 7px; border-radius: 5px; }
.num { position: absolute; bottom: 6px; left: 7px; background: rgba(16, 12, 7, .76); color: #fff; font-size: 11px; line-height: 1; padding: 4px 7px; border-radius: 5px; letter-spacing: .03em; z-index: 3; opacity: 0; transition: opacity .25s; pointer-events: none; max-width: 90%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card:hover .num { opacity: 1; }

/* ════ 浮层 UI ════ */
.overview-title { position: absolute; top: 24px; left: 0; right: 0; text-align: center; font-size: 13px; letter-spacing: .22em; text-transform: uppercase; z-index: 40; pointer-events: none; color: rgba(244, 238, 224, .7); text-shadow: 0 2px 12px rgba(0, 0, 0, .6); }
.top-brand { position: absolute; top: 20px; left: 26px; z-index: 40; pointer-events: none; }
.top-brand .nm { font-family: var(--serif); font-weight: 600; font-size: 18px; letter-spacing: -.01em; }
.top-brand .nm b { color: #e08a5b; font-weight: 600; }
.top-brand .rl { font-family: var(--mono); font-size: 10px; letter-spacing: .06em; color: rgba(244, 238, 224, .45); margin-top: 3px; }
.corner-meta { position: absolute; top: 20px; right: 26px; z-index: 40; pointer-events: none; text-align: right; font-family: var(--mono); font-size: 10px; letter-spacing: .06em; color: rgba(244, 238, 224, .42); line-height: 1.8; }
.lang { position: absolute; top: 58px; right: 26px; z-index: 41; font-family: var(--mono); font-size: 11px; letter-spacing: .04em; color: rgba(244, 238, 224, .7); background: rgba(255, 255, 255, .06); border: 1px solid rgba(244, 238, 224, .18); padding: 5px 11px; border-radius: 999px; cursor: pointer; transition: background .18s; }
.lang:hover { background: rgba(255, 255, 255, .14); }
.start-btn { position: absolute; bottom: 26px; right: 26px; border: 0; padding: 13px 24px; border-radius: 999px; font-size: 15px; font-family: var(--sans); font-weight: 600; letter-spacing: .02em; cursor: pointer; z-index: 60; background: #f4eee0; color: #1a1712; box-shadow: 0 10px 30px rgba(0, 0, 0, .4); transition: transform .18s; }
.start-btn:hover { transform: translateY(-2px); }
.left-cta { position: absolute; bottom: 26px; left: 26px; z-index: 60; border: 1px solid rgba(244, 238, 224, .22); background: rgba(255, 255, 255, .05); backdrop-filter: blur(6px); color: #f4eee0; padding: 13px 22px; border-radius: 999px; font-family: var(--sans); font-weight: 600; font-size: 14px; cursor: pointer; transition: transform .18s; }
.left-cta:hover { transform: translateY(-2px); }

/* ════ 弹层 ════ */
.modal { position: absolute; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; background: rgba(6, 4, 2, .72); backdrop-filter: blur(10px); padding: 24px; }
.panel { position: relative; width: min(680px, 94vw); max-height: 88vh; overflow: auto; background: #f4eee0; color: #1a1712; border-radius: 16px; box-shadow: 0 40px 100px rgba(0, 0, 0, .6); }
.panel-cover { height: 180px; background-size: cover; background-position: center; background-color: #cabfa8; border-radius: 16px 16px 0 0; }
.panel-body { padding: 26px 40px 36px; }
.panel .pc { font-family: var(--mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: #b5612f; }
.panel h2 { font-family: var(--serif); font-weight: 600; font-size: 36px; line-height: 1.04; letter-spacing: -.02em; margin: 8px 0 6px; }
.panel .psub { font-family: var(--serif); font-style: italic; font-size: 16px; color: #6b6354; margin-bottom: 18px; }
.panel p.desc { font-size: 14.5px; line-height: 1.7; color: #3a342b; margin-bottom: 8px; }
.panel h4 { font-family: var(--mono); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: #9b8f78; margin: 18px 0 9px; }
.panel ul { list-style: none; display: flex; flex-direction: column; gap: 7px; margin: 0; padding: 0; }
.panel li { font-size: 14px; line-height: 1.5; color: #3a342b; padding-left: 18px; position: relative; }
.panel li::before { content: "→"; position: absolute; left: 0; color: #c15f3c; }
.panel .stk { display: flex; flex-wrap: wrap; gap: 8px; }
.panel .stk span { font-family: var(--mono); font-size: 12px; color: #5c5448; background: #eae0cc; border: 1px solid #d8cdb8; padding: 4px 10px; border-radius: 6px; }
.panel .actions { display: flex; gap: 12px; margin-top: 24px; }
.act { font-family: var(--sans); font-weight: 600; font-size: 14px; padding: 11px 22px; border-radius: 999px; text-decoration: none; transition: transform .16s; }
.act:hover { transform: translateY(-2px); }
.act.primary { background: #1a1712; color: #f4eee0; }
.act.ghost { background: transparent; color: #1a1712; border: 1px solid #cdbfa6; }
.panel .x { position: absolute; top: 14px; right: 16px; width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, .5); background: rgba(20, 16, 12, .4); backdrop-filter: blur(4px); color: #fff; font-size: 18px; cursor: pointer; line-height: 1; z-index: 3; }
.panel .x:hover { background: rgba(20, 16, 12, .65); }

.works-panel { position: relative; width: min(860px, 94vw); max-height: 86vh; overflow: auto; background: #f4eee0; color: #1a1712; border-radius: 16px; padding: 30px 34px 34px; box-shadow: 0 40px 100px rgba(0, 0, 0, .6); }
.works-panel .x { position: absolute; top: 14px; right: 16px; width: 36px; height: 36px; border-radius: 50%; border: 1px solid #d2c5ad; background: rgba(255, 255, 255, .45); color: #1a1712; font-size: 18px; cursor: pointer; line-height: 1; }
.works-panel .x:hover { background: #eae0cc; }
.works-panel .pc { font-family: var(--mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: #b5612f; }
.works-panel h2 { font-family: var(--serif); font-weight: 600; font-size: 34px; line-height: 1.04; letter-spacing: -.02em; margin: 8px 0 20px; }
.works-list { display: flex; flex-direction: column; border-top: 1px solid #ddd1ba; }
.work-row { width: 100%; display: grid; grid-template-columns: 54px minmax(0, 1fr) minmax(110px, auto); gap: 16px; align-items: center; padding: 15px 0; border: 0; border-bottom: 1px solid #ddd1ba; background: transparent; color: inherit; text-align: left; cursor: pointer; }
.work-row:hover { background: linear-gradient(90deg, rgba(181, 97, 47, .1), transparent 72%); }
.work-no { font-family: var(--mono); font-size: 12px; color: #b5612f; }
.work-main { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.work-main b { font-family: var(--serif); font-size: 22px; font-weight: 600; line-height: 1.05; color: #1a1712; }
.work-main small { font-size: 13px; line-height: 1.35; color: #6b6354; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.work-tech { justify-self: end; max-width: 190px; font-family: var(--mono); font-size: 11px; color: #8b7f68; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.contact-card { width: min(460px, 92vw); background: #f4eee0; color: #1a1712; border-radius: 16px; padding: 34px 38px; text-align: center; }
.contact-card .pc { font-family: var(--mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: #b5612f; margin-bottom: 14px; }
.contact-card .ct-title { font-family: var(--serif); font-size: 26px; font-weight: 600; margin-bottom: 22px; line-height: 1.2; }
.contact-card .ct-actions { display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-bottom: 24px; align-items: center; }
.resume-download {
  min-height: 48px; display: flex; align-items: center; justify-content: space-between; gap: 14px;
  padding: 12px 16px 12px 18px; border-radius: 999px; background: #1a1712; color: #f4eee0;
  text-decoration: none; box-shadow: 0 12px 28px rgba(26, 23, 18, .22); transition: transform .18s, box-shadow .18s;
}
.resume-download:hover { transform: translateY(-2px); box-shadow: 0 16px 34px rgba(26, 23, 18, .28); }
.resume-download span { font-family: var(--sans); font-size: 14px; font-weight: 700; letter-spacing: .01em; }
.resume-download b { font-family: var(--mono); font-size: 11px; color: #1a1712; background: #f4eee0; padding: 5px 8px; border-radius: 999px; }
.resume-preview { font-family: var(--mono); font-size: 11px; color: #b5612f; text-decoration: none; border-bottom: 1px solid rgba(181, 97, 47, .35); white-space: nowrap; }
.resume-preview:hover { color: #8d431f; border-bottom-color: currentColor; }
.contact-card .ct-links { font-family: var(--mono); font-size: 14px; display: flex; flex-direction: column; gap: 12px; text-align: left; }
.contact-card .ct-links a { color: #b5612f; display: flex; justify-content: space-between; text-decoration: none; }
.contact-card .ct-links a span { color: #9b8f78; }

/* ════ GitHub 动态按钮 + 板块 ════ */
.ghbtn { position: absolute; top: 90px; right: 26px; z-index: 41; display: flex; align-items: center; gap: 7px; font-family: var(--mono); font-size: 11px; letter-spacing: .04em; color: rgba(244, 238, 224, .8); background: rgba(255, 255, 255, .06); border: 1px solid rgba(244, 238, 224, .18); padding: 6px 12px; border-radius: 999px; cursor: pointer; transition: background .18s; }
.ghbtn:hover { background: rgba(255, 255, 255, .14); }
.gdot { width: 7px; height: 7px; border-radius: 50%; background: #3fb950; box-shadow: 0 0 8px #3fb950; }
.act-panel .panel-body { padding-top: 30px; }
.gstats { display: flex; gap: 12px; margin: 6px 0 4px; }
.gstats .gs { flex: 1; background: #eae0cc; border: 1px solid #d8cdb8; border-radius: 10px; padding: 12px 14px; text-align: center; }
.gstats .gs b { display: block; font-family: var(--serif); font-size: 28px; font-weight: 600; line-height: 1; color: #1a1712; }
.gstats .gs span { font-family: var(--mono); font-size: 10px; letter-spacing: .06em; color: #9b8f78; }
.langbar { display: flex; height: 12px; border-radius: 999px; overflow: hidden; background: #e6dcc8; }
.langbar .seg { height: 100%; }
.langlegend { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px; font-family: var(--mono); font-size: 11px; color: #5c5448; }
.langlegend i { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 5px; vertical-align: middle; }
.recent { list-style: none; padding: 0; margin: 0; }
.recent li a { display: flex; align-items: center; gap: 12px; padding: 9px 0; border-top: 1px solid #e0d6c1; text-decoration: none; color: #1a1712; }
.recent li:first-child a { border-top: 0; }
.recent .rn { font-family: var(--serif); font-weight: 600; font-size: 15px; }
.recent .rl { font-family: var(--mono); font-size: 11px; color: #6b6354; }
.recent .rl i { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; vertical-align: middle; }
.recent .rd { margin-left: auto; font-family: var(--mono); font-size: 11px; color: #9b8f78; }
.gupdated { margin-top: 16px; font-family: var(--mono); font-size: 10px; color: #b3a892; text-align: right; }

.fade-enter-active, .fade-leave-active { transition: opacity .25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 700px) {
  .overview-title { display: none; }
  .meta .ttl { font-size: 21px; }
  .works-panel { padding: 28px 22px 26px; }
  .works-panel h2 { font-size: 30px; }
  .work-row { grid-template-columns: 38px minmax(0, 1fr); gap: 10px; }
  .work-tech { display: none; }
  .work-main b { font-size: 19px; }
  .contact-card .ct-actions { grid-template-columns: 1fr; }
  .resume-preview { justify-self: center; }
}
</style>
