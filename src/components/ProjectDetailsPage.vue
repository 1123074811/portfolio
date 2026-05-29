<script setup>
import { defineProps, ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ArrowLeft, ExternalLink, Github, Sparkles, CheckCircle2, User, Calendar, Tag, Layers, Monitor, ChevronLeft, ChevronRight, FileText, Terminal, Code2 } from 'lucide-vue-next'
import { locale, translations, closeProjectDetails } from '../data/locale'
import { trackPageView, trackReadmeToggle } from '../utils/telemetry'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

const currentMediaIndex = ref(0)
const showRawReadme = ref(false)

// Reset index and tab when the project changes, and log telemetry pageview
watch(() => props.project, (newProject) => {
  currentMediaIndex.value = 0
  showRawReadme.value = false
  if (newProject) {
    trackPageView(`details:${newProject.id}`)
  }
}, { immediate: true })

// Log telemetry readme toggling action
watch(showRawReadme, (newVal) => {
  if (props.project) {
    trackReadmeToggle(props.project.id, newVal)
  }
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

// Generate a professional repository-grade README file
const getProjectReadme = computed(() => {
  if (props.project.readme) {
    return props.project.readme
  }
  
  const isZh = locale.value === 'zh'
  const title = isZh ? props.project.title : props.project.titleEn
  const subtitle = isZh ? props.project.subtitle : props.project.subtitleEn
  const desc = isZh ? props.project.description : props.project.descriptionEn
  const features = isZh ? props.project.features : props.project.featuresEn
  const highlights = isZh ? props.project.highlights : props.project.highlightsEn
  const role = isZh ? props.project.role : props.project.roleEn
  const tech = props.project.techStack || []
  const year = props.project.year || "2026"
  const repoName = props.project.id ? props.project.id.toLowerCase() : "project-repository"
  const githubUrl = props.project.sourceUrl && props.project.sourceUrl !== "#" ? props.project.sourceUrl : `https://github.com/vibe-coder/${repoName}`
  const demoUrl = props.project.demoUrl && props.project.demoUrl !== "#" ? props.project.demoUrl : `https://${repoName}.vibe.dev`

  if (isZh) {
    return `# ${title}

> ${subtitle}

---

## 📖 项目背景与愿景

${desc}

## ⚡ 核心功能模块

${features.map(f => `- **${f.split('，')[0] || f}**: ${f}`).join('\n')}

## 🛠️ 技术选型与拓扑体系

该项目严格采用现代化、低延时且具有高并发冗余的技术栈架构：

\`\`\`javascript
const ActiveStackConfig = {
  version: "1.0.0",
  year: "${year}",
  frontend: "Vue 3 (Composition API) + Tailwind CSS",
  ecosystem: ${JSON.stringify(tech)},
  deployment: "Vite + Edge Hosting / Cloudflare"
};
\`\`\`

## 💎 架构突破与性能调优

该项目在开发阶段解决了多项核心性能难题：

${highlights.map(h => `- ${h}`).join('\n')}

## 👤 开发贡献说明

- **我的职责**: ${role}

## 🚀 部署指南与快速启动

请确保本地已配置 \`Node.js v18+\` 与包管理器，然后在终端运行：

\`\`\`bash
# 1. 克隆代码仓库到本地
git clone ${githubUrl}.git

# 2. 进入项目主目录并安装系统依赖
cd ${repoName}
npm install

# 3. 启动本地开发服务热加载
npm run dev
\`\`\`

---

*该 README.md 由 Vibe Portfolio Engine 自动装配生成。*
`
  } else {
    return `# ${title}

> ${subtitle}

---

## 📖 Project Background & Vision

${desc}

## ⚡ Key Features

${features.map(f => `- **${f.split(',')[0] || f}**: ${f}`).join('\n')}

## 🛠️ Tech Stack & Ecosystem

Built with highly reliable, scalable, and modern framework protocols:

\`\`\`javascript
const ActiveStackConfig = {
  version: "1.0.0",
  year: "${year}",
  frontend: "Vue 3 (Composition API) + Tailwind CSS",
  ecosystem: ${JSON.stringify(tech)},
  deployment: "Vite + Edge Hosting / Cloudflare"
};
\`\`\`

## 💎 Technical Achievements & Optimizations

This codebase implements critical breakthroughs during its compilation sprint:

${highlights.map(h => `- ${h}`).join('\n')}

## 👤 Role & Contributions

- **Main Responsibilities**: ${role}

## 🚀 Quick Start & Installation

Ensure you have \`Node.js v18+\` and a package manager configured. Run these terminal lines:

\`\`\`bash
# 1. Clone active source branch
git clone ${githubUrl}.git

# 2. Enter workspace folder and install dependencies
cd ${repoName}
npm install

# 3. Fire up hot-reloading development server
npm run dev
\`\`\`

---

*This README.md is dynamically rendered and compiled by Vibe Portfolio Engine.*
`
  }
})

// Lightweight regex-based markdown compiler for custom Tailwind rendering
const parseMarkdown = (markdown) => {
  if (!markdown) return ""
  
  // Escape HTML tags to prevent injections but preserve our generated structure
  let html = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
  
  // Headers
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-6 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800 font-mono tracking-tight">$1</h1>')
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3 pb-1 border-b border-slate-100 dark:border-slate-900/40 flex items-center space-x-2"><span class="text-cyber-violet">#</span> <span>$1</span></h2>')
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-base font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2">$1</h3>')
  
  // Blockquotes (e.g. > subtitle)
  html = html.replace(/^> (.*?)$/gm, '<blockquote class="pl-4 border-l-4 border-cyber-violet/40 text-slate-500 dark:text-slate-400 italic my-4">$1</blockquote>')

  // Horizontal Rules
  html = html.replace(/^---$/gm, '<hr class="my-6 border-slate-200 dark:border-slate-800" />')

  // Fenced Code Blocks (```lang ... ```)
  html = html.replace(/```([\s\S]*?)```/gm, (match, code) => {
    const lines = code.trim().split('\n')
    let lang = 'code'
    if (lines[0] && lines[0].length < 15 && !lines[0].includes(' ') && !lines[0].includes('=')) {
      lang = lines.shift()
    }
    const cleanCode = lines.join('\n')
    return `<div class="my-5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800/80 shadow-sm font-mono text-xs sm:text-sm bg-slate-950 text-slate-100 relative">
      <div class="px-4 py-2 bg-slate-900 text-slate-400 font-mono text-[9px] uppercase tracking-wider flex items-center justify-between border-b border-slate-800/50">
        <span class="flex items-center space-x-1.5">
          <span class="w-2 h-2 rounded-full bg-slate-700"></span>
          <span>${lang}</span>
        </span>
        <span class="text-[9px] text-cyber-cyan font-semibold">LOCAL ENV</span>
      </div>
      <pre class="p-4 overflow-x-auto text-left leading-relaxed"><code class="select-text">${cleanCode}</code></pre>
    </div>`
  })
  
  // Inline Code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-cyber-violet dark:text-cyber-cyan font-mono text-xs border border-slate-200/20">$1</code>')
  
  // Bold (**text**)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
  
  // Safe links & image protocol block (Anti-XSS Sanitizer)
  html = html.replace(/href="javascript:/gi, 'href="#unsafe-script-blocked')
  html = html.replace(/src="javascript:/gi, 'src="#unsafe-script-blocked')

  // Simple Bullet Lists
  html = html.replace(/^\s*[\-\*]\s+(.*?)$/gm, '<div class="text-sm sm:text-base text-slate-600 dark:text-slate-300 ml-4 pl-1 leading-relaxed flex items-start space-x-2 my-2"><span class="text-cyber-violet dark:text-cyber-cyan font-bold">•</span><span>$1</span></div>')

  // Paragraphs grouping
  const paragraphs = html.split('\n\n')
  html = paragraphs.map(p => {
    const trimmed = p.trim()
    if (!trimmed) return ''
    if (trimmed.startsWith('<h') || trimmed.startsWith('<div') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<hr') || trimmed.startsWith('<pre')) {
      return trimmed
    }
    return `<p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed my-3">${trimmed}</p>`
  }).join('\n')
  
  return html
}

const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    closeProjectDetails()
  } else if (e.key === 'ArrowLeft') {
    prevMedia()
  } else if (e.key === 'ArrowRight') {
    nextMedia()
  } else if (e.key === 'Tab') {
    // Keyboard Focus Trap for accessibility
    const modal = document.querySelector('.project-details-container')
    if (!modal) return
    const focusables = modal.querySelectorAll('button, a, input, select, textarea, [tabindex="0"]')
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    
    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === last) {
        first.focus()
        e.preventDefault()
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  // Shift focus to the details container for seamless accessibility
  setTimeout(() => {
    const backBtn = document.querySelector('.back-navigation-btn')
    if (backBtn) backBtn.focus()
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="project-details-container min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-300">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Sticky Back Navigation Bar -->
      <div class="mb-8 flex items-center justify-between">
        <button 
          @click="closeProjectDetails"
          class="back-navigation-btn inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95"
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

          <!-- Box 4: GitHub-style README Module -->
          <div class="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md bg-white dark:bg-cyber-card overflow-hidden text-left flex flex-col">
            
            <!-- README Header resembling GitHub repository header tab -->
            <div class="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-3">
              <div class="flex items-center space-x-2.5 font-mono text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                <FileText class="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>README.md</span>
                <span class="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-normal">main</span>
              </div>

              <!-- Raw / Preview toggle controls -->
              <div class="flex items-center bg-slate-200/55 dark:bg-slate-950/80 rounded-xl p-0.5 border border-slate-200/20">
                <button 
                  @click="showRawReadme = false"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all select-none cursor-pointer"
                  :class="[
                    !showRawReadme 
                      ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-transparent border-0'
                  ]"
                >
                  <Terminal class="w-3.5 h-3.5" />
                  <span>{{ locale === 'zh' ? '页面预览' : 'Preview' }}</span>
                </button>
                <button 
                  @click="showRawReadme = true"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all select-none cursor-pointer"
                  :class="[
                    showRawReadme 
                      ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-transparent border-0'
                  ]"
                >
                  <Code2 class="w-3.5 h-3.5" />
                  <span>{{ locale === 'zh' ? '原始源码' : 'Raw Markdown' }}</span>
                </button>
              </div>
            </div>

            <!-- README Content Area -->
            <div class="p-6 sm:p-8 overflow-hidden">
              <!-- Rendered markdown preview -->
              <div 
                v-if="!showRawReadme" 
                v-html="parseMarkdown(getProjectReadme)"
                class="select-text prose-custom"
              ></div>
              
              <!-- Raw markdown code display -->
              <div v-else class="relative font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/50 p-4 sm:p-6 rounded-xl border border-slate-200/60 dark:border-slate-800/80 overflow-x-auto text-left leading-relaxed">
                <div class="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-slate-900 text-[10px] text-slate-500 uppercase font-bold tracking-wider pointer-events-none">
                  MARKDOWN
                </div>
                <pre class="select-text whitespace-pre-wrap"><code>{{ getProjectReadme }}</code></pre>
              </div>
            </div>

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
