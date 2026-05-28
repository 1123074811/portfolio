<script setup>
import { defineProps, defineEmits, onMounted, onUnmounted, watch, ref, computed } from 'vue'
import { X, ExternalLink, Github, Sparkles, CheckCircle2, User, Calendar, Tag, Layers, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { locale, translations } from '../data/locale'

const props = defineProps({
  project: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const currentMediaIndex = ref(0)

// Reset index when the project changes or modal opens
watch(() => props.project, () => {
  currentMediaIndex.value = 0
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
    currentMediaIndex.value = 0
  } else {
    document.body.style.overflow = ''
  }
})

const projectMedia = computed(() => {
  if (props.project && props.project.media && props.project.media.length > 0) {
    return props.project.media
  }
  return props.project ? [
    {
      type: 'image',
      url: props.project.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
    }
  ] : []
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

const handleClose = () => {
  emit('close')
}

// Close on escape key
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = '' // Safety clean-up
})
</script>

<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isOpen && project" 
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 backdrop-blur-md bg-slate-950/70"
      @click.self="handleClose"
    >
      <!-- Modal Container -->
      <div class="relative bg-white dark:bg-cyber-card max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 text-left">
        
        <!-- Header Image area (Carousel with Video Support) -->
        <div class="relative aspect-[21/9] w-full bg-slate-900 flex-shrink-0 group select-none">
          
          <!-- Media Container -->
          <div class="w-full h-full">
            <!-- Image Slide -->
            <div v-if="projectMedia[currentMediaIndex].type === 'image'" class="w-full h-full relative">
              <img 
                :key="'img-modal-' + currentMediaIndex"
                :src="projectMedia[currentMediaIndex].url" 
                :alt="locale === 'zh' ? project.title + ' 详细图片' : project.titleEn + ' details media'"
                class="w-full h-full object-cover"
              />
            </div>
            
            <!-- Video Slide -->
            <div v-else-if="projectMedia[currentMediaIndex].type === 'video'" class="w-full h-full relative">
              <video 
                :key="'vid-modal-' + currentMediaIndex"
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
          </div>

          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none"></div>
          
          <!-- Category & Status Badge Overlay -->
          <div class="absolute bottom-4 left-6 right-6 flex items-center justify-between flex-wrap gap-2 z-10 pointer-events-none">
            <div class="flex items-center space-x-2 pointer-events-auto">
              <span class="text-xs font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-cyber-violet/80 text-white border border-cyber-violet/30">
                {{ locale === 'zh' ? project.category : project.categoryEn }}
              </span>
              <span class="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-900/80 text-white border border-white/10">
                {{ project.year }}
              </span>
            </div>
            
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/15 text-white border border-white/10 backdrop-blur-md pointer-events-auto">
              {{ locale === 'zh' ? project.status : project.statusEn }}
            </span>
          </div>

          <!-- Carousel Navigation Arrows -->
          <div v-if="projectMedia.length > 1" class="absolute inset-y-0 inset-x-4 flex items-center justify-between pointer-events-none">
            <button 
              @click="prevMedia"
              class="p-1.5 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 border border-white/10 backdrop-blur-sm transition-all shadow-md active:scale-90 pointer-events-auto cursor-pointer"
              :title="locale === 'zh' ? '上一个' : 'Previous'"
            >
              <ChevronLeft class="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button 
              @click="nextMedia"
              class="p-1.5 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 border border-white/10 backdrop-blur-sm transition-all shadow-md active:scale-90 pointer-events-auto cursor-pointer"
              :title="locale === 'zh' ? '下一个' : 'Next'"
            >
              <ChevronRight class="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <!-- Carousel Dot Indicators / Badges -->
          <div v-if="projectMedia.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10 bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/5">
            <button 
              v-for="(media, idx) in projectMedia" 
              :key="idx"
              @click="setMedia(idx)"
              class="w-2 h-2 rounded-full transition-all duration-300"
              :class="[
                idx === currentMediaIndex 
                  ? 'bg-cyber-cyan scale-110 shadow-sm shadow-cyber-cyan' 
                  : 'bg-white/40 hover:bg-white/70'
              ]"
              :title="(locale === 'zh' ? '媒体 ' : 'Media ') + (idx + 1)"
            ></button>
          </div>

          <!-- Media Type Badge in corner -->
          <div v-if="projectMedia.length > 1" class="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md text-white border border-white/10 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded shadow-md flex items-center space-x-1">
            <span v-if="projectMedia[currentMediaIndex].type === 'video'" class="flex items-center space-x-1">
              <span class="w-1 h-1 rounded-full bg-red-500 animate-pulse"></span>
              <span>VIDEO</span>
            </span>
            <span v-else>IMAGE {{ currentMediaIndex + 1 }}/{{ projectMedia.length }}</span>
          </div>

          <!-- Close Button -->
          <button 
            @click="handleClose" 
            class="absolute top-4 right-4 p-1.5 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors shadow-md border border-white/10 z-20"
            aria-label="关闭详情"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Scrollable content area -->
        <div class="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
          
          <!-- Title & Subtitle -->
          <div class="space-y-2">
            <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              {{ locale === 'zh' ? project.title : project.titleEn }}
            </h3>
            <p class="text-sm font-mono font-semibold text-cyber-violet dark:text-cyber-cyan leading-relaxed">
              {{ locale === 'zh' ? project.subtitle : project.subtitleEn }}
            </p>
          </div>

          <!-- Detailed Description -->
          <div class="space-y-2">
            <h4 class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2">
              <Layers class="w-4 h-4" />
              <span>{{ locale === 'zh' ? '项目背景与详情 / Project Overview' : 'Project Background & Details' }}</span>
            </h4>
            <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ locale === 'zh' ? project.description : project.descriptionEn }}
            </p>
          </div>

          <!-- Two-column grid for key bullet points -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            
            <!-- Features list -->
            <div class="space-y-3">
              <h4 class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2">
                <Sparkles class="w-4 h-4 text-cyber-violet" />
                <span>{{ locale === 'zh' ? '核心功能 / Key Features' : 'Key Features' }}</span>
              </h4>
              <ul class="space-y-2 pl-0">
                <li 
                  v-for="(feature, index) in (locale === 'zh' ? project.features : project.featuresEn)" 
                  :key="index"
                  class="text-sm text-slate-600 dark:text-slate-300 flex items-start space-x-2"
                >
                  <span class="text-cyber-cyan font-bold leading-none mt-0.5">•</span>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>

            <!-- Highlights list -->
            <div class="space-y-3">
              <h4 class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2">
                <CheckCircle2 class="w-4 h-4 text-cyber-neon" />
                <span>{{ locale === 'zh' ? '技术亮点 / Tech Highlights' : 'Tech Highlights' }}</span>
              </h4>
              <ul class="space-y-2 pl-0">
                <li 
                  v-for="(hl, index) in (locale === 'zh' ? project.highlights : project.highlightsEn)" 
                  :key="index"
                  class="text-sm text-slate-600 dark:text-slate-300 flex items-start space-x-2"
                >
                  <span class="text-cyber-violet font-bold leading-none mt-0.5">•</span>
                  <span>{{ hl }}</span>
                </li>
              </ul>
            </div>

          </div>

          <!-- My Role / Contribution -->
          <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 space-y-2">
            <h4 class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2">
              <User class="w-4 h-4 text-cyber-cyan" />
              <span>{{ locale === 'zh' ? '我的主要贡献 / My Contribution' : 'My Contribution' }}</span>
            </h4>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
              {{ locale === 'zh' ? project.role : project.roleEn }}
            </p>
          </div>

          <!-- Technologies Grid Tags -->
          <div class="space-y-2">
            <h4 class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2">
              <Tag class="w-4 h-4" />
              <span>{{ locale === 'zh' ? '所用技术栈 / Tech Stack' : 'Tech Stack' }}</span>
            </h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tech in project.techStack" 
                :key="tech"
                class="text-xs font-mono px-3 py-1 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/40 dark:border-slate-700/50"
              >
                {{ tech }}
              </span>
            </div>
          </div>

        </div>

        <!-- Footer Actions area -->
        <div class="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4 flex-shrink-0">
          <div class="text-xs text-slate-400 dark:text-slate-500 font-mono">
            * {{ locale === 'zh' ? '源码在 GitHub 开源，支持自建部署' : 'Source code is open-source on GitHub for custom hosting' }}
          </div>
          
          <div class="flex items-center space-x-3">
            <a 
              v-if="project.sourceUrl && project.sourceUrl !== '#'"
              :href="project.sourceUrl" 
              target="_blank"
              class="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <Github class="w-4 h-4" />
              <span>{{ translations[locale].viewSource }}</span>
            </a>
            <div 
              v-else
              class="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 bg-slate-100/50 border border-slate-200 dark:text-slate-600 dark:bg-slate-900/40 dark:border-slate-800 cursor-not-allowed"
              :title="locale === 'zh' ? '该项目源码目前设为私有' : 'The source code of this project is private'"
            >
              <Github class="w-4 h-4" />
              <span>{{ translations[locale].privateSource }}</span>
            </div>

            <a 
              v-if="project.demoUrl && project.demoUrl !== '#'"
              :href="project.demoUrl" 
              target="_blank"
              class="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyber-violet to-cyber-cyan hover:shadow-lg hover:shadow-cyber-violet/20 active:scale-95 transition-all"
            >
              <ExternalLink class="w-4 h-4" />
              <span>{{ translations[locale].visitDemo }}</span>
            </a>
            <div 
              v-else
              class="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 bg-slate-100/50 border border-slate-200 dark:text-slate-600 dark:bg-slate-900/40 dark:border-slate-800 cursor-not-allowed"
              :title="locale === 'zh' ? '演示实例部署中' : 'Demo sandbox is deploying'"
            >
              <ExternalLink class="w-4 h-4" />
              <span>{{ translations[locale].comingSoon }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>
