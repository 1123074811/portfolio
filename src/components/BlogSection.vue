<script setup>
import { BookOpen, Calendar, Clock, ArrowRight, Tag } from 'lucide-vue-next'
import { portfolioData } from '../data/portfolioData'
import { locale, translations } from '../data/locale'

const articles = portfolioData.blogArticles

const alertBlog = (e) => {
  e.preventDefault()
  alert(locale.value === 'zh' 
    ? '📝 个人博客文章正在部署到云端 GitBook/Notion... 先在下方查看我们的精彩摘要吧！' 
    : '📝 Tech blog is currently deploying to GitBook/Notion... Enjoy the quick excerpts below in the meantime!')
}
</script>

<template>
  <section id="blog" class="py-20 bg-slate-50 dark:bg-slate-950/20">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <h2 class="text-xs font-mono font-bold tracking-widest text-cyber-violet uppercase dark:text-cyber-cyan">
          TECHNICAL BLOG / 技术分享
        </h2>
        <p class="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          {{ locale === 'zh' ? '用深度复盘与写作固化技术成长' : 'Solidifying Growth via Writing & Auditing' }}
        </p>
        <div class="w-12 h-1 bg-cyber-violet dark:bg-cyber-cyan mx-auto rounded"></div>
        <p class="text-sm text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
          {{ locale === 'zh' 
              ? '我相信不仅要产出高效率的代码，还要沉淀方法论。这里记录了我对 Vibe Coding 开发范式、前端深度学习实践、以及全栈系统优化的见解。' 
              : 'I believe in both ship-fast codes and solid method conceptualizations. Here is my digest on Vibe Coding pipelines, browser ML models, and full-stack DB locks.' }}
        </p>
      </div>

      <!-- Articles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <article 
          v-for="art in articles" 
          :key="art.id"
          class="cyber-card flex flex-col justify-between p-6 bg-white dark:bg-cyber-card border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl hover:border-cyber-violet/20 dark:hover:border-cyber-cyan/20 transition-all duration-300 group text-left"
        >
          <div class="space-y-4">
            <!-- Article Meta (Category & Date) -->
            <div class="flex items-center justify-between text-xs font-mono">
              <span class="px-2.5 py-1 rounded-lg bg-cyber-violet/5 text-cyber-violet dark:bg-cyber-cyan/5 dark:text-cyber-cyan font-bold">
                {{ locale === 'zh' ? art.category : art.categoryEn }}
              </span>
              <span class="text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                <Calendar class="w-3.5 h-3.5" />
                <span>{{ art.date }}</span>
              </span>
            </div>

            <!-- Title & Excerpt -->
            <div class="space-y-2">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyber-violet dark:group-hover:text-cyber-cyan transition-colors leading-snug">
                {{ locale === 'zh' ? art.title : art.titleEn }}
              </h3>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                {{ locale === 'zh' ? art.excerpt : art.excerptEn }}
              </p>
            </div>
          </div>

          <!-- Tags & CTA Action footer -->
          <div class="space-y-4 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <!-- Dynamic Tags list -->
            <div class="flex flex-wrap gap-1.5">
              <span 
                v-for="tag in art.tags" 
                :key="tag"
                class="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-slate-500 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-400"
              >
                <Tag class="w-2.5 h-2.5 text-slate-400" />
                <span>{{ tag }}</span>
              </span>
            </div>

            <!-- Read More Button anchor -->
            <a 
              href="#" 
              @click="alertBlog"
              class="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-cyber-violet dark:text-slate-300 dark:hover:text-cyber-cyan transition-colors group-hover:translate-x-1 transition-transform duration-200"
            >
              <span>{{ translations[locale].readMore }}</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
          </div>

        </article>

      </div>

      <!-- External Blog Portal Button -->
      <div class="mt-12 text-center">
        <a 
          href="#" 
          @click="alertBlog"
          class="inline-flex items-center space-x-2 px-5 py-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60 transition-all shadow-sm active:scale-95"
        >
          <BookOpen class="w-4 h-4 text-cyber-violet dark:text-cyber-cyan" />
          <span>{{ locale === 'zh' ? '进入我的完整技术主页 (GitBook)' : 'Visit My Full Tech Hub (GitBook)' }}</span>
        </a>
      </div>

    </div>
  </section>
</template>
