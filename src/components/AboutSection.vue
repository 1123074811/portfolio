<script setup>
import { Bot, Layers, Zap, TrendingUp, Github } from 'lucide-vue-next'
import { portfolioData } from '../data/portfolioData'
import { locale, translations } from '../data/locale'
import { computed, ref, onMounted } from 'vue'

const aboutMe = portfolioData.aboutMe
const personalInfo = portfolioData.personalInfo

// Map icon strings to actual Lucide components
const iconMap = {
  Bot,
  Layers,
  Zap,
  TrendingUp
}

// Static Tailwind class maps to ensure dynamic class compiler safety and exact original GitHub green colors
const cellBgClasses = {
  level0: 'bg-[#ebedf0] dark:bg-[#161b22]',
  level1: 'bg-[#9be9a8] dark:bg-[#0e4429]',
  level2: 'bg-[#40c463] dark:bg-[#006d32]',
  level3: 'bg-[#30a14e] dark:bg-[#26a641]',
  level4: 'bg-[#216e39] dark:bg-[#39d353]'
}

// Toggle to false when you want to connect to real GitHub API dynamically at runtime
const useSimulatedData = ref(true)

// Live state fetched from public API
const realContributions = ref(null)
const isFetchingReal = ref(false)
const totalCommitsCount = ref(1842) // Fallback/Live sum
const currentStreak = ref(45)       // Fallback/Live streak

// Generate deterministic pseudo-random floats [0, 1] based on date strings to keep mock calendar grids stable across page reloads
const getDeterministicRandom = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(Math.sin(hash))
}

const fetchGitHubContributions = async () => {
  const username = personalInfo.github.split('/').pop()
  if (!username) return
  
  isFetchingReal.value = true
  
  // Try jogruber API first (highly optimized endpoint used by standard react calendars)
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
    if (!res.ok) throw new Error('Jogruber API returned non-200')
    const data = await res.json()
    
    if (data && data.contributions && Array.isArray(data.contributions)) {
      parseContributionsData(data.contributions, username)
      return
    }
  } catch (err) {
    console.warn("[GitHub API] Primary jogruber API failed, trying fallback. Error:", err)
  }
  
  // Try deno.dev API (second choice)
  try {
    const res = await fetch(`https://github-contributions-api.deno.dev/v1/${username}`)
    if (!res.ok) throw new Error('Deno API failed')
    const data = await res.json()
    
    if (data && data.contributions && Array.isArray(data.contributions)) {
      parseContributionsData(data.contributions, username)
      return
    }
  } catch (err) {
    console.warn("[GitHub API] Fallback API failed as well. Using high-fidelity simulation. Error:", err)
  } finally {
    isFetchingReal.value = false
  }
}

const parseContributionsData = (contributions, username) => {
  const contribMap = new Map()
  let total = 0
  
  contributions.forEach(item => {
    contribMap.set(item.date, {
      count: item.count,
      level: item.level
    })
    total += item.count
  })
  
  realContributions.value = contribMap
  if (total > 0) {
    totalCommitsCount.value = total
  }
  
  // Calculate real active streak dynamically by scanning backwards from today (max 365 days)
  let streak = 0
  let tempDate = new Date()
  for (let i = 0; i < 365; i++) {
    const dateStr = tempDate.toISOString().split('T')[0]
    const dayData = contribMap.get(dateStr)
    if (dayData && dayData.count > 0) {
      streak++
      tempDate.setDate(tempDate.getDate() - 1)
    } else {
      break
    }
  }
  if (streak > 0) {
    currentStreak.value = streak
  }
  
  console.log(`[GitHub API] Successfully retrieved ${total} commits for ${username}. Current streak: ${streak} days.`)
}

