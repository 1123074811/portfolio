<script setup>
import { defineProps, defineEmits } from 'vue'
import { ExternalLink, Github, Sparkles, CheckCircle2, FlaskConical } from 'lucide-vue-next'
import { locale, translations } from '../data/locale'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['open-details', 'openDetails'])

// Format status tags with appropriate colors
const getStatusClasses = (status) => {
  switch (status) {
    case '持续迭代':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    case '已完成':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    case '实验中':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    default:
      return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
  }
}
</script>

<template>
  <div class="group cyber-card flex flex-col overflow-hidden h-full cursor-pointer hover:border-cyber-violet/30 transition-all duration-300" @click="emit('open-details', project)">
    <!-- Image Header Frame -->
    <div class="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
      <!-- Project Cover image -->
      <img 
        :src="project.coverImage" 
        :alt="locale === 'zh' ? project.title : project.titleEn"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <!-- Category Pill -->
      <div class="absolute top-4 left-4 z-10">
        <span class="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-900/80 text-white border border-white/10 backdrop-blur-md shadow-md">
          {{ locale === 'zh' ? project.category : project.categoryEn }}
        </span>
      </div>

      <!-- Status Pill -->
      <div class="absolute top-4 right-4 z-10">
        <span 
          class="inline-flex items-center space-x-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md"
          :class="getStatusClasses(project.status)"
        >
          <span 
            class="w-1.5 h-1.5 rounded-full"
            :class="[
              project.status === '持续迭代' ? 'bg-emerald-500' : '',
              project.status === '已完成' ? 'bg-blue-500' : '',
              project.status === '实验中' ? 'bg-amber-500' : ''
            ]"
          ></span>
          <span>{{ locale === 'zh' ? project.status : project.statusEn }}</span>
        </span>
      </div>
    </div>

    <!-- Details Body -->
    <div class="p-6 flex-1 flex flex-col justify-between text-left space-y-4">
      
      <div class="space-y-2">
        <!-- Title -->
        <h4 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyber-violet dark:group-hover:text-cyber-cyan transition-colors">
          {{ locale === 'zh' ? project.title : project.titleEn }}
        </h4>
        <!-- Subtitle -->
        <p class="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
          {{ locale === 'zh' ? project.subtitle : project.subtitleEn }}
        </p>
        <!-- Brief Intro -->
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
          {{ locale === 'zh' ? project.description : project.descriptionEn }}
        </p>
      </div>

      <!-- Highlight Details (Mini case-study elements) -->
      <div class="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        
        <!-- Features section -->
        <div class="space-y-1.5">
          <div class="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <Sparkles class="w-3.5 h-3.5 text-cyber-violet" />
            <span>{{ locale === 'zh' ? '核心功能 / Features' : 'Key Features' }}</span>
          </div>
          <ul class="list-none pl-0 space-y-1">
            <li 
              v-for="(feature, idx) in (locale === 'zh' ? project.features : project.featuresEn)" 
              :key="idx"
              class="text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-1"
            >
              <span class="text-cyber-cyan font-bold mr-1.5">›</span>
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>

        <!-- Tech Highlights section -->
        <div class="space-y-1.5">
          <div class="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <CheckCircle2 class="w-3.5 h-3.5 text-cyber-neon" />
            <span>{{ locale === 'zh' ? '技术亮点 / Highlights' : 'Tech Highlights' }}</span>
          </div>
          <ul class="list-none pl-0 space-y-1">
            <li 
              v-for="(hl, idx) in (locale === 'zh' ? project.highlights : project.highlightsEn)" 
              :key="idx"
              class="text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-1"
            >
              <span class="text-cyber-violet font-bold mr-1.5">›</span>
              <span>{{ hl }}</span>
            </li>
          </ul>
        </div>

        <!-- My Role section -->
        <div class="space-y-1 bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/50">
          <div class="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            {{ locale === 'zh' ? '我的角色 / My Contribution' : 'My Contribution' }}
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-normal font-mono">
            {{ locale === 'zh' ? project.role : project.roleEn }}
          </p>
        </div>

      </div>

      <!-- Tech stack Tags -->
      <div class="flex flex-wrap gap-1.5 pt-2">
        <span 
          v-for="tech in project.techStack" 
          :key="tech"
          class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
          {{ tech }}
        </span>
      </div>

      <!-- Action Buttons footer -->
      <div class="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <a 
          v-if="project.sourceUrl && project.sourceUrl !== '#'"
          :href="project.sourceUrl" 
          target="_blank"
          @click.stop
          class="flex items-center justify-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800/60 dark:hover:bg-slate-800 transition-colors"
        >
          <Github class="w-3.5 h-3.5" />
          <span>{{ translations[locale].viewSource }}</span>
        </a>
        <div 
          v-else
          @click.stop
          class="flex items-center justify-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 bg-slate-100/50 dark:bg-slate-900/40 dark:text-slate-600 border border-slate-200/40 dark:border-slate-850 cursor-not-allowed"
          :title="locale === 'zh' ? '源码目前为私有仓库或正在整理中' : 'Code repo is currently private'"
        >
          <Github class="w-3.5 h-3.5" />
          <span>{{ translations[locale].privateSource }}</span>
        </div>

        <a 
          v-if="project.demoUrl && project.demoUrl !== '#'"
          :href="project.demoUrl" 
          target="_blank"
          @click.stop
          class="flex items-center justify-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyber-violet to-cyber-cyan hover:shadow-md hover:shadow-cyber-violet/10 transition-all"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>{{ translations[locale].visitDemo }}</span>
        </a>
        <div 
          v-else
          @click.stop
          class="flex items-center justify-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 bg-slate-100/50 dark:bg-slate-900/40 dark:text-slate-600 border border-slate-200/40 dark:border-slate-850 cursor-not-allowed"
          :title="locale === 'zh' ? 'Demo 正在云端部署并配置域名中，敬请期待' : 'Demo instance is currently launching'"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>{{ translations[locale].comingSoon }}</span>
        </div>
      </div>

    </div>
  </div>
</template>
