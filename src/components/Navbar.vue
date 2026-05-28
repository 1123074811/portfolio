<script setup>
import { ref, onMounted, computed } from 'vue'
import { Menu, X, Sun, Moon, Download, Languages } from 'lucide-vue-next'
import { portfolioData } from '../data/portfolioData'
import { locale, toggleLocale, translations } from '../data/locale'

const personalInfo = portfolioData.personalInfo

const navItems = computed(() => [
  { name: translations[locale.value].about, href: '#about' },
  { name: translations[locale.value].projects, href: '#projects' },
  { name: translations[locale.value].skills, href: '#skills' },
  { name: translations[locale.value].blog, href: '#blog' },
  { name: translations[locale.value].experience, href: '#experience' },
  { name: translations[locale.value].contact, href: '#contact' }
])

const isOpen = ref(false)
const isDarkMode = ref(false)
const isScrolled = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  // Initialize dark mode
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDarkMode.value = false
    document.documentElement.classList.remove('dark')
  }

  // Handle scroll shadow
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })
})

const alertResume = (e) => {
  if (personalInfo.resumeUrl === '#') {
    e.preventDefault()
    alert('📄 个人简历正在同步更新中... 如果急需，欢迎在页面下方通过邮箱直接联系我！')
  }
}
</script>

<template>
  <nav 
    class="fixed top-0 left-0 w-full z-50 transition-all duration-300"
    :class="[
      isScrolled 
        ? 'glass-panel py-3 shadow-md border-b' 
        : 'bg-transparent py-5 border-b border-transparent'
    ]"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-10">
        <!-- Logo / Name -->
        <div class="flex-shrink-0">
          <a href="#" class="flex items-center space-x-2 group">
            <span class="text-2xl">🚀</span>
            <span class="font-mono font-bold text-lg tracking-wider text-slate-900 dark:text-white group-hover:text-cyber-violet dark:group-hover:text-cyber-cyan transition-colors duration-300">
              &lt;{{ personalInfo.name }} /&gt;
            </span>
          </a>
        </div>

        <!-- Desktop Navigation Items -->
        <div class="hidden md:flex items-center space-x-8">
          <a 
            v-for="item in navItems" 
            :key="item.name" 
            :href="item.href"
            class="text-sm font-medium text-slate-600 hover:text-cyber-violet dark:text-slate-300 dark:hover:text-cyber-cyan transition-colors duration-200"
          >
            {{ item.name }}
          </a>
        </div>

        <!-- Right Side: Dark Mode Toggle & Language & Resume -->
        <div class="hidden md:flex items-center space-x-4">
          <!-- Language Switcher Button -->
          <button 
            @click="toggleLocale" 
            class="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border border-slate-200/50 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all duration-200"
            :title="locale === 'zh' ? 'Switch to English' : '切换为中文'"
          >
            <Languages class="w-3.5 h-3.5 text-cyber-cyan animate-spin" style="animation-duration: 20s;" />
            <span>{{ locale === 'zh' ? 'EN' : 'ZH' }}</span>
          </button>

          <!-- Dark Mode Toggle Button -->
          <button 
            @click="toggleDarkMode" 
            class="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 transition-all duration-200"
            aria-label="切换主题"
          >
            <Sun v-if="isDarkMode" class="w-5 h-5 text-amber-500" />
            <Moon v-else class="w-5 h-5 text-slate-600" />
          </button>

          <!-- Download Resume Button -->
          <a 
            :href="personalInfo.resumeUrl"
            target="_blank"
            @click="alertResume"
            class="flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-cyber-violet to-cyber-cyan hover:shadow-lg hover:shadow-cyber-violet/20 active:scale-95 transition-all duration-200"
          >
            <Download class="w-4 h-4" />
            <span>{{ translations[locale].downloadResume }}</span>
          </a>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <div class="flex md:hidden items-center space-x-2">
          <!-- Language Switcher Mobile -->
          <button 
            @click="toggleLocale" 
            class="p-2 rounded-xl text-xs font-mono font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/30"
            title="Switch Language"
          >
            <Languages class="w-5 h-5 text-cyber-cyan" />
          </button>

          <!-- Dark Mode Toggle Mobile -->
          <button 
            @click="toggleDarkMode" 
            class="p-2 rounded-xl text-slate-500 dark:text-slate-400"
            aria-label="切换主题"
          >
            <Sun v-if="isDarkMode" class="w-5 h-5 text-amber-400" />
            <Moon v-else class="w-5 h-5 text-slate-600" />
          </button>

          <!-- Menu Button -->
          <button 
            @click="toggleMenu" 
            class="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="菜单"
          >
            <X v-if="isOpen" class="w-6 h-6" />
            <Menu v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div 
        v-if="isOpen" 
        class="md:hidden glass-panel border-b absolute top-full left-0 w-full shadow-lg"
      >
        <div class="px-4 pt-2 pb-6 space-y-3 sm:px-3">
          <a 
            v-for="item in navItems" 
            :key="item.name" 
            :href="item.href"
            @click="isOpen = false"
            class="block px-4 py-2 rounded-xl text-base font-medium text-slate-700 hover:text-cyber-violet dark:text-slate-200 dark:hover:text-cyber-cyan hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors"
          >
            {{ item.name }}
          </a>
          
          <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col px-4">
            <a 
              :href="personalInfo.resumeUrl"
              target="_blank"
              @click="alertResume"
              class="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-cyber-violet to-cyber-cyan shadow-sm active:scale-95 transition-all"
            >
              <Download class="w-4 h-4" />
              <span>{{ translations[locale].downloadResume }} (PDF)</span>
            </a>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>
