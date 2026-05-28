<script setup>
import { ref, onMounted, computed } from 'vue'
import { Sparkles, Terminal, ArrowRight, Github } from 'lucide-vue-next'
import { portfolioData } from '../data/portfolioData'
import { locale, translations } from '../data/locale'

const personalInfo = portfolioData.personalInfo

const words = computed(() => locale.value === 'zh' 
  ? ["AI 应用开发", "Vibe Coding 程序员", "全栈开发落地", "学生开发者"] 
  : ["AI App Developer", "Vibe Coder", "Fullstack Developer", "Student Engineer"]
)

const currentWordIdx = ref(0)
const typedText = ref('')
const isDeleting = ref(false)
let typingSpeed = 100
let timer = null

const type = () => {
  const currentWord = words.value[currentWordIdx.value]
  
  if (isDeleting.value) {
    typedText.value = currentWord.substring(0, typedText.value.length - 1)
    typingSpeed = 50
  } else {
    typedText.value = currentWord.substring(0, typedText.value.length + 1)
    typingSpeed = 100
  }
  
  if (!isDeleting.value && typedText.value === currentWord) {
    isDeleting.value = true
    typingSpeed = 2000 // wait at full word
  } else if (isDeleting.value && typedText.value === '') {
    isDeleting.value = false
    currentWordIdx.value = (currentWordIdx.value + 1) % words.value.length
    typingSpeed = 500 // wait before typing next
  }
  
  timer = setTimeout(type, typingSpeed)
}

onMounted(() => {
  type()
})

const alertResume = (e) => {
  if (personalInfo.resumeUrl === '#') {
    e.preventDefault()
    alert('📄 个人简历正在同步更新中... 如果急需，欢迎在页面下方通过邮箱直接联系我！')
  }
}
</script>

