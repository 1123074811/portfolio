<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Github, Mail, ArrowUp, Cpu, Monitor, Eye, Users, ShieldCheck } from 'lucide-vue-next'
import { portfolioData } from '../data/portfolioData'
import { locale, translations } from '../data/locale'

const personalInfo = portfolioData.personalInfo
const currentYear = new Date().getFullYear()

const todayVisits = ref(142)
const activeOnline = ref(3)
let statsTimer = null

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  // Simulate active online visitor ticking up/down
  statsTimer = setInterval(() => {
    const change = Math.random() > 0.5 ? 1 : -1
    activeOnline.value = Math.max(1, Math.min(8, activeOnline.value + change))
    
    // Occasionally increment today's visits
    if (Math.random() > 0.7) {
      todayVisits.value += 1
    }
  }, 5000)
})

onUnmounted(() => {
  if (statsTimer) clearInterval(statsTimer)
})
</script>

<template>
  <footer class="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 font-mono text-xs">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        
        <!-- Logo / Name -->
        <div class="flex flex-col items-center md:items-start space-y-2">
          <div class="flex items-center space-x-2 text-white">
            <span class="text-lg">🚀</span>
            <span class="font-bold text-sm tracking-wider">
              &lt;{{ personalInfo.name }} /&gt;
            </span>
          </div>
          <p class="text-slate-500 text-[11px]">
            {{ locale === 'zh' ? '用 AI 放大效率，把想法快速写成运行作品。' : 'Amplify speed with AI, turn ideas into running software.' }}
          </p>
        </div>

        <!-- Slogan -->
        <div class="text-center md:text-left text-slate-500 text-[11px] leading-relaxed max-w-sm">
          <span>Built with </span>
          <span class="text-emerald-400 font-bold">Vue 3</span>
          <span>, </span>
          <span class="text-cyan-400 font-bold">Tailwind CSS</span>
          <span> & </span>
          <span class="text-purple-400 font-bold">a lot of Vibe Coding</span>
          <span>. 💻⚡</span>
        </div>

        <!-- Social Icons / Scroll To Top -->
        <div class="flex items-center space-x-4">
          <a 
            :href="personalInfo.github" 
            target="_blank" 
            class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="GitHub"
          >
            <Github class="w-4 h-4" />
          </a>
          <a 
            :href="'mailto:' + personalInfo.email" 
            class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Email"
          >
            <Mail class="w-4 h-4" />
          </a>
          <button 
            @click="scrollToTop" 
            class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            :title="locale === 'zh' ? '返回顶部' : 'Scroll to top'"
          >
            <ArrowUp class="w-4 h-4" />
          </button>
        </div>

      </div>

      <!-- Geeky Monitoring Dashboard -->
      <div class="mt-10 mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-900/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
        <div class="space-y-1">
          <div class="text-[10px] text-slate-500 uppercase tracking-widest flex items-center space-x-1.5 font-bold font-mono">
            <Eye class="w-3.5 h-3.5 text-cyber-cyan" />
            <span>{{ translations[locale].statsToday }}</span>
          </div>
          <div class="text-sm font-bold text-slate-300 font-mono pl-5">{{ todayVisits }}</div>
        </div>
        <div class="space-y-1">
          <div class="text-[10px] text-slate-500 uppercase tracking-widest flex items-center space-x-1.5 font-bold font-mono">
            <Monitor class="w-3.5 h-3.5 text-cyber-violet" />
            <span>{{ translations[locale].statsTotal }}</span>
          </div>
          <div class="text-sm font-bold text-slate-300 font-mono pl-5">3,829</div>
        </div>
        <div class="space-y-1">
          <div class="text-[10px] text-slate-500 uppercase tracking-widest flex items-center space-x-1.5 font-bold font-mono">
            <Users class="w-3.5 h-3.5 text-cyber-neon animate-pulse" />
            <span>{{ translations[locale].statsOnline }}</span>
          </div>
          <div class="text-sm font-bold text-slate-300 font-mono pl-5 flex items-center space-x-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-cyber-neon animate-ping"></span>
            <span>{{ activeOnline }}</span>
          </div>
        </div>
        <div class="space-y-1">
          <div class="text-[10px] text-slate-500 uppercase tracking-widest flex items-center space-x-1.5 font-bold font-mono">
            <Cpu class="w-3.5 h-3.5 text-amber-500" />
            <span>{{ translations[locale].statsServer }}</span>
          </div>
          <div class="text-sm font-bold text-emerald-500 font-mono pl-5 flex items-center space-x-1">
            <ShieldCheck class="w-3.5 h-3.5" />
            <span>{{ translations[locale].statsActive }}</span>
          </div>
        </div>
      </div>

      <!-- Copyright Bar -->
      <div class="mt-6 pt-6 border-t border-slate-900 text-center text-slate-600 text-[10px] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© {{ currentYear }} {{ personalInfo.englishName }}. All rights reserved.</span>
        <span class="flex items-center space-x-2">
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>System Status: Fully Operational</span>
        </span>
      </div>

    </div>
  </footer>
</template>
