<script setup>
import { Mail, Github, Chrome, Copy, Check, Send, Sparkles } from 'lucide-vue-next'
import { ref } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { locale, translations } from '../data/locale'

const personalInfo = portfolioData.personalInfo
const copied = ref(false)

const copyEmail = () => {
  navigator.clipboard.writeText(personalInfo.email)
  copied.value = true
  alert(translations[locale.value].copiedText)
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <section id="contact" class="py-20 bg-slate-100/30 dark:bg-slate-900/10 border-t border-slate-100 dark:border-slate-900">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <h2 class="text-xs font-mono font-bold tracking-widest text-cyber-violet uppercase dark:text-cyber-cyan">
          GET IN TOUCH / {{ locale === 'zh' ? '联系我' : 'CONTACT ME' }}
        </h2>
        <p class="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          {{ translations[locale].contactMeTitle }}
        </p>
        <div class="w-12 h-1 bg-cyber-violet dark:bg-cyber-cyan mx-auto rounded"></div>
        <p class="text-sm text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
          {{ locale === 'zh' 
              ? '如果你也相信 AI 可以放大开发效率，欢迎随时联系我。我正在积极寻找相关的实习机会。' 
              : 'If you also believe that AI has the potential to multiply developer speeds, feel free to reach out. I am actively looking for internship positions.' }}
        </p>
      </div>

      <!-- Main Columns -->
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          <!-- Column 1: Copy Email / Fast Contact Card -->
          <div class="p-8 cyber-card flex flex-col justify-between text-left space-y-6 bg-gradient-to-br from-white via-white to-purple-50/20 dark:from-cyber-card dark:via-cyber-card dark:to-cyan-950/10 border-cyber-violet/10 dark:border-cyber-cyan/10">
            <div class="space-y-4">
              <div class="flex items-center space-x-2 text-cyber-violet dark:text-cyber-cyan font-bold">
                <Mail class="w-5 h-5" />
                <span class="text-xs font-mono tracking-widest uppercase">{{ translations[locale].emailContact }}</span>
              </div>
              
              <h3 class="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {{ locale === 'zh' ? '发送邮件是最直接、最快速的沟通方式' : 'Email is the fastest way for direct communications' }}
              </h3>
              
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ locale === 'zh' 
                    ? '我通常会在 24 小时内回复所有招聘询问或技术交流邮件。期待收到你的来信！' 
                    : 'I typically reply to all career enquiries and technical messages within 24 hours. Looking forward to hearing from you!' }}
              </p>
            </div>

            <!-- Email Display and Copy -->
            <div class="space-y-3">
              <div class="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between font-mono text-sm text-slate-700 dark:text-slate-300">
                <span class="truncate pr-4">{{ personalInfo.email }}</span>
                <button 
                  @click="copyEmail" 
                  class="flex-shrink-0 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                  :title="locale === 'zh' ? '复制邮箱' : 'Copy Email Address'"
                >
                  <Check v-if="copied" class="w-4 h-4 text-emerald-500" />
                  <Copy v-else class="w-4 h-4" />
                </button>
              </div>

              <a 
                :href="'mailto:' + personalInfo.email"
                class="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:scale-[1.01] active:scale-95 transition-all"
              >
                <Send class="w-4 h-4" />
                <span>{{ translations[locale].sendEmail }}</span>
              </a>
            </div>
          </div>

          <!-- Column 2: Social/Portfolio Profiles Links -->
          <div class="p-8 cyber-card flex flex-col justify-between text-left space-y-6">
            <div class="space-y-4">
              <div class="flex items-center space-x-2 text-slate-500 font-bold">
                <Sparkles class="w-4 h-4 text-cyber-cyan" />
                <span class="text-xs font-mono tracking-widest uppercase text-slate-400">{{ translations[locale].networks }}</span>
              </div>
              
              <h3 class="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {{ locale === 'zh' ? '在这些技术社区中，你可以发现更真实的我' : 'Find my authentic traces across technology communities' }}
              </h3>
              
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ locale === 'zh' 
                    ? '我热爱开源和分享，你可以在 GitHub 和技术博客上查看我的更多代码提交记录、提示词工程日志和开发思考。' 
                    : 'I love open-source and sharing. You can explore my Git commit histories, Prompt Engineering logs, and full-stack optimizations on GitHub and my blog.' }}
              </p>
            </div>

            <!-- Profile Links List -->
            <div class="grid grid-cols-1 gap-3">
              <!-- GitHub Link -->
              <a 
                :href="personalInfo.github" 
                target="_blank"
                class="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white hover:border-cyber-violet/30 dark:bg-slate-900/40 dark:hover:border-cyber-cyan/30 hover:shadow-sm transition-all group"
              >
                <div class="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                  <Github class="w-5 h-5 text-slate-900 dark:text-slate-100" />
                  <span class="text-sm font-semibold font-mono">GitHub</span>
                </div>
                <span class="text-xs font-mono text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
              </a>

              <!-- Gitee Link -->
              <a 
                :href="personalInfo.gitee" 
                target="_blank"
                class="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white hover:border-cyber-violet/30 dark:bg-slate-900/40 dark:hover:border-cyber-cyan/30 hover:shadow-sm transition-all group"
              >
                <div class="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                  <Chrome class="w-5 h-5 text-red-500" />
                  <span class="text-sm font-semibold font-mono">{{ locale === 'zh' ? 'Gitee / 码云' : 'Gitee Profile' }}</span>
                </div>
                <span class="text-xs font-mono text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
              </a>

              <!-- Personal Blog Link -->
              <a 
                :href="personalInfo.blog" 
                target="_blank"
                class="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white hover:border-cyber-violet/30 dark:bg-slate-900/40 dark:hover:border-cyber-cyan/30 hover:shadow-sm transition-all group"
              >
                <div class="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                  <Chrome class="w-5 h-5 text-blue-500" />
                  <span class="text-sm font-semibold font-mono">{{ translations[locale].blog }}</span>
                </div>
                <span class="text-xs font-mono text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>
