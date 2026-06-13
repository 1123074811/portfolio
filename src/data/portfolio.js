/**
 * 统一数据出口
 * ───────────────────────────────────────────────
 * 合并「手填数据」(portfolioData.js) 与「GitHub 自动数据」(githubData.json)：
 *   · projects        → GitHub 自动生成优先；没有则回退手填（首次 CI 跑之前）
 *   · personalInfo    → 手填为主，GitHub profile 增强头像/链接
 *   · skills/exp/blog → 始终手填（GitHub 拿不到这些）
 *   · githubActivity  → 动态板块数据（语言占比 / 最近活跃 / followers）
 *
 * 组件统一从这里 import，不再直接引 portfolioData / githubData。
 */
import { portfolioData } from './portfolioData'
import github from './githubData.json'

const hasAuto = Array.isArray(github.projects) && github.projects.length > 0

export const projects = hasAuto ? github.projects : portfolioData.projects
export const githubActivity = github.activity || null
export const githubProfile = github.profile || null
export const githubGeneratedAt = github.generatedAt || null
export const dataSource = hasAuto ? 'github' : 'manual'

export const personalInfo = {
  ...portfolioData.personalInfo,
  ...(github.profile
    ? {
        avatar: github.profile.avatar || portfolioData.personalInfo.avatar,
        github: github.profile.htmlUrl || portfolioData.personalInfo.github,
        ...(github.profile.bio ? { subTagline: github.profile.bio } : {}),
      }
    : {}),
}

// 透传手填的其余内容
export const { aboutMe, categories, categoriesEn, skillGroups, experiences, blogArticles } = portfolioData
export { portfolioData }
