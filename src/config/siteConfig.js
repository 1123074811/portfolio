/**
 * 站点风格配置
 * ───────────────────────────────────────────────
 * 改这里的 theme 一个字段，即可整站切换视觉风格：
 *
 *   'classic' → 经典版：Cyber 霓虹暗黑多分区主页
 *               （Navbar + Hero/About/Projects/Skills/Blog/Experience/Contact + 详情页）
 *
 *   'gallery' → 画廊版：无限画廊作品墙
 *               （深暖底 3D 倾斜卡片墙 · 对角漂移 · 悬停暂停 · 点击查看详情）
 *
 * 两套风格共用同一份数据，互不影响。
 */
export const siteConfig = {
  theme: 'gallery', // 'classic' | 'gallery'

  /**
   * GitHub 自动同步配置
   * ───────────────────────────────────────────────
   * 由 scripts/generate-portfolio.mjs（在 GitHub Actions 里定时跑）读取，
   * 拉取你的公开仓库 → DeepSeek 生成文案 → 写入 src/data/githubData.json。
   */
  github: {
    // ⚠️ 必填：你的 GitHub 登录名（主页 URL github.com/<这里> 的那段，只能英文/数字/连字符）
    username: 'vibe-coder',

    // 仓库智能筛选规则
    filter: {
      excludeForks: true,        // 排除 fork 的仓库
      excludeArchived: true,     // 排除已归档仓库
      requireDescriptionOrReadme: true, // 必须有描述或 README
      maxProjects: 9,            // 最多生成多少个项目卡片（按 star + 活跃度排序取前 N）
      // 只生成打了这些 topic 的仓库（留空数组 = 不限制，走智能排序）
      includeTopics: [],
      // 强制排除的仓库名
      excludeRepos: [],
    },
  },
}