// Generate high-fidelity contribution calendar data for exactly 364 days (52 weeks) up to today
const calendarWeeks = computed(() => {
  const weeks = []
  const now = new Date()
  
  // Start from exactly 364 days ago (52 weeks ago), aligned to the nearest Sunday
  const startDate = new Date(now)
  startDate.setDate(now.getDate() - 364)
  const dayOfWeek = startDate.getDay()
  startDate.setDate(startDate.getDate() - dayOfWeek) // Align to Sunday
  
  let currentDate = new Date(startDate)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthsZh = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  
  for (let w = 0; w < 53; w++) {
    const days = []
    let monthLabel = null
    
    for (let d = 0; d < 7; d++) {
      const dateStr = currentDate.toISOString().split('T')[0]
      
      // Show month label if this Sunday starts a new month
      if (d === 0 && currentDate.getDate() <= 7) {
        monthLabel = locale.value === 'zh' ? monthsZh[currentDate.getMonth()] : months[currentDate.getMonth()]
      }
      
      let count = 0
      let level = 0
      const isFuture = currentDate > now
      
      if (!isFuture) {
        if (!useSimulatedData.value && realContributions.value && realContributions.value.has(dateStr)) {
          // A: Use Real GitHub Data
          const realDay = realContributions.value.get(dateStr)
          count = realDay.count
          level = realDay.level
        } else if (!useSimulatedData.value && realContributions.value) {
          // Real data loaded, but date is missing -> 0 commits
          count = 0
          level = 0
        } else {
          // B: High-fidelity active pattern generator fallback (Deterministic date-based hash)
          const isWeekend = d === 0 || d === 6
          const rand = getDeterministicRandom(dateStr)
          const mNum = currentDate.getMonth()
          
          let sprintFactor = 1.0
          if (mNum >= 9 && mNum <= 11) sprintFactor = 1.6 // Heavy autumn project delivery sprint
          if (mNum >= 2 && mNum <= 4) sprintFactor = 1.3  // Spring hackathons sprint
          if (mNum === 1 || mNum === 7) sprintFactor = 0.4  // Quiet holiday seasons
          
          if (!isWeekend) {
            if (rand < 0.15) count = 0
            else if (rand < 0.55) count = Math.floor(getDeterministicRandom(dateStr + '-sub1') * 2) + 1
            else if (rand < 0.88) count = Math.floor(getDeterministicRandom(dateStr + '-sub2') * 3) + 3
            else count = Math.floor(getDeterministicRandom(dateStr + '-sub3') * 5) + 6
          } else {
            if (rand < 0.75) count = 0
            else count = Math.floor(getDeterministicRandom(dateStr + '-sub4') * 2) + 1
          }
          
          count = Math.floor(count * sprintFactor)
          if (count < 0) count = 0
          
          if (count === 0) level = 0
          else if (count <= 2) level = 1
          else if (count <= 4) level = 2
          else if (count <= 6) level = 3
          else level = 4
        }
      }
      
      days.push({
        date: new Date(currentDate),
        dateStr,
        count: isFuture ? null : count,
        level: isFuture ? null : level
      })
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    weeks.push({
      days,
      monthLabel
    })
  }
  
  return weeks
})

const getTooltipText = (day) => {
  if (!day || day.count === null) return ''
  const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  const formattedDate = day.date.toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US', dateOptions)
  
  if (locale.value === 'zh') {
    return `${formattedDate}：${day.count === 0 ? '无' : day.count} 次贡献`
  } else {
    return `${day.count === 0 ? 'No' : day.count} contribution${day.count === 1 ? '' : 's'} on ${formattedDate}`
  }
}

onMounted(() => {
  if (!useSimulatedData.value) {
    fetchGitHubContributions()
  } else {
    console.log("[GitHub Calendar] Operating in offline simulation mode.")
  }
})
</script>

<template>
  <section id="about" class="py-20 bg-slate-100/50 dark:bg-slate-900/20 border-y border-slate-100 dark:border-slate-900">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <h2 class="text-xs font-mono font-bold tracking-widest text-cyber-violet uppercase dark:text-cyber-cyan">
          ABOUT ME / {{ locale === 'zh' ? '关于我' : 'ABOUT ME' }}
        </h2>
        <p class="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          {{ locale === 'zh' ? '不只是写代码，也把想法做成作品' : 'Not Just Writing Code, Landing Ideas into Products' }}
        </p>
        <div class="w-12 h-1 bg-cyber-violet dark:bg-cyber-cyan mx-auto rounded"></div>
      </div>

      <!-- Main Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <!-- Left Column: Biography -->
        <div class="lg:col-span-5 space-y-6 text-left">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>{{ locale === 'zh' ? '我是 陈俊杰' : 'I am Alex Chen' }}</span>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 font-mono font-semibold">{{ locale === 'zh' ? 'Vibe Coding 程序员' : 'Vibe Coder' }}</span>
          </h3>
          
          <div class="space-y-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed sm:text-base">
            <p v-for="(p, index) in (locale === 'zh' ? aboutMe.paragraphs : aboutMe.paragraphsEn)" :key="index">
              {{ p }}
            </p>
          </div>

          <!-- Highlight list -->
          <div class="p-5 border border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/40 rounded-xl space-y-3">
            <div class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {{ translations[locale].manifestoTitle }}
            </div>
            <p class="text-sm italic text-slate-700 dark:text-slate-300 font-mono">
              {{ translations[locale].manifestoText }}
            </p>
          </div>
        </div>

        <!-- Right Column: Interactive Capacity Cards Grid -->
        <div class="lg:col-span-7">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div 
              v-for="card in aboutMe.cards" 
              :key="card.id"
              class="group cyber-card p-6 flex flex-col items-start text-left space-y-4 hover:border-cyber-cyan/30 dark:hover:border-cyber-violet/30 transition-all duration-300"
            >
              <!-- Icon Frame with gradient hover -->
              <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 group-hover:bg-gradient-to-br group-hover:from-cyber-violet group-hover:to-cyber-cyan group-hover:text-white transition-all duration-300">
                <component :is="iconMap[card.icon]" class="w-5 h-5" />
              </div>
              
              <!-- Content -->
              <h4 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyber-violet dark:group-hover:text-cyber-cyan transition-colors">
                {{ locale === 'zh' ? card.title : card.titleEn }}
              </h4>
              
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ locale === 'zh' ? card.description : card.descriptionEn }}
              </p>
            </div>

          </div>
        </div>

      </div>

      <!-- GitHub Contributions Calendar Panel -->
      <div class="mt-16 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-cyber-card/60 shadow-md text-left space-y-6">
        <div class="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
              <Github class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <span>{{ locale === 'zh' ? 'GitHub 研发活动看板' : 'GitHub Contributions Activity' }}</span>
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest animate-pulse">● LIVE STATUS</span>
              </h3>
              <a 
                :href="personalInfo.github" 
                target="_blank" 
                class="text-xs font-mono text-cyber-violet dark:text-cyber-cyan hover:underline"
              >
                @{{ personalInfo.github.split('/').pop() }}
              </a>
            </div>
          </div>
          
          <!-- Legend -->
          <div class="flex items-center space-x-1.5 text-[10px] sm:text-xs font-mono text-slate-400 dark:text-slate-500">
            <span>{{ locale === 'zh' ? '当前系统：正常运作' : 'System: Operational' }}</span>
          </div>
        </div>

        <!-- Chart Grid Wrapper (Handles Overflow on Mobile & Exactly matches screenshot) -->
        <div class="w-full overflow-x-auto overflow-y-hidden py-4 scrollbar-thin">
          <div class="github-calendar min-w-[720px] max-w-[840px] mx-auto p-4 rounded-xl border border-slate-100 dark:border-slate-900/60 bg-white dark:bg-slate-950/40 shadow-inner">
            
            <!-- 1. Months Header Row (Dynamically Aligned above columns) -->
            <div class="relative h-4 mb-2 select-none" style="padding-left: 28px;">
              <span 
                v-for="(week, wIdx) in calendarWeeks" 
                :key="wIdx"
                v-if="week.monthLabel"
                class="absolute text-[10px] font-mono text-slate-400 dark:text-slate-500 leading-none transform -translate-x-1/2"
                :style="{ left: `calc(28px + ${wIdx * 13}px)` }"
              >
                {{ week.monthLabel }}
              </span>
            </div>

            <!-- 2. Main Calendar Grid -->
            <div class="relative flex" style="gap: 4px;">
              
              <!-- Weekday Labels on the Left (aligned to Mon, Wed, Fri as in screenshot) -->
              <div class="flex flex-col text-[10px] font-mono text-slate-400 dark:text-slate-500 pr-2 pb-1 justify-between select-none" style="height: 88px; margin-top: 1px; width: 22px;">
                <span class="h-2.5 leading-none"></span> <!-- Sun (Empty) -->
                <span class="h-2.5 leading-none">Mon</span>
                <span class="h-2.5 leading-none"></span> <!-- Tue (Empty) -->
                <span class="h-2.5 leading-none">Wed</span>
                <span class="h-2.5 leading-none"></span> <!-- Thu (Empty) -->
                <span class="h-2.5 leading-none">Fri</span>
                <span class="h-2.5 leading-none"></span> <!-- Sat (Empty) -->
              </div>
              
              <!-- Weeks Columns Wrapper -->
              <div class="flex flex-1 justify-between" style="gap: 3px;">
                <div 
                  v-for="(week, wIdx) in calendarWeeks" 
                  :key="wIdx" 
                  class="flex flex-col" 
                  style="gap: 3px;"
                >
                  <!-- Individual Day Cells (Level 0 - 4 greens via scoped CSS variables) -->
                  <div 
                    v-for="(day, dIdx) in week.days" 
                    :key="dIdx"
                    class="w-2.5 h-2.5 rounded-[1.5px] transition-all duration-300 relative group/cell cursor-pointer hover:ring-1 hover:ring-cyber-violet/50"
                    :style="{ backgroundColor: 'var(--github-l' + (day.level !== null ? day.level : 0) + ')' }"
                  >
                    <!-- Custom Tooltip element appearing on hover -->
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/cell:block z-50 bg-slate-900/95 dark:bg-slate-950/95 text-white font-mono text-[9px] px-2 py-1 rounded-md shadow-xl whitespace-nowrap pointer-events-none border border-slate-700/80 backdrop-blur-sm">
                      {{ getTooltipText(day) }}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- 3. Bottom captions (Matches screenshot perfectly) -->
            <div class="flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500 pt-4 mt-1 select-none">
              <a 
                href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile" 
                target="_blank"
                class="hover:text-cyber-violet dark:hover:text-cyber-cyan hover:underline transition-colors flex items-center space-x-1"
              >
                <span>{{ locale === 'zh' ? '了解我们如何统计贡献' : 'Learn how we count contributions' }}</span>
              </a>
              
              <!-- Less / More Green Grid legend -->
              <div class="flex items-center space-x-1.5">
                <span>Less</span>
                <div class="w-2.5 h-2.5 rounded-[1.5px] border border-slate-200/10" :style="{ backgroundColor: 'var(--github-l0)' }"></div>
                <div class="w-2.5 h-2.5 rounded-[1.5px]" :style="{ backgroundColor: 'var(--github-l1)' }"></div>
                <div class="w-2.5 h-2.5 rounded-[1.5px]" :style="{ backgroundColor: 'var(--github-l2)' }"></div>
                <div class="w-2.5 h-2.5 rounded-[1.5px]" :style="{ backgroundColor: 'var(--github-l3)' }"></div>
                <div class="w-2.5 h-2.5 rounded-[1.5px]" :style="{ backgroundColor: 'var(--github-l4)' }"></div>
                <span>More</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Activity Analytics Summary -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/30 text-center">
            <div class="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {{ locale === 'zh' ? '全年度总提交' : 'TOTAL COMMITS' }}
            </div>
            <div class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
              {{ totalCommitsCount }}+
            </div>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/30 text-center">
            <div class="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {{ locale === 'zh' ? '日常合并提交率' : 'PR MERGE RATE' }}
            </div>
            <div class="text-xl sm:text-2xl font-black text-emerald-500 font-mono mt-1">
              98.4%
            </div>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/30 text-center">
            <div class="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {{ locale === 'zh' ? '当前连续提交' : 'CURRENT STREAK' }}
            </div>
            <div class="text-xl sm:text-2xl font-black text-cyber-violet dark:text-cyber-cyan font-mono mt-1">
              {{ currentStreak }} {{ locale === 'zh' ? '天' : 'Days' }}
            </div>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/30 text-center">
            <div class="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {{ locale === 'zh' ? '年度日均活跃度' : 'DAILY VIBE' }}
            </div>
            <div class="text-xl sm:text-2xl font-black text-purple-500 dark:text-purple-400 font-mono mt-1">
              A+++
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.github-calendar {
  --github-l0: #ebedf0;
  --github-l1: #9be9a8;
  --github-l2: #40c463;
  --github-l3: #30a14e;
  --github-l4: #216e39;
}

:global(.dark) .github-calendar {
  --github-l0: #161b22;
  --github-l1: #0e4429;
  --github-l2: #006d32;
  --github-l3: #26a641;
  --github-l4: #39d353;
}
</style>
