<script setup>
import { Bot, Layers, Zap, TrendingUp } from 'lucide-vue-next'
import { portfolioData } from '../data/portfolioData'
import { locale, translations } from '../data/locale'

const aboutMe = portfolioData.aboutMe
const personalInfo = portfolioData.personalInfo

// Map icon strings to actual Lucide components
const iconMap = {
  Bot,
  Layers,
  Zap,
  TrendingUp
}
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
    </div>
  </section>
</template>
