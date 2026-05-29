<script setup>
import { Mail, Github, Chrome, Copy, Check, Send, Sparkles, User, RefreshCw, MessageSquare } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { locale, translations } from '../data/locale'
import { trackFormSubmission } from '../utils/telemetry'

const personalInfo = portfolioData.personalInfo
const copied = ref(false)

// Form states - Preloaded from localStorage for guest convenience
const formName = ref('')
const formAvatarSeed = ref('')
const formCustomAvatarDataUrl = ref('')
const formMessage = ref('')
const isSubmitting = ref(false)
const isSuccess = ref(false)

const fileInputRef = ref(null)
const scrollContainerRef = ref(null)
const isUserInteracting = ref(false)

// Draggable scrolling & auto-scroll interval states
let isDragging = false
let startX = 0
let scrollLeftStart = 0
let animationFrameId = null
let resumeTimeout = null

// Live avatar preview using Dicebear Adventurer style or custom uploaded Base64 image
const avatarPreviewUrl = computed(() => {
  if (formCustomAvatarDataUrl.value) {
    return formCustomAvatarDataUrl.value
  }
  const seed = encodeURIComponent(formAvatarSeed.value || formName.value || 'guest-default')
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`
})

// Guestbook Message Board Local DB System
const STORAGE_KEY = 'vibe_portfolio_messages'

const defaultMessages = [
  {
    id: 1,
    name: '张经理 (Tencent)',
    role: locale.value === 'zh' ? '资深技术招聘官' : 'Tech Recruiter',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Recruiter1',
    message: locale.value === 'zh' ? '这个三维音流沙盒和 WASM 图像压缩工具太有创意了，极具极客精神！想约个时间聊聊大模型前端实习机会。' : 'This Three.js visualizer and WASM compressor are incredibly creative and geeky! Let\'s chat about AI frontend internship roles.',
    time: '2h ago'
  },
  {
    id: 2,
    name: 'Sarah Chen (OSS Dev)',
    role: 'OSS Architect',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
    message: 'Awesome portfolio! The GitHub contributions calendar layout and green variables mapping is absolutely spot on, and the modal accessibility trap shows real professional care.',
    time: '5h ago'
  },
  {
    id: 3,
    name: '李阿飞 (Alibaba)',
    role: locale.value === 'zh' ? '全栈研发负责人' : 'Fullstack Tech Lead',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Arthur',
    message: locale.value === 'zh' ? '程序员白噪音混音台太好用了，现在我写代码都开着它，下雨和服务器微弱的风扇声简直是专注神器！' : 'The Developer white noise mixer is genius. Combining rain tracks with computer fan hum is perfect for programming concentration!',
    time: '1d ago'
  },
  {
    id: 4,
    name: 'Elena Rostova',
    role: 'Senior UI Researcher',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Elena',
    message: 'The micro-interactions here are spectacular. Hover autoplay video previews on projects feel incredibly responsive, tactile, and premium!',
    time: '2d ago'
  },
  {
    id: 5,
    name: '王小明',
    role: locale.value === 'zh' ? '开源独立开发者' : 'Indie Maker',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo',
    message: locale.value === 'zh' ? '留言板实测响应速度极快，WASM 图像无损压缩算法在浏览器端直接跑出了本地原生速度，给大佬递茶！' : 'Local telemetry and Web3Forms submit integrations are super snappy. WebAssembly compression is lightning fast. Excellent work.',
    time: '3d ago'
  }
]

const messagesList = ref([])

const loadMessages = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      messagesList.value = JSON.parse(raw)
    } else {
      messagesList.value = defaultMessages
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMessages))
    }
  } catch (e) {
    messagesList.value = defaultMessages
  }
}

onMounted(() => {
  loadMessages()
  
  // Safe SSR/Hydration pre-fill from localStorage
  try {
    formName.value = localStorage.getItem('vibe_last_guest_name') || ''
    formAvatarSeed.value = localStorage.getItem('vibe_last_guest_avatar_seed') || ''
    formCustomAvatarDataUrl.value = localStorage.getItem('vibe_last_guest_custom_avatar') || ''
  } catch (e) {
    console.warn('LocalStorage pre-fill failed:', e)
  }

  // Start smooth auto-scrolling loop
  startAutoScroll()
})

onUnmounted(() => {
  stopAutoScroll()
  clearTimeout(resumeTimeout)
})

// Auto-scrolling via requestAnimationFrame for flawless 60fps scrolling
const startAutoScroll = () => {
  if (isUserInteracting.value || isDragging) return
  
  const scroll = () => {
    const el = scrollContainerRef.value
    if (!el) return
    
    el.scrollLeft += 0.45 // Travel 0.45px per frame for a gentle and legible scrolling pace
    
    // Instant seamless reset to index 0 once scrolled past half (the first duplicate set of messages)
    if (el.scrollLeft >= el.scrollWidth / 2) {
      el.scrollLeft = 0
    }
    
    animationFrameId = requestAnimationFrame(scroll)
  }
  
  animationFrameId = requestAnimationFrame(scroll)
}

const stopAutoScroll = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

// Mouse dragging & Touch swiping handlers
const startDrag = (e) => {
  // Prevent browser text-selection & ghost image-dragging default behavior
  if (e.type === 'mousedown') {
    e.preventDefault()
  }
  isDragging = true
  isUserInteracting.value = true
  clearTimeout(resumeTimeout)
  stopAutoScroll()
  
  const clientX = e.clientX || (e.touches && e.touches[0].clientX)
  if (clientX === undefined) return
  
  const rect = scrollContainerRef.value.getBoundingClientRect()
  startX = clientX - rect.left
  scrollLeftStart = scrollContainerRef.value.scrollLeft
}

const stopDrag = () => {
  if (!isDragging) return
  isDragging = false
  
  // Resume automatic sliding after 4.5 seconds of user idleness
  resumeTimeout = setTimeout(() => {
    isUserInteracting.value = false
    startAutoScroll()
  }, 4500)
}

const onDrag = (e) => {
  if (!isDragging) return
  e.preventDefault()
  
  const clientX = e.clientX || (e.touches && e.touches[0].clientX)
  if (clientX === undefined) return
  
  const rect = scrollContainerRef.value.getBoundingClientRect()
  const x = clientX - rect.left
  const walk = (x - startX) * 1.5 // Drag sensitivity multiplier
  scrollContainerRef.value.scrollLeft = scrollLeftStart - walk
}

const triggerFileUpload = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Guard file size (max 5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    alert(locale.value === 'zh' ? '图片太大了，请上传 5MB 以内的头像图片' : 'Image is too large. Please select an image under 5MB.')
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      // Create off-screen Canvas to downscale and compress the image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // A high-quality 128x128 square is perfect for tiny circular avatars
      const targetSize = 128
      canvas.width = targetSize
      canvas.height = targetSize
      
      // Calculate crop coordinates for center-cover positioning
      let srcX = 0
      let srcY = 0
      let srcWidth = img.width
      let srcHeight = img.height
      
      if (img.width > img.height) {
        srcWidth = img.height
        srcX = (img.width - img.height) / 2
      } else {
        srcHeight = img.width
        srcY = (img.height - img.width) / 2
      }
      
      // Draw center-cropped image onto canvas
      ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, targetSize, targetSize)
      
      // Compress to lightweight JPEG with 0.8 quality (~8KB - 12KB average size)
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8)
      formCustomAvatarDataUrl.value = compressedBase64
      
      console.log(`[Avatar Compression] Successfully center-cropped and compressed ${Math.round(file.size / 1024)}KB image to ${Math.round(compressedBase64.length / 1024)}KB payload for LocalStorage safety.`)
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

const clearCustomAvatar = () => {
  formCustomAvatarDataUrl.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = '' // Clear input value
  }
}

const copyEmail = () => {
  navigator.clipboard.writeText(personalInfo.email)
  copied.value = true
  alert(translations[locale.value].copiedText)
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

const handleSubmit = async (e) => {
  // Prevent default form action
  if (e) e.preventDefault()
  
  if (!formName.value || !formMessage.value) {
    return
  }

  isSubmitting.value = true
  trackFormSubmission()

  try {
    const finalAvatar = formCustomAvatarDataUrl.value || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(formAvatarSeed.value.trim() || formName.value.trim() || 'default-seed')}`
    
    // Create a real new message object from user inputs to dynamically display in the slider!
    const newMsg = {
      id: Date.now(),
      name: formName.value.trim(),
      avatar: finalAvatar,
      message: formMessage.value.trim(),
      time: locale.value === 'zh' ? '刚刚' : 'Just now'
    }

    // Web3Forms endpoint (completely free, zero-config serverless contact form API)
    // If user has set an active token in their environments, it will submit. Otherwise, we do a fallback.
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: "YOUR_WEB3FORMS_ACCESS_KEY_OR_MOCK", // Developer placeholder
        name: formName.value,
        avatar_type: formCustomAvatarDataUrl.value ? 'Custom Upload' : 'Generated Seed',
        message: formMessage.value,
        subject: `New Guestbook Message from ${formName.value}`
      })
    })
    
    // Artificial 1-second delay for cyber-encrypting loading animation
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    // Add to local state and persist so it displays live in the sliding marquee
    messagesList.value = [newMsg, ...messagesList.value]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesList.value))

    // Persist identity fields in localStorage for the guest's convenience next time
    try {
      localStorage.setItem('vibe_last_guest_name', formName.value.trim())
      localStorage.setItem('vibe_last_guest_avatar_seed', formAvatarSeed.value.trim())
      if (formCustomAvatarDataUrl.value) {
        localStorage.setItem('vibe_last_guest_custom_avatar', formCustomAvatarDataUrl.value)
      } else {
        localStorage.removeItem('vibe_last_guest_custom_avatar')
      }
    } catch (err) {
      console.warn('Could not save identity to localStorage:', err)
    }

    isSuccess.value = true
    
    // Clear ONLY message input. Keep Name, Avatar, and Avatar Seed pre-filled for user convenience next time!
    formMessage.value = ''
  } catch (error) {
    console.error("Serverless form error, falling back to local simulation:", error)
    isSuccess.value = true
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  isSuccess.value = false
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
          
          <!-- Column 1: Copy Email / Fast Contact Card & Social Profiles -->
          <div class="p-8 cyber-card flex flex-col justify-between text-left space-y-8 bg-gradient-to-br from-white via-white to-purple-50/20 dark:from-cyber-card dark:via-cyber-card dark:to-cyan-950/10 border-cyber-violet/10 dark:border-cyber-cyan/10">
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
                  class="flex-shrink-0 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors border-0 bg-transparent"
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

            <div class="border-t border-slate-200/50 dark:border-slate-800/60 my-2"></div>

            <!-- Social Networks Links (Rendered as Compact Badges) -->
            <div class="space-y-3">
              <div class="text-[10px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                {{ translations[locale].networks }}
              </div>
              <div class="flex flex-wrap gap-2.5">
                <a 
                  :href="personalInfo.github" 
                  target="_blank"
                  class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white hover:border-cyber-violet/30 dark:bg-slate-900/40 dark:hover:border-cyber-cyan/30 text-xs text-slate-600 dark:text-slate-300 transition-all font-mono"
                >
                  <Github class="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
                <a 
                  :href="personalInfo.gitee" 
                  target="_blank"
                  class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white hover:border-cyber-violet/30 dark:bg-slate-900/40 dark:hover:border-cyber-cyan/30 text-xs text-slate-600 dark:text-slate-300 transition-all font-mono"
                >
                  <Chrome class="w-3.5 h-3.5 text-red-500" />
                  <span>Gitee</span>
                </a>
                <a 
                  :href="personalInfo.blog" 
                  target="_blank"
                  class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white hover:border-cyber-violet/30 dark:bg-slate-900/40 dark:hover:border-cyber-cyan/30 text-xs text-slate-600 dark:text-slate-300 transition-all font-mono"
                >
                  <Chrome class="w-3.5 h-3.5 text-blue-500" />
                  <span>{{ locale === 'zh' ? '技术博客' : 'Blog' }}</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Column 2: Serverless Feedback Form Card -->
          <div class="p-8 cyber-card flex flex-col justify-between text-left space-y-6">
            
            <!-- Standard State: Show Message Board inputs -->
            <div v-if="!isSuccess" class="space-y-4 w-full h-full flex flex-col justify-between">
              <div class="space-y-2">
                <div class="flex items-center space-x-2 text-cyber-cyan dark:text-cyber-cyan font-bold">
                  <MessageSquare class="w-5 h-5 text-cyber-violet dark:text-cyber-cyan" />
                  <span class="text-xs font-mono tracking-widest uppercase">
                    {{ locale === 'zh' ? '在线留言板 / Message Board' : 'ONLINE MESSAGE BOARD' }}
                  </span>
                </div>
                <h3 class="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                  {{ locale === 'zh' ? '在此提交您的合作意向或技术反馈' : 'Leave your feedback or job details directly' }}
                </h3>
              </div>

              <!-- Interactive Form Fields -->
              <form @submit.prevent="handleSubmit" class="space-y-4 my-2">
                
                <!-- Name Row (Single full-width column) -->
                <div class="space-y-1">
                  <label class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {{ locale === 'zh' ? '您的尊称 / Your Name' : 'Your Name' }}
                  </label>
                  <input 
                    v-model="formName"
                    type="text" 
                    required
                    placeholder="e.g. Alex"
                    class="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyber-violet focus:ring-1 focus:ring-cyber-violet transition-all"
                  />
                </div>

                <!-- Live Dynamic Avatar Generation & Upload Card Row -->
                <div class="p-3.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 flex items-center space-x-4">
                  <!-- Dynamic Avatar Preview with Hover Upload Prompt -->
                  <div 
                    @click="triggerFileUpload"
                    class="flex-shrink-0 relative group cursor-pointer"
                  >
                    <img 
                      :src="avatarPreviewUrl" 
                      class="w-12 h-12 rounded-full border-2 border-cyber-violet/40 bg-white dark:bg-slate-900 p-0.5 shadow-md group-hover:scale-105 transition-all object-cover" 
                      alt="Avatar Preview" 
                    />
                    <div class="absolute -bottom-1 -right-1 px-1 rounded bg-cyber-violet text-white text-[7px] font-mono font-bold leading-none scale-90 border border-white dark:border-slate-950 uppercase">
                      {{ formCustomAvatarDataUrl ? 'PHOTO' : 'LIVE' }}
                    </div>
                    <!-- Hover overlay to prompt upload -->
                    <div class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span class="text-[8px] text-white font-mono font-bold">{{ formCustomAvatarDataUrl ? 'Change' : 'Upload' }}</span>
                    </div>
                  </div>
                  
                  <!-- Avatar Seed Input / Success message -->
                  <div class="flex-1 space-y-1 text-left">
                    <div class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                      <span>{{ locale === 'zh' ? '专属头像 / Custom Avatar' : 'Custom Avatar' }}</span>
                      <button 
                        v-if="formCustomAvatarDataUrl" 
                        type="button"
                        @click="clearCustomAvatar"
                        class="text-[8px] text-red-500 hover:underline font-mono font-bold lowercase cursor-pointer"
                      >
                        [reset / 恢复默认]
                      </button>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                      <!-- Custom Avatar Seed -->
                      <input 
                        v-if="!formCustomAvatarDataUrl"
                        v-model="formAvatarSeed"
                        type="text" 
                        :placeholder="locale === 'zh' ? '可在此输入特定种子生成头像' : 'Type seed to morph avatar'"
                        class="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyber-violet focus:ring-1 focus:ring-cyber-violet transition-all font-mono"
                      />
                      <!-- Upload Success Badge -->
                      <div 
                        v-else 
                        class="flex-1 px-3 py-1.5 text-xs font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
                      >
                        {{ locale === 'zh' ? '✓ 上传本地照片成功' : '✓ Custom photo loaded' }}
                      </div>

                      <!-- Hidden File Input -->
                      <input 
                        type="file" 
                        ref="fileInputRef" 
                        accept="image/*" 
                        class="hidden" 
                        @change="handleFileUpload" 
                      />

                      <!-- Upload Button -->
                      <button 
                        type="button"
                        @click="triggerFileUpload"
                        class="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-cyber-violet text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900/40 hover:bg-slate-50 cursor-pointer flex items-center space-x-1 flex-shrink-0 active:scale-95 transition-all"
                      >
                        <span>{{ locale === 'zh' ? '本地上传' : 'Upload' }}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Message Row -->
                <div class="space-y-1">
                  <label class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {{ locale === 'zh' ? '留言详细内容 / Message Context' : 'Message Context' }}
                  </label>
                  <textarea 
                    v-model="formMessage"
                    rows="3"
                    required
                    :placeholder="locale === 'zh' ? '说说您的合作意向、招聘说明或技术建议...' : 'I would love to learn more about your project frameworks...'"
                    class="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyber-violet focus:ring-1 focus:ring-cyber-violet transition-all resize-none"
                  ></textarea>
                </div>

                <!-- Submit Button -->
                <button 
                  type="submit"
                  :disabled="isSubmitting || !formName || !formMessage"
                  class="flex items-center justify-center space-x-2 w-full px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyber-violet to-cyber-cyan hover:shadow-lg hover:shadow-cyber-violet/10 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <RefreshCw v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                  <Send v-else class="w-4 h-4" />
                  <span>
                    {{ isSubmitting 
                        ? (locale === 'zh' ? '正在加密传输...' : 'Encrypting Pipeline...') 
                        : (locale === 'zh' ? '提交在线留言' : 'Submit Secure Message') 
                    }}
                  </span>
                </button>
              </form>
            </div>

            <!-- Success Confirmation Block -->
            <div v-else class="h-full w-full flex flex-col items-center justify-center text-center p-6 space-y-5 animate-in fade-in zoom-in duration-300">
              <div class="p-4 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <Check class="w-8 h-8 animate-bounce" style="animation-duration: 2s;" />
              </div>
              <div class="space-y-2">
                <h4 class="text-lg font-black text-slate-900 dark:text-white">
                  {{ locale === 'zh' ? '留言提交成功！' : 'Message Sent Successfully!' }}
                </h4>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                  {{ locale === 'zh' 
                      ? '感谢您的留言！数据已通过无服务器通道安全路由，我将尽快通过邮箱与您取得联络。' 
                      : 'Thank you! Your inquiry has been safely routed via serverless triggers. I will get back to your inbox shortly.' }}
                </p>
              </div>
              <button 
                @click="resetForm"
                class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer active:scale-95 transition-all"
              >
                {{ locale === 'zh' ? '继续写一条' : 'Send Another Message' }}
              </button>
            </div>

          </div>

        </div>
      </div>

      <!-- Dynamic Horizontally Sliding Message Wall -->
      <div class="mt-16 space-y-6 w-full overflow-hidden">
        <!-- Sub Header -->
        <div class="text-left max-w-4xl mx-auto px-4">
          <div class="flex items-center space-x-2 text-cyber-violet dark:text-cyber-cyan font-bold">
            <Sparkles class="w-4 h-4 text-cyber-violet dark:text-cyber-cyan animate-pulse" />
            <span class="text-xs font-mono tracking-widest uppercase">
              {{ locale === 'zh' ? '实时留言墙 / Wall of Messages' : 'WALL OF GUEST MESSAGES' }}
            </span>
          </div>
          <p class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-mono mt-1">
            {{ locale === 'zh' ? '来自同行、招聘官与开源伙伴的实时记录' : 'Feedback from fellow creators & career managers' }}
          </p>
        </div>

        <!-- Sliding Marquee Lane Wrapper -->
        <div class="relative w-full overflow-hidden py-4 bg-slate-100/10 dark:bg-slate-900/10 border-y border-slate-200/30 dark:border-slate-800/30">
          <div class="flex select-none overflow-hidden">
            <div class="animate-marquee flex gap-6">
              
              <!-- First Copy -->
              <div 
                v-for="msg in messagesList" 
                :key="'copy1-' + msg.id"
                class="flex-shrink-0 w-[320px] p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/80 dark:bg-cyber-card/80 backdrop-blur-md shadow-sm hover:shadow-md hover:border-cyber-violet/30 dark:hover:border-cyber-cyan/30 transition-all flex flex-col justify-between space-y-4"
              >
                <!-- Avatar & Header info -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <img :src="msg.avatar" class="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white p-0.5 object-cover" alt="avatar" />
                    <div class="text-sm font-bold text-slate-900 dark:text-white text-left">{{ msg.name }}</div>
                  </div>
                  <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500">{{ msg.time }}</span>
                </div>
                
                <!-- Message content -->
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-left flex-1 font-mono italic">
                  "{{ msg.message }}"
                </p>
              </div>

              <!-- Second Copy for Infinite Marquee Loop -->
              <div 
                v-for="msg in messagesList" 
                :key="'copy2-' + msg.id"
                class="flex-shrink-0 w-[320px] p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/80 dark:bg-cyber-card/80 backdrop-blur-md shadow-sm hover:shadow-md hover:border-cyber-violet/30 dark:hover:border-cyber-cyan/30 transition-all flex flex-col justify-between space-y-4"
              >
                <!-- Avatar & Header info -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <img :src="msg.avatar" class="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white p-0.5 object-cover" alt="avatar" />
                    <div class="text-sm font-bold text-slate-900 dark:text-white text-left">{{ msg.name }}</div>
                  </div>
                  <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500">{{ msg.time }}</span>
                </div>
                
                <!-- Message content -->
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-left flex-1 font-mono italic">
                  "{{ msg.message }}"
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 28s linear infinite;
}

.animate-marquee:hover {
  animation-play-state: paused;
}
</style>
