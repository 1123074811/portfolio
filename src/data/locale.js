import { ref } from 'vue'

export const locale = ref(localStorage.getItem('locale') || 'zh')
export const currentProject = ref(null)

export const toggleLocale = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
  localStorage.setItem('locale', locale.value)
}

export const openProjectDetails = (project) => {
  currentProject.value = project
  window.scrollTo({ top: 0, behavior: 'instant' })
}

export const closeProjectDetails = () => {
  currentProject.value = null
  setTimeout(() => {
    const el = document.getElementById('projects')
    if (el) el.scrollIntoView({ behavior: 'instant' })
  }, 50)
}

export const translations = {
  zh: {
    about: '关于我',
    projects: '精选项目',
    skills: '工具箱',
    experience: '成长轨迹',
    contact: '联系我',
    blog: '技术分享',
    downloadResume: '下载简历',
    offlineResume: '下载离线简历 (PDF)',
    viewProjects: '查看我的项目',
    getResume: '获取个人简历',
    tagline: '用 AI 放大效率，把想法快速变成可运行作品。',
    subTagline: '我关注 AI 应用开发、Web 全栈项目和效率工具构建，喜欢借助 AI 编程工具快速完成原型设计、功能开发与项目落地。',
    manifestoTitle: '我的开发宣言',
    manifestoText: '"AI 并没有取代程序员，AI 正在赋予每个有想法的程序员十倍甚至百倍的前进动力。我想成为那个跑在时代最前面、不断落地产品想法的人。"',
    targetRoles: '求职意向 / TARGET ROLES',
    contactMeTitle: '一起聊聊项目、机会或有趣的想法',
    emailContact: '邮件联络 / EMAIL',
    networks: '网络身份 / NETWORKS',
    sendEmail: '立即发送邮件',
    visitDemo: '在线预览',
    viewSource: '查看源码',
    privateSource: '源码私有',
    comingSoon: 'Demo 准备中',
    copiedText: '邮箱已复制到剪贴板！',
    viewAll: '全部',
    readMore: '阅读更多',
    visitorStats: '访客数据监控',
    statsToday: '今日访客',
    statsTotal: '历史累积',
    statsOnline: '实时在线',
    statsServer: '服务状态',
    statsActive: '正常运行'
  },
  en: {
    about: 'About Me',
    projects: 'Projects',
    skills: 'Skills',
    experience: 'Timeline',
    contact: 'Contact Me',
    blog: 'Tech Blog',
    downloadResume: 'Get Resume',
    offlineResume: 'Download Resume (PDF)',
    viewProjects: 'View My Projects',
    getResume: 'Get Resume PDF',
    tagline: 'Amplify speed with AI, turn ideas into running software.',
    subTagline: 'I focus on AI application development, Web full-stack projects, and building productivity tools. I enjoy leveraging AI programming systems to quickly complete prototyping, feature development, and deployment.',
    manifestoTitle: 'My Dev Manifesto',
    manifestoText: '"AI is not replacing programmers; AI is empowering developers who have ideas with 10x or 100x momentum. I want to be the one running at the forefront of this era, constantly landing product ideas."',
    targetRoles: 'CAREER TARGETS',
    contactMeTitle: 'Let\'s Chat About Projects, Opportunities or Ideas',
    emailContact: 'EMAIL',
    networks: 'NETWORKS',
    sendEmail: 'Send Email Now',
    visitDemo: 'Visit Demo',
    viewSource: 'View Code',
    privateSource: 'Private Repo',
    comingSoon: 'Demo Coming Soon',
    copiedText: 'Email copied to clipboard!',
    viewAll: 'All',
    readMore: 'Read More',
    visitorStats: 'Visitor Stats Monitor',
    statsToday: 'Today',
    statsTotal: 'Total Visits',
    statsOnline: 'Online Users',
    statsServer: 'System Status',
    statsActive: 'Operational'
  }
}
