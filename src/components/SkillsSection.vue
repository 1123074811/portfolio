<script setup>
import { Sparkles, Terminal, Code2, Cpu, Wrench, ShieldAlert } from 'lucide-vue-next'
import { portfolioData } from '../data/portfolioData'
import { locale, translations } from '../data/locale'

const skillGroups = portfolioData.skillGroups

// Dynamic card icons for variety
const groupIcons = [
  Code2,    // Frontend
  Cpu,      // Backend/Db
  Sparkles, // AI Apps
  Wrench    // AI Efficiency/Tools
]
</script>

<template>
  <section id="skills" class="py-20 bg-slate-100/50 dark:bg-slate-900/20 border-y border-slate-100 dark:border-slate-900/80">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <h2 class="text-xs font-mono font-bold tracking-widest text-cyber-violet uppercase dark:text-cyber-cyan">
          TECH STACK & TOOLS / {{ locale === 'zh' ? '开发工具箱' : 'TOOLBOX' }}
        </h2>
        <p class="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          {{ locale === 'zh' ? '我的软硬件与 AI 协同工作栈' : 'My Core Stacks & AI Co-pilot Integrations' }}
        </p>
        <div class="w-12 h-1 bg-cyber-violet dark:bg-cyber-cyan mx-auto rounded"></div>
        <p class="text-sm text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
          {{ locale === 'zh' 
              ? '我使用现代开发技术完成系统工程架构与高可用实现，并结合最前沿的 AI 编程工作流进行极速原型测试、重构与问题排查。' 
              : 'I develop software using enterprise-grade structural stacks and high-availability schemas, coupled with modern generative AI pipelines to secure instant refactoring and diagnostic speeds.' }}
        </p>
      </div>

      <!-- Skills Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        <div 
          v-for="(group, idx) in skillGroups" 
          :key="group.title"
          class="relative p-8 cyber-card h-full flex flex-col justify-between text-left group hover:border-cyber-violet/30 dark:hover:border-cyber-cyan/30"
          :class="[
            group.title.includes('AI') || group.titleEn.includes('AI')
              ? 'ring-1 ring-cyber-violet/10 dark:ring-cyber-cyan/10 bg-gradient-to-br from-white via-white to-purple-50/20 dark:from-cyber-card dark:via-cyber-card dark:to-cyan-950/10'
              : ''
          ]"
        >
          <!-- Glowing special badge for AI focus cards -->
          <div 
            v-if="group.title.includes('AI') || group.titleEn.includes('AI')" 
            class="absolute top-4 right-4 flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-cyber-violet/10 text-cyber-violet border border-cyber-violet/20 text-[10px] font-bold font-mono dark:bg-cyber-cyan/10 dark:text-cyber-cyan dark:border-cyber-cyan/20 animate-pulse"
          >
            <Sparkles class="w-3 h-3" />
            <span>AI STACK</span>
          </div>

          <div class="space-y-4">
            <!-- Icon & Header Info -->
            <div class="flex items-center space-x-3">
              <div class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:text-cyber-violet dark:group-hover:text-cyber-cyan transition-colors">
                <component :is="groupIcons[idx]" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                  {{ locale === 'zh' ? group.title : group.titleEn }}
                </h3>
                <p class="text-xs text-slate-400 dark:text-slate-500">
                  {{ locale === 'zh' ? group.description : group.descriptionEn }}
                </p>
              </div>
            </div>

            <!-- Skill Tags wrapper -->
            <div class="flex flex-wrap gap-2 pt-2">
              <span 
                v-for="skill in group.skills" 
                :key="skill"
                class="px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono tracking-wide border transition-all duration-300"
                :class="[
                  group.title.includes('AI') || group.titleEn.includes('AI')
                    ? 'bg-slate-50 border-purple-100 text-purple-700 hover:border-cyber-violet/40 hover:bg-cyber-violet/5 dark:bg-slate-900 dark:border-cyan-950 dark:text-cyan-400 dark:hover:border-cyber-cyan/40 dark:hover:bg-cyber-cyan/5'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100/50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/40'
                ]"
              >
                {{ skill }}
              </span>
            </div>
          </div>

        </div>

      </div>

      <!-- Live Quote footer of stack -->
      <div class="mt-12 text-center">
        <p class="inline-flex items-center space-x-2 text-xs font-mono px-4 py-2 rounded-full border border-slate-200 bg-white/60 text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
          <Terminal class="w-3.5 h-3.5 text-cyber-neon" />
          <span>{{ locale === 'zh' ? '正在探索的未来栈：' : 'Exploring Future Stacks: ' }}Next.js, LangGraph, DeepSeek API, Vector Databases</span>
        </p>
      </div>

    </div>
  </section>
</template>
