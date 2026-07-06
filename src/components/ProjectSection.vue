<script setup>
import { ref, computed, watch } from 'vue'
import { projects, categories as categoriesZh, categoriesEn } from '../data/portfolio'
import ProjectCard from './ProjectCard.vue'
import ProjectFilter from './ProjectFilter.vue'
import { Sparkles, Compass, ChevronDown, ChevronUp } from 'lucide-vue-next'
import { locale, translations, openProjectDetails } from '../data/locale'
import { trackFilterClick } from '../utils/telemetry'

const categories = computed(() => locale.value === 'zh' ? categoriesZh : categoriesEn)

const activeCategory = ref('全部')
const isExpanded = ref(false)
const limit = ref(6) // Only show 6 initially

// Reset activeCategory when locale changes
watch(locale, (newVal) => {
  activeCategory.value = newVal === 'zh' ? '全部' : 'All'
})

// Reset expansion state when filtering categories
watch(activeCategory, () => {
  isExpanded.value = false
})

const filteredProjects = computed(() => {
  const allLabel = locale.value === 'zh' ? '全部' : 'All'
  if (activeCategory.value === allLabel) {
    return projects
  }
  return projects.filter(p => {
    const cat = locale.value === 'zh' ? p.category : p.categoryEn
    return cat === activeCategory.value
  })
})

const displayedProjects = computed(() => {
  if (isExpanded.value) {
    return filteredProjects.value
  }
  return filteredProjects.value.slice(0, limit.value)
})

const hasMore = computed(() => {
  return filteredProjects.value.length > limit.value
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const changeCategory = (cat) => {
  activeCategory.value = cat
  trackFilterClick(cat)
}
</script>

<template>
  <section id="projects" class="py-20 bg-slate-50 dark:bg-slate-950/20">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <h2 class="text-xs font-mono font-bold tracking-widest text-cyber-violet uppercase dark:text-cyber-cyan">
          MY PORTFOLIO / {{ locale === 'zh' ? '项目作品' : 'PROJECT LAB' }}
        </h2>
        <p class="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          {{ locale === 'zh' ? '从灵感到上线的项目实践' : 'Delivering My Ideas Into Running Products' }}
        </p>
        <div class="w-12 h-1 bg-cyber-violet dark:bg-cyber-cyan mx-auto rounded"></div>
        <p class="text-sm text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
          {{ locale === 'zh' 
              ? '这里展示了我在 AI 应用、Web 全栈、效率工具和创意实验方向上的项目实践。每个项目都尽量体现一个真实问题、一套解决方案和一次完整的开发过程。' 
              : 'A curated showcase of my engineering explorations across AI integrations, full-stack ecosystems, dev productivity tools, and interactive art laboratories.' }}
        </p>
      </div>

      <!-- Filter Controls -->
      <div class="mb-12">
        <ProjectFilter 
          :categories="categories" 
          :activeCategory="activeCategory" 
          @changeCategory="changeCategory"
        />
      </div>

      <!-- Projects Grid Layout with Transition Group -->
      <transition-group 
        v-if="displayedProjects.length > 0" 
        tag="div" 
        name="project-list"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <div 
          v-for="project in displayedProjects" 
          :key="project.id"
          class="transition-all duration-500 transform origin-center"
        >
          <ProjectCard :project="project" @open-details="openProjectDetails" />
        </div>
      </transition-group>

      <!-- Show More / Less Button -->
      <div v-if="hasMore" class="mt-12 flex justify-center animate-in fade-in zoom-in duration-300">
        <button 
          @click="toggleExpand"
          class="group relative inline-flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 dark:text-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-md hover:shadow-cyber-violet/5 hover:border-cyber-violet/20 active:scale-[0.98] cursor-pointer overflow-hidden"
        >
          <!-- Gradient border glow -->
          <span class="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyber-violet/10 to-cyber-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          
          <span class="relative z-10">
            {{ isExpanded 
                ? (locale === 'zh' ? '收起部分作品' : 'Show Less') 
                : (locale === 'zh' ? `展开全部作品 (${filteredProjects.length})` : `Show All Projects (${filteredProjects.length})`) 
            }}
          </span>
          <component 
            :is="isExpanded ? ChevronUp : ChevronDown" 
            class="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-cyber-violet dark:group-hover:text-cyber-cyan transition-colors relative z-10"
          />
        </button>
      </div>

      <!-- Empty State -->
      <div 
        v-else 
        class="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/10 max-w-md mx-auto text-center space-y-4"
      >
        <div class="p-4 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500">
          <Compass class="w-8 h-8 animate-spin" style="animation-duration: 10s;" />
        </div>
        <div class="space-y-1.5">
          <h4 class="text-base font-bold text-slate-800 dark:text-slate-200">
            {{ locale === 'zh' ? '新灵感正在孵化' : 'Incubating New Ideas' }}
          </h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {{ locale === 'zh' ? '这个方向还在持续探索中，新的项目很快就会上线。' : 'I am currently incubating and designing prototype layouts in this field. Stay tuned!' }}
          </p>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.project-list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}
.project-list-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.project-list-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.project-list-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}
.project-list-move {
  transition: transform 0.5s ease;
}
</style>