<template>
  <section class="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
    <!-- Visual background decoration -->
    <div class="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-25">
      <!-- Glow Purple Blur -->
      <div class="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-cyber-violet rounded-full filter blur-[100px] animate-pulse" style="animation-duration: 8s;"></div>
      <!-- Glow Cyan Blur -->
      <div class="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-cyber-cyan rounded-full filter blur-[100px] animate-pulse" style="animation-duration: 6s;"></div>
      <!-- Cyber grid layout -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <!-- Left Side: Profile Text -->
        <div class="lg:col-span-7 flex flex-col items-start space-y-6 text-left">
          
          <!-- Role Badges / Tag -->
          <div class="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 shadow-sm">
            <Sparkles class="w-4 h-4 text-cyber-violet dark:text-cyber-cyan animate-bounce" />
            <span class="text-xs font-semibold font-mono text-slate-700 dark:text-slate-300">
              AI-Augmented Developer
            </span>
          </div>

          <!-- Main Title with Typewriter -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight min-h-[140px] sm:min-h-[160px] lg:min-h-[auto]">
            用 <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-violet via-cyber-cyan to-cyber-neon">AI</span> 放大效率，<br />
            我是 <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-violet to-cyber-cyan font-mono border-r-2 border-cyber-cyan pr-1.5">{{ typedText }}</span>
          </h1>

          <!-- Tagline -->
          <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            {{ locale === 'zh' ? personalInfo.subTagline : personalInfo.subTaglineEn }}
          </p>

          <!-- Core Tags list -->
          <div class="flex flex-wrap gap-2 pt-2">
            <span 
              v-for="role in (locale === 'zh' ? ['AI Agent 应用', '全栈开发', 'Vibe Coding', '效率工具', '快速原型落地'] : ['AI Agents', 'Fullstack', 'Vibe Coding', 'Productivity', 'Rapid Prototyping'])" 
              :key="role"
              class="text-xs font-mono px-3 py-1 rounded-lg border bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
            >
              #{{ role }}
            </span>
          </div>

          <!-- Buttons CTAs -->
          <div class="flex flex-wrap gap-4 pt-4 w-full sm:w-auto">
            <a 
              href="#projects"
              class="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl text-base font-medium text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white hover:scale-[1.02] active:scale-95 shadow-md transition-all duration-200 w-full sm:w-auto"
            >
              <span>{{ translations[locale].viewProjects }}</span>
              <ArrowRight class="w-4 h-4" />
            </a>
            
            <a 
              :href="personalInfo.resumeUrl"
              target="_blank"
              @click="alertResume"
              class="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl text-base font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 dark:text-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700 hover:scale-[1.02] active:scale-95 shadow-sm transition-all duration-200 w-full sm:w-auto"
            >
              <Terminal class="w-4 h-4 text-cyber-violet" />
              <span>{{ translations[locale].getResume }}</span>
            </a>
          </div>

          <!-- Social Shortcuts -->
          <div class="flex items-center space-x-4 pt-4 text-slate-400 dark:text-slate-500">
            <a :href="personalInfo.github" target="_blank" class="hover:text-cyber-violet dark:hover:text-cyber-cyan transition-colors">
              <Github class="w-5 h-5" />
            </a>
            <span class="text-slate-200 dark:text-slate-800">|</span>
            <span class="text-xs font-mono text-slate-500 dark:text-slate-400">
              Vibe Coding Active · Ready for Interview
            </span>
          </div>

        </div>

        <!-- Right Side: Interactive Code Terminal Simulator -->
        <div class="lg:col-span-5 w-full">
          <div class="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-950 text-slate-200 text-left font-mono text-sm leading-relaxed">
            
            <!-- MacOS Window Header -->
            <div class="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
              <div class="flex space-x-2">
                <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div class="text-xs text-slate-400 font-mono">vibe-coding.vue</div>
              <div class="w-10"></div> <!-- spacing -->
            </div>

            <!-- Editor Body -->
            <div class="p-5 space-y-4 text-xs md:text-sm max-h-[360px] overflow-y-auto">
              <div>
                <span class="text-purple-400">&lt;script</span> <span class="text-cyan-400">setup</span><span class="text-purple-400">&gt;</span>
              </div>
              
              <div class="pl-4 text-slate-500 italic">
                // 1. Describe your idea in plain words
              </div>
              
              <div class="pl-4">
                <span class="text-pink-400">const</span> <span class="text-blue-400">idea</span> = <span class="text-amber-300">"基于 Vue + AI 的作品集主页"</span>
              </div>

              <div class="pl-4 text-slate-500 italic">
                // 2. Summon the AI Copilot to scaffold
              </div>

              <div class="pl-4">
                <span class="text-pink-400">const</span> { build, deploy } = <span class="text-green-400">useVibeCoding</span>()
              </div>

              <div class="pl-4">
                <span class="text-pink-400">const</span> <span class="text-blue-400">portfolio</span> = <span class="text-pink-400">await</span> <span class="text-yellow-300">build</span>({<br />
                <span class="pl-4 text-slate-300">framework:</span> <span class="text-amber-300">'Vue3'</span>,<br />
                <span class="pl-4 text-slate-300">styling:</span> <span class="text-amber-300">'TailwindCSS'</span>,<br />
                <span class="pl-4 text-slate-300">developerState:</span> <span class="text-amber-300">'Creative & Fast'</span><br />
                })
              </div>

              <!-- Simulating prompt interface -->
              <div class="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-2 mt-2">
                <div class="flex items-center space-x-2 text-cyber-neon text-xs font-semibold">
                  <Terminal class="w-3.5 h-3.5" />
                  <span>AI EXECUTION ACTIVE</span>
                </div>
                <div class="text-slate-400 text-[11px] leading-relaxed">
                  <span class="text-cyber-cyan">> vibe deploy --prod</span><br />
                  <span>✔ Parsing structure... Done</span><br />
                  <span>✔ Merging layouts and custom styles... Done</span><br />
                  <span class="text-cyber-neon">✔ Production Build successful. Hosting live on web.</span>
                </div>
              </div>

              <div>
                <span class="text-purple-400">&lt;/script&gt;</span>
              </div>
            </div>

            <!-- Terminal status bar -->
            <div class="bg-slate-900 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <div class="flex items-center space-x-2">
                <span class="inline-block w-2 h-2 rounded-full bg-cyber-neon animate-ping"></span>
                <span>Port: 5173 (Vite)</span>
              </div>
              <div>UTF-8</div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </section>
</template>
