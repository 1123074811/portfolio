<script setup>
import { defineProps, ref, computed, watch } from 'vue'
import { ArrowLeft, ExternalLink, Github, Sparkles, CheckCircle2, User, Calendar, Tag, Layers, Monitor, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { locale, translations, closeProjectDetails } from '../data/locale'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

const currentMediaIndex = ref(0)

// Reset index when the project changes
watch(() => props.project, () => {
  currentMediaIndex.value = 0
})

const projectMedia = computed(() => {
  if (props.project.media && props.project.media.length > 0) {
    return props.project.media
  }
  return [
    {
      type: 'image',
      url: props.project.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
    }
  ]
})

const nextMedia = () => {
  currentMediaIndex.value = (currentMediaIndex.value + 1) % projectMedia.value.length
}

const prevMedia = () => {
  currentMediaIndex.value = (currentMediaIndex.value - 1 + projectMedia.value.length) % projectMedia.value.length
}

const setMedia = (index) => {
  currentMediaIndex.value = index
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-300">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Sticky Back Navigation Bar -->
      <div class="mb-8 flex items-center justify-between">
        <button 
          @click="closeProjectDetails"
          class="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>{{ locale === 'zh' ? '返回作品集' : 'Back to Portfolio' }}</span>
        </button>
        
        <div class="text-xs font-mono text-slate-400 dark:text-slate-500">
          PROJECT CASE STUDY / {{ project.year }}
        </div>
      </div>

      <!-- Hero Widescreen Cover Banner (Carousel with Video Support) -->
      <div class="relative rounded-3xl overflow-hidden aspect-[21/9] w-full bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-lg mb-10 group select-none">
        
        <!-- Media Container -->
        <div class="w-full h-full">
          <transition
            enter-active-class="transition duration-500 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-350 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            mode="out-in"
          >
            <!-- Image Slide -->
            <div v-if="projectMedia[currentMediaIndex].type === 'image'" :key="'img-slide-' + currentMediaIndex" class="w-full h-full relative">
              <img 
                :src="projectMedia[currentMediaIndex].url" 
                :alt="locale === 'zh' ? project.title + ' 详细图片' : project.titleEn + ' details media'"
                class="w-full h-full object-cover"
              />
            </div>
            
            <!-- Video Slide -->
            <div v-else-if="projectMedia[currentMediaIndex].type === 'video'" :key="'vid-slide-' + currentMediaIndex" class="w-full h-full relative">
              <video 
                :src="projectMedia[currentMediaIndex].url"
                :poster="projectMedia[currentMediaIndex].poster || project.coverImage"
                controls
                autoplay
                muted
                loop
                playsinline
                class="w-full h-full object-cover"
              ></video>
            </div>
          </transition>
        </div>

        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent pointer-events-none"></div>
        
        <!-- Category & Status Badge Overlay inside Hero -->
        <div class="absolute bottom-6 left-6 right-6 flex items-end justify-between flex-wrap gap-4 z-10 pointer-events-none">
          <div class="space-y-2 text-left">
            <span class="text-xs font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-cyber-violet/85 text-white border border-cyber-violet/30 shadow-lg pointer-events-auto">
              {{ locale === 'zh' ? project.category : project.categoryEn }}
            </span>
            <h1 class="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
              {{ locale === 'zh' ? project.title : project.titleEn }}
            </h1>
          </div>
          
          <span class="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/10 backdrop-blur-md shadow-lg font-mono pointer-events-auto">
            {{ locale === 'zh' ? project.status : project.statusEn }}
          </span>
        </div>

        <!-- Carousel Navigation Arrows -->
        <div v-if="projectMedia.length > 1" class="absolute inset-y-0 inset-x-4 flex items-center justify-between pointer-events-none">
          <button 
            @click="prevMedia"
            class="p-2 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 border border-white/10 backdrop-blur-sm transition-all shadow-md active:scale-90 pointer-events-auto cursor-pointer"
            :title="locale === 'zh' ? '上一个' : 'Previous'"
          >
            <ChevronLeft class="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button 
            @click="nextMedia"
            class="p-2 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 border border-white/10 backdrop-blur-sm transition-all shadow-md active:scale-90 pointer-events-auto cursor-pointer"
            :title="locale === 'zh' ? '下一个' : 'Next'"
          >
            <ChevronRight class="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <!-- Carousel Dot Indicators / Badges -->
        <div v-if="projectMedia.length > 1" class="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5">
          <button 
            v-for="(media, idx) in projectMedia" 
            :key="idx"
            @click="setMedia(idx)"
            class="w-2.5 h-2.5 rounded-full transition-all duration-300"
            :class="[
              idx === currentMediaIndex 
                ? 'bg-cyber-cyan scale-110 shadow-sm shadow-cyber-cyan' 
                : 'bg-white/40 hover:bg-white/70'
            ]"
            :title="(locale === 'zh' ? '媒体 ' : 'Media ') + (idx + 1)"
          ></button>
        </div>

        <!-- Media Type Badge in corner -->
        <div v-if="projectMedia.length > 1" class="absolute top-4 right-4 z-10 bg-slate-900/80 backdrop-blur-md text-white border border-white/10 text-[10px] font-mono font-bold uppercase px-2 py-1 rounded-md shadow-md flex items-center space-x-1">
          <span v-if="projectMedia[currentMediaIndex].type === 'video'" class="flex items-center space-x-1">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <span>VIDEO</span>
          </span>
          <span v-else>IMAGE {{ currentMediaIndex + 1 }}/{{ projectMedia.length }}</span>
        </div>
      </div>

      <!-- Core Content Columns Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left 8 Columns: Detail Write-up -->
        <div class="lg:col-span-8 space-y-8">
          
          <!-- Box 1: Subtitle & Description -->
          <div class="p-8 rounded-2xl bg-white dark:bg-cyber-card border border-slate-200/50 dark:border-slate-800/80 shadow-sm space-y-5 text-left">
            <div class="space-y-1">
              <span class="text-[10px] font-mono font-bold tracking-wider uppercase text-cyber-violet dark:text-cyber-cyan">
                CONCEPT STATEMENT
              </span>
              <p class="text-lg font-bold text-slate-800 dark:text-slate-200 leading-relaxed font-mono">
                {{ locale === 'zh' ? project.subtitle : project.subtitleEn }}
              </p>
            </div>
            
            <div class="w-12 h-0.5 bg-slate-200 dark:bg-slate-800"></div>

            <div class="space-y-3">
              <h3 class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2">
                <Layers class="w-4 h-4" />
                <span>{{ locale === 'zh' ? '项目背景与定位 / Project Overview' : 'Project Background & Details' }}</span>
              </h3>
              <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {{ locale === 'zh' ? project.description : project.descriptionEn }}
              </p>
            </div>
          </div>

          <!-- Box 2: Key Features & Technical Highlights -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Features list card -->
            <div class="p-6 rounded-2xl bg-white dark:bg-cyber-card border border-slate-200/50 dark:border-slate-800/80 shadow-sm space-y-4 text-left">
              <h4 class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2">
                <Sparkles class="w-4 h-4 text-cyber-violet" />
                <span>{{ locale === 'zh' ? '核心功能 / Key Features' : 'Key Features' }}</span>
              </h4>
              <ul class="space-y-3 pl-0 list-none">
                <li 
                  v-for="(feature, index) in (locale === 'zh' ? project.features : project.featuresEn)" 
                  :key="index"
                  class="text-sm text-slate-600 dark:text-slate-300 flex items-start space-x-2"
                >
                  <span class="text-cyber-cyan font-bold leading-none mt-1">•</span>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>

            <!-- Highlights list card -->
            <div class="p-6 rounded-2xl bg-white dark:bg-cyber-card border border-slate-200/50 dark:border-slate-800/80 shadow-sm space-y-4 text-left">
              <h4 class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2">
                <CheckCircle2 class="w-4 h-4 text-cyber-neon" />
                <span>{{ locale === 'zh' ? '技术亮点 / Tech Highlights' : 'Tech Highlights' }}</span>
              </h4>
              <ul class="space-y-3 pl-0 list-none">
                <li 
                  v-for="(hl, index) in (locale === 'zh' ? project.highlights : project.highlightsEn)" 
                  :key="index"
                  class="text-sm text-slate-600 dark:text-slate-300 flex items-start space-x-2"
                >
                  <span class="text-cyber-violet font-bold leading-none mt-1">•</span>
                  <span>{{ hl }}</span>
                </li>
              </ul>
            </div>

          </div>

          <!-- Box 3: My Contribution / Role -->
          <div class="p-8 rounded-2xl bg-slate-100/40 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4 text-left">
            <h4 class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2">
              <User class="w-4 h-4 text-cyber-cyan" />
              <span>{{ locale === 'zh' ? '我的主要贡献 / My Contribution' : 'My Contribution & Role' }}</span>
            </h4>
            <p class="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-mono">
              {{ locale === 'zh' ? project.role : project.roleEn }}
            </p>
          </div>

        </div>

        <!-- Right 4 Columns: Sticky Sidebar Specs -->
        <div class="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          <!-- Sidebar Block 1: Quick Actions (Links) -->
          <div class="p-6 rounded-2xl bg-white dark:bg-cyber-card border border-slate-200/50 dark:border-slate-800/80 shadow-sm space-y-4 text-left">
            <div class="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
              <Monitor class="w-4 h-4" />
              <span>{{ locale === 'zh' ? '交互控制 / Direct Links' : 'Live Interactive' }}</span>
            </div>

            <div class="space-y-3">
              <a 
                v-if="project.demoUrl && project.demoUrl !== '#'"
                :href="project.demoUrl" 
                target="_blank"
                class="flex items-center justify-center space-x-2 w-full px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyber-violet to-cyber-cyan hover:shadow-lg hover:shadow-cyber-violet/20 active:scale-95 transition-all"
              >
                <ExternalLink class="w-4 h-4" />
                <span>{{ translations[locale].visitDemo }}</span>
              </a>
              <div 
                v-else
                class="flex items-center justify-center space-x-2 w-full px-5 py-3 rounded-xl text-sm font-semibold text-slate-400 bg-slate-100/50 border border-slate-200 dark:text-slate-600 dark:bg-slate-900/40 dark:border-slate-800 cursor-not-allowed"
                :title="locale === 'zh' ? '演示实例部署中' : 'Demo sandbox is deploying'"
              >
                <ExternalLink class="w-4 h-4" />
                <span>{{ translations[locale].comingSoon }}</span>
              </div>

              <a 
                v-if="project.sourceUrl && project.sourceUrl !== '#'"
                :href="project.sourceUrl" 
                target="_blank"
                class="flex items-center justify-center space-x-2 w-full px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                <Github class="w-4.5 h-4.5" />
                <span>{{ translations[locale].viewSource }}</span>
              </a>
              <div 
                v-else
                class="flex items-center justify-center space-x-2 w-full px-5 py-3 rounded-xl text-sm font-semibold text-slate-400 bg-slate-100/50 border border-slate-200 dark:text-slate-600 dark:bg-slate-900/40 dark:border-slate-800 cursor-not-allowed"
                :title="locale === 'zh' ? '该项目源码目前设为私有' : 'The source code of this project is private'"
              >
                <Github class="w-4.5 h-4.5" />
                <span>{{ translations[locale].privateSource }}</span>
              </div>
            </div>

            <div class="pt-2 text-[10px] text-slate-400 dark:text-slate-500 font-mono text-center leading-normal">
              * {{ locale === 'zh' ? '本项目源码完全遵循 MIT 或相关开源许可进行托管与发布。' : 'Open-sourced repository managed under active developer protocols.' }}
            </div>
          </div>

          <!-- Sidebar Block 2: Tech Stack Grid -->
          <div class="p-6 rounded-2xl bg-white dark:bg-cyber-card border border-slate-200/50 dark:border-slate-800/80 shadow-sm space-y-4 text-left">
            <div class="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
              <Tag class="w-4 h-4" />
              <span>{{ locale === 'zh' ? '采用技术栈 / Stacks' : 'Core Tech Stack' }}</span>
            </div>
            
            <div class="flex flex-wrap gap-2 pt-1">
              <span 
                v-for="tech in project.techStack" 
                :key="tech"
                class="text-xs font-semibold font-mono px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200/50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Sidebar Block 3: Project Specs Card -->
          <div class="p-6 rounded-2xl bg-white dark:bg-cyber-card border border-slate-200/50 dark:border-slate-800/80 shadow-sm space-y-3.5 text-left">
            <div class="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              {{ locale === 'zh' ? '项目规格 / Specifications' : 'Metadata Spec' }}
            </div>
            
            <div class="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                <span>{{ locale === 'zh' ? '立项年份' : 'Fiscal Year' }}</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">{{ project.year }}</span>
              </div>
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                <span>{{ locale === 'zh' ? '所属分类' : 'Vertical Domain' }}</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">{{ locale === 'zh' ? project.category : project.categoryEn }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>{{ locale === 'zh' ? '维护状态' : 'Lifecycle Stage' }}</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">{{ locale === 'zh' ? project.status : project.statusEn }}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>
