<script setup>
import { ref, computed } from 'vue'
import { GraduationCap, Briefcase, Calendar, Download, Target, ChevronDown, ChevronUp } from 'lucide-vue-next'
import { portfolioData } from '../data/portfolioData'
import { locale, translations } from '../data/locale'

const experiences = portfolioData.experiences
const personalInfo = portfolioData.personalInfo

const INITIAL_LIMIT = 3
const isExpanded = ref(false)

const visibleExperiences = computed(() => {
  if (isExpanded.value) {
    return experiences
  }
  return experiences.slice(0, INITIAL_LIMIT)
})

const hasMore = computed(() => experiences.length > INITIAL_LIMIT)

const alertResume = (e) => {
  if (personalInfo.resumeUrl === '#') {
    e.preventDefault()
    alert('📄 个人简历正在同步更新中... 如果急需，欢迎在页面下方通过邮箱直接联系我！')
  }
}
</script>

<template>
  <section id="experience" class="py-20 bg-slate-50 dark:bg-slate-950/20">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <h2 class="text-xs font-mono font-bold tracking-widest text-cyber-violet uppercase dark:text-cyber-cyan">
          MY JOURNEY / {{ locale === 'zh' ? '个人成长轨迹' : 'GROWTH TIMELINE' }}
        </h2>
        <p class="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          {{ locale === 'zh' ? '持续迭代、探索未知的进化路线' : 'Continuous Evolution & Future Trajectories' }}
        </p>
        <div class="w-12 h-1 bg-cyber-violet dark:bg-cyber-cyan mx-auto rounded"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <!-- Left Column: Timeline -->
        <div class="lg:col-span-8 relative">
          <!-- Timeline Vertical Bar -->
          <div class="absolute left-4 md:left-1/2 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 hidden md:block"></div>
          <div class="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800 block md:hidden"></div>

          <div class="space-y-12 relative z-10">
            
            <div 
              v-for="(exp, idx) in visibleExperiences" 
              :key="exp.title"
              class="flex flex-col md:flex-row items-start"
              :class="[idx % 2 === 0 ? 'md:flex-row-reverse' : '']"
            >
              
              <!-- Left/Right Card Spacer for desktop centering -->
              <div class="w-full md:w-1/2 hidden md:block"></div>

              <!-- Center Dot Icon -->
              <div class="absolute left-4 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full border bg-white dark:bg-slate-950 z-20"
                :class="[
                  exp.type === '教育背景' || exp.typeEn === 'Education'
                    ? 'border-cyber-violet text-cyber-violet' 
                    : 'border-cyber-neon text-cyber-neon'
                ]"
              >
                <GraduationCap v-if="exp.type === '教育背景' || exp.typeEn === 'Education'" class="w-4 h-4" />
                <Briefcase v-else class="w-4 h-4" />
              </div>

              <!-- Actual Content Box -->
              <div class="w-full md:w-1/2 pl-12 md:pl-0 md:px-8 text-left">
                <div class="p-6 bg-white dark:bg-cyber-card border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  
                  <!-- Meta Header -->
                  <div class="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <span class="inline-flex items-center space-x-1 text-xs font-bold font-mono text-cyber-violet dark:text-cyber-cyan bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
                      <Calendar class="w-3 h-3" />
                      <span>{{ exp.year }}</span>
                    </span>
                    <span class="text-[10px] font-bold font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                      {{ locale === 'zh' ? exp.type : exp.typeEn }}
                    </span>
                  </div>

                  <!-- Details Title -->
                  <h4 class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mb-2">
                    {{ locale === 'zh' ? exp.title : exp.titleEn }}
                  </h4>

                  <!-- Description paragraph -->
                  <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {{ locale === 'zh' ? exp.description : exp.descriptionEn }}
                  </p>
                </div>
              </div>

            </div>

            <!-- Collapse / Expand Toggle Button -->
            <div v-if="hasMore" class="flex justify-center pt-2 relative z-30">
              <button 
                @click="isExpanded = !isExpanded"
                class="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold font-mono tracking-wider uppercase text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-850 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
              >
                <span>
                  {{ isExpanded 
                      ? (locale === 'zh' ? '收起完整轨迹' : 'COLLAPSE JOURNEY') 
                      : (locale === 'zh' ? `展开完整轨迹 (${experiences.length})` : `EXPAND COMPLETE JOURNEY (${experiences.length})`) }}
                </span>
                <ChevronUp v-if="isExpanded" class="w-4 h-4 text-cyber-violet dark:text-cyber-cyan" />
                <ChevronDown v-else class="w-4 h-4 text-cyber-violet dark:text-cyber-cyan" />
              </button>
            </div>

          </div>
        </div>

        <!-- Right Column: Career Target Cards -->
        <div class="lg:col-span-4 space-y-6">
          
          <!-- Target Roles Panel -->
          <div class="p-6 bg-white dark:bg-cyber-card border border-slate-100 dark:border-slate-800 rounded-2xl text-left space-y-5">
            <div class="flex items-center space-x-2 text-cyber-violet dark:text-cyber-cyan font-bold">
              <Target class="w-5 h-5" />
              <span class="text-sm font-mono tracking-wider uppercase">{{ translations[locale].targetRoles }}</span>
            </div>
            
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              {{ locale === 'zh' 
                  ? '我正在寻找能将大语言模型 (LLM)、全栈技术以及敏捷原型开发思想结合的开发岗位。' 
                  : 'I am actively seeking internship opportunities that leverage Large Language Models (LLMs), full-stack development, and agile prototyping workflows.' }}
            </p>

            <div class="flex flex-col gap-2">
              <div 
                v-for="role in (locale === 'zh' ? personalInfo.targetRoles : personalInfo.targetRolesEn)" 
                :key="role"
                class="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                <span class="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></span>
                <span>{{ role }}</span>
              </div>
            </div>
          </div>

          <!-- Direct Resume Panel -->
          <div class="p-6 bg-gradient-to-br from-cyber-violet/5 via-cyber-cyan/5 to-transparent border border-slate-200/60 dark:border-slate-800/80 rounded-2xl text-left space-y-4">
            <h4 class="text-base font-bold text-slate-900 dark:text-white">
              {{ locale === 'zh' ? '需要纸质或更详细的简历？' : 'Need a physical paper resume?' }}
            </h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {{ locale === 'zh' 
                  ? '你可以一键下载我离线排版的高精版 PDF 个人简历，详细了解我的获奖情况和更多学术表现。' 
                  : 'Open my high-fidelity printable online resume optimized for direct physical rendering (A4 layout).' }}
            </p>
            <a 
              :href="personalInfo.resumeUrl"
              target="_blank"
              @click="alertResume"
              class="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:scale-[1.01] active:scale-95 transition-all"
            >
              <Download class="w-4 h-4" />
              <span>{{ translations[locale].offlineResume }}</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>
